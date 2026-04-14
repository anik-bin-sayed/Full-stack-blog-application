import { format } from "date-fns";

export const formatDate = (date?: string | Date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) return "";

  return format(parsedDate, "dd MMM yyyy");
};
export const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `https://res.cloudinary.com/dtuxqsiuc/${cleanPath}`;
};

export const getLocation = (profile: any) => {
  const parts = [];
  if (profile?.city) parts.push(profile.city);
  if (profile?.country) parts.push(profile.country);
  if (profile?.address) parts.push(profile.address);
  return parts.join(", ");
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
