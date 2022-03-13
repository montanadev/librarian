import { toast } from "react-toastify";

export function toastInfo(msg: string) {
  toast.info(msg, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
export function toastSuccess(msg: string) {
  toast.success(msg, {
    position: "top-right",
    autoClose: 750,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
}

export function toastError(msg: string) {
  toast.error(msg, {
    position: "top-right",
    autoClose: 10000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
