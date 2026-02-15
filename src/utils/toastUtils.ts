import { toast } from "react-toastify";

export const showSuccess = (message: string): void => {
  toast.success(message);
};

export const showError = (message: string): void => {
  toast.error(message);
};

export const showInfo = (message: string): void => {
  toast.info(message);
};

export const showWarning = (message: string): void => {
  toast.warning(message);
};

export const showConfirm = (message: string): boolean => {
  return window.confirm(message);
};