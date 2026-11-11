const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const toProductSlug = (name: string, id: string, category?: string): string => {
  const namePart = slugify(name);
  const slug = `${namePart}--${id}`;
  if (category) {
    const catPart = slugify(category);
    return `${catPart}/${slug}`;
  }
  return slug;
};

export const idFromProductSlug = (slug: string | string[]): string => {
  // Supports both formats:
  //   /product/category-name/product-name--id
  //   /product/product-name--id
  // The ID is always after the last "--"
  const fullSlug = Array.isArray(slug) ? slug.join('/') : slug;
  const parts = fullSlug.split('--');
  return parts[parts.length - 1];
};
