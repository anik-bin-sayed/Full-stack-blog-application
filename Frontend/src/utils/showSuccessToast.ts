import { toast } from "react-toastify";

type SuccessResponse = {
  message?: string;
  detail?: string;
};

export const showSuccessToast = (response?: SuccessResponse | string): void => {
  if (typeof response === "string") {
    toast.success(response);
    return;
  }

  if (response?.message) {
    toast.success(response.message);
    return;
  }

  if (response?.detail) {
    toast.success(response.detail);
    return;
  }

  // fallback
  toast.success("Operation successful");
};
