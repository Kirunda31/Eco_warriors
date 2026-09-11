import { prisma } from '@/lib/prisma';
import { requireStaff, isProgramManager } from '@/lib/auth';

const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

function brandedPdf(lines: string[]) {
  const escaped = lines.map(line => line.replace(/[\\()]/g, '\\$&').slice(0, 100));
  const stream = ['BT', '/F1 20 Tf', '50 760 Td', '(Eco Warriors Initiative) Tj', '/F1 12 Tf', '0 -24 Td', '(Impact summary) Tj', ...escaped.flatMap(line => ['0 -18 Td', `(${line}) Tj`]), 'ET'].join('\n');
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`];
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf); pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}

export async function GET(request: Request) {
  const user = await requireStaff();
  const projectWhere = isProgramManager(user) ? { program: { managerId: user.id } } : {};
  const [records, sessions] = await Promise.all([
    prisma.deliveryRecord.findMany({ where: { project: projectWhere, status: 'approved' }, include: { project: { select: { title: true, program: { select: { name: true } } } } }, orderBy: { activityDate: 'desc' } }),
    prisma.beneficiarySession.findMany({ where: { project: projectWhere }, include: { project: { select: { title: true, program: { select: { name: true } } } } }, orderBy: { sessionDate: 'desc' } }),
  ]);
  const csv = ['Record type,Date,Program,Project,Metric / session,Quantity,Location', ...records.map(r => [escape('Delivery'), escape(r.activityDate.toISOString().slice(0, 10)), escape(r.project.program.name), escape(r.project.title), escape(r.metricType), r.quantity, ''].join(',')), ...sessions.map(s => [escape('Beneficiary session'), escape(s.sessionDate.toISOString().slice(0, 10)), escape(s.project.program.name), escape(s.project.title), escape(s.sessionType), s.beneficiaryCount, escape(s.location)].join(','))].join('\n');
  if (new URL(request.url).searchParams.get('format') === 'pdf') {
    const totals = records.reduce<Record<string, number>>((result, record) => ({ ...result, [record.metricType]: (result[record.metricType] ?? 0) + record.quantity }), {});
    const pdf = brandedPdf([`Generated: ${new Date().toLocaleDateString('en-UG')}`, `Approved delivery records: ${records.length}`, `Pads distributed: ${(totals.pads_distributed ?? 0).toLocaleString()}`, `Trees planted: ${(totals.trees_planted ?? 0).toLocaleString()}`, `Schools reached: ${(totals.schools_reached ?? 0).toLocaleString()}`, `Aggregate beneficiaries reached: ${(sessions.reduce((sum, session) => sum + session.beneficiaryCount, 0)).toLocaleString()}`]);
    return new Response(pdf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="eco-warriors-impact-summary.pdf"' } });
  }
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="eco-warriors-impact-export.csv"' } });
}
