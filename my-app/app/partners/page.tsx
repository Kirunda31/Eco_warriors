import { prisma } from '@/lib/prisma';

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div><section className="bg-emerald-900 px-6 py-16 text-white sm:py-20"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">Collaboration</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Our partners.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-100">We create greater impact by working with organizations that share our commitment to communities and the environment.</p></div></section><section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <article key={partner.id} className="rounded-xl border border-slate-200 p-6 text-center shadow-sm">
            {partner.logo && (
              <img src={partner.logo} alt={partner.organizationName} className="h-16 mx-auto object-contain mb-2" />
            )}
            <p className="font-semibold">{partner.organizationName}</p><p className="mt-1 text-sm text-emerald-700">{partner.partnershipType}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{partner.description}</p>
          </article>
        ))}
      </div>{partners.length === 0 && <p className="text-slate-600">Partner information will be shared soon.</p>}</section></div>
  );
}
