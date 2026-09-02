import { prisma } from '@/lib/prisma';

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { year: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="flex flex-col gap-4">
        {reports.map((report) => (
          <div key={report.id} className="border border-gray-200 rounded p-4">
            <h2 className="text-lg font-semibold">{report.title}</h2>
            <p className="text-sm text-gray-500">{report.category} - {report.year}</p>
            <p className="text-gray-700 mt-2">{report.description}</p>
            <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-green-800 font-medium hover:underline">Download PDF</a>
          </div>
        ))}
      </div>
    </div>
  );
}