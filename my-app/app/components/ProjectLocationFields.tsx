'use client';

import { useState } from 'react';

export default function ProjectLocationFields({ latitude, longitude }: { latitude: number | null; longitude: number | null }) {
  const [values, setValues] = useState({ latitude: latitude?.toString() ?? '', longitude: longitude?.toString() ?? '' });
  const [message, setMessage] = useState('');

  function useCurrentLocation() {
    if (!navigator.geolocation) { setMessage('This browser cannot provide device location. Enter the coordinates manually.'); return; }
    setMessage('Getting your location…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setValues({ latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) }); setMessage('Location added. Review it, then save the project.'); },
      () => setMessage('Location access was not available. Allow permission and try again, or enter coordinates manually.'),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  return <div className="grid gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 md:col-span-2"><div><p className="text-sm font-semibold text-emerald-950">Project map location</p><p className="mt-1 text-xs text-slate-600">Enter coordinates manually, or use the device&apos;s current location while you are at the project site.</p></div><div className="grid gap-3 md:grid-cols-2"><label className="grid gap-1 text-sm font-medium">Latitude<input name="latitude" type="number" step="any" value={values.latitude} onChange={(event) => setValues((current) => ({ ...current, latitude: event.target.value }))} placeholder="e.g. 0.3476" className="rounded border border-gray-300 px-3 py-2 font-normal" /></label><label className="grid gap-1 text-sm font-medium">Longitude<input name="longitude" type="number" step="any" value={values.longitude} onChange={(event) => setValues((current) => ({ ...current, longitude: event.target.value }))} placeholder="e.g. 32.5825" className="rounded border border-gray-300 px-3 py-2 font-normal" /></label></div><div className="flex flex-wrap items-center gap-3"><button type="button" onClick={useCurrentLocation} className="rounded border border-emerald-800 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100">Use my current location</button><a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="text-sm font-semibold text-emerald-800 hover:underline">Find coordinates in Google Maps ↗</a></div>{message && <p role="status" className="text-xs text-slate-600">{message}</p>}</div>;
}
