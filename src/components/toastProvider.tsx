import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider: React.FC = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="!w-[280px]"
        toastClassName={() =>
          "bg-gray-50 text-black text-[11px] min-h-[35px] px-2 py-1 rounded shadow-lg flex items-center gap-1"
        }
        closeButton={({ closeToast }: any) => (
          <button
            onClick={closeToast}
            className="ml-auto text-red-500 hover:text-black text-xs leading-none"
          >
            ×
          </button>
        )}
      />

      <style>
        {`
          .Toastify__toast-icon {
            margin-right: 4px;
          }

          .Toastify__toast-icon svg {
            width: 14px;
            height: 14px;
          }
        `}
      </style>
    </>
  );
};

export default ToastProvider;