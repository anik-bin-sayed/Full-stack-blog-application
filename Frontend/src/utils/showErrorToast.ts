import { toast } from "react-toastify";

type ErrorResponse = {
  data?: {
    [key: string]: string | string[];
  };
};

export const showErrorToast = (error: unknown): void => {
  const err = error as ErrorResponse;

  if (!err?.data) {
    toast.error("Something went wrong");
    return;
  }

  const errors = err.data;

  Object.keys(errors).forEach((key) => {
    const message = errors[key];

    if (Array.isArray(message)) {
      message.forEach((msg) => toast.error(msg));
    } else if (typeof message === "string") {
      toast.error(message);
    }
  });
};
