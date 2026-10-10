export const toProductSlug = (name: string, id: string): string => {
  const namePart = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `${namePart}--${id}`;
};

export const idFromProductSlug = (slug: string): string => {
  const parts = slug.split('--');
  return parts[parts.length - 1];
};
