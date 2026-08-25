import axios from "axios";

export const handleApiError = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again."
): string => {
  // Axios error
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message;

    if (typeof backendMessage === "string" && backendMessage.trim()) {
      return backendMessage;
    }

    if (error.message) {
      return error.message;
    }
  }

  // Normal JavaScript Error
  if (error instanceof Error) {
    return error.message;
  }

  // Unknown error
  return fallbackMessage;
};