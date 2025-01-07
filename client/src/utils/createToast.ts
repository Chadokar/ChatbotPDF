import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastType = "success" | "error" | "warning";

const createToast = (text: string, type: ToastType, time = 2): void => {
  // toast.dismiss();

  const properties: ToastOptions<unknown> = {
    position: "bottom-right",
    autoClose: time * 1000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    theme: "dark",
  };

  if (type === "success") toast.success(text, properties);
  else if (type === "error") toast.error(text, properties);
  else if (type === "warning") toast.warning(text, properties);
};

export default createToast;
