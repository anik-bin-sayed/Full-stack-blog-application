export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/";
export const AUTH_COOKIE_NAME = "__auth";
export const TOKEN_REFRESH_INTERVAL = 60 * 1000;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
