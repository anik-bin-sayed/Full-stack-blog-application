import { formatDistanceToNow } from "date-fns";

export const formatDate = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `https://res.cloudinary.com/dtuxqsiuc/${cleanPath}`;
};
