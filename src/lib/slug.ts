export function generateSlug(title: string): string {
    const coreSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
        .trim()
        .replace(/\s+/g, '-');    // Replace spaces with hyphens

    // Add a short random string to ensure uniqueness (collision avoidance)
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);

    return `${coreSlug}-${uniqueSuffix}`;
}
