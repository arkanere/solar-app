/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "Jan 15, 2025")
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Convert business slug to readable name
 * @param slug - Business slug (e.g., "acme-installers")
 * @returns Formatted name (e.g., "Acme Installers")
 */
export function formatBusinessName(slug: string | null | undefined): string {
  if (!slug) return "Unknown";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get Cloudinary image URL for project
 * @param project - Project object with cloudinary_public_id or image_url
 * @param size - Cloudinary size parameter (default: "w_400,h_400")
 * @returns Image URL or null
 */
export function getImageUrl(
  project: { cloudinary_public_id?: string; image_url?: string },
  cloudinaryCloudName: string,
  size: string = "w_400,h_400"
): string | null {
  if (project.cloudinary_public_id) {
    return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/c_fill,${size},q_auto,f_auto/${project.cloudinary_public_id}`;
  } else if (project.image_url) {
    return project.image_url;
  }
  return null;
}
