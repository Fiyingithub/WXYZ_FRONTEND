import type { ReactNode } from "react";
import { createContext,useContext,useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import type { ToastContextType, CartItem } from "../Types/Toast";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const ToastProvider = ({ children }: Props) => {
  const [waitingLoader, setWaitingLoader] = useState<boolean>(false);
  const [spinnerLoader, setSpinnerLoader] = useState<boolean>(false);

  const cartId = localStorage.getItem("cartId");

  const notifySuccess = (message: string, options = {}) =>
    toast.success(message, options);
  const notifyError = (message: string, options = {}) =>
    toast.error(message, options);
  const notifyInfo = (message: string, options = {}) =>
    toast.info(message, options);
  const notifyWarn = (message: string, options = {}) =>
    toast.warn(message, options);

  const showSpinnerLoader = () => setSpinnerLoader(true);
  const hideSpinnerLoader = () => setSpinnerLoader(false);
  const startWaitingLoader = () => setWaitingLoader(true);
  const stopWaitingLoader = () => setWaitingLoader(false);

  const addToCart = async (item: CartItem): Promise<void> => {
    startWaitingLoader();
    try {
      if (!cartId) {
        const response = await axios.post(
          "https://oneworld-fq81.onrender.com/api/Cart/create"
        );
        localStorage.setItem("cartId", response.data.cartId);

        try {
          await axios.post(
            `https://oneworld-fq81.onrender.com/api/Cart/${response.data.cartId}/add-item`,
            item
          );
        } catch (err) {
          console.error(err);
        } finally {
          stopWaitingLoader();
        }
        return;
      }

      await axios.post(
        `https://oneworld-fq81.onrender.com/api/Cart/${cartId}/add-item`,
        item
      );
    } catch (error) {
      notifyError("Error adding item to cart", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      },);

      console.log(error)
    } finally {
      stopWaitingLoader();
    }
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatNumberWithCommas = (number: number): string =>
    number.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const formatAmount = (amt: number): string =>
    amt.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <ToastContext.Provider
      value={{
        notifySuccess,
        notifyError,
        notifyInfo,
        notifyWarn,
        waitingLoader,
        startWaitingLoader,
        stopWaitingLoader,
        spinnerLoader,
        showSpinnerLoader,
        hideSpinnerLoader,
        addToCart,
        formatDate,
        formatNumberWithCommas,
        formatAmount,
      }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
