import { createPartner } from '@/app/actions/createPartner';

export default function NewPartnerPage() {
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Partner</h1>
      <form action={createPartner} className="flex flex-col gap-4">
        <input type="text" name="organizationName" placeholder="Organization Name" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="url" name="logo" placeholder="Logo URL (optional)" className="border border-gray-300 rounded px-3 py-2" />
        <textarea name="description" placeholder="Description" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="url" name="website" placeholder="Website (optional)" className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="partnershipType" placeholder="Partnership Type" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="number" name="displayOrder" placeholder="Display Order (e.g. 1, 2, 3)" className="border border-gray-300 rounded px-3 py-2" />
        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Add Partner</button>
      </form>
    </div>
  );
}