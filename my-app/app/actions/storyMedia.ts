export function getVideoUrl(value: FormDataEntryValue | null) {
  const input = typeof value === 'string' ? value.trim() : '';
  if (!input) return null;

  const url = new URL(input);
  if (url.protocol !== 'https:') throw new Error('Video link must use HTTPS.');
  return url.href;
}
