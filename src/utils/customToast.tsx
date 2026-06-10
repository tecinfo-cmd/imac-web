import { toast } from "sonner";

interface CustomToastOptions {
  id?: string | number;
  [key: string]: any;
}

const success = (
  message: string,
  descriptionOrOptions?: string | CustomToastOptions,
  options?: CustomToastOptions
) => {
  let description: string | undefined;
  let finalOptions: CustomToastOptions | undefined;

  if (typeof descriptionOrOptions === "string") {
    description = descriptionOrOptions;
    finalOptions = options;
  } else if (descriptionOrOptions && typeof descriptionOrOptions === "object") {
    finalOptions = descriptionOrOptions;
  }

  toast.custom(
    (t) => (
      <div className="relative bg-[#DFEEE5] flex flex-col items-center text-center gap-4 py-6 px-4 shadow border border-[#0A3503] rounded-lg max-w-md w-full">
        <button
          onClick={() => toast.dismiss(t)}
          className="absolute top-2 right-3 text-[#0A3503] text-xl hover:opacity-70"
          aria-label="Fechar"
        >
          ✕
        </button>
        <h1 className="text-[#0A3503] text-xl font-semibold">{message}</h1>
        {description && <p className="text-sm text-[#0A3503]">{description}</p>}
      </div>
    ),
    finalOptions
  );
};

const error = (
  message: string,
  descriptionOrOptions?: string | CustomToastOptions,
  options?: CustomToastOptions
) => {
  let description: string | undefined;
  let finalOptions: CustomToastOptions | undefined;

  if (typeof descriptionOrOptions === "string") {
    description = descriptionOrOptions;
    finalOptions = options;
  } else if (descriptionOrOptions && typeof descriptionOrOptions === "object") {
    finalOptions = descriptionOrOptions;
  }

  toast.custom(
    (t) => (
      <div className="relative bg-[#FEEDEE] flex flex-col items-center text-center gap-4 py-6 px-4 shadow border border-[#7F1D1D] rounded-lg max-w-md w-full">
        <button
          onClick={() => toast.dismiss(t)}
          className="absolute top-2 right-3 text-[#7F1D1D] text-xl hover:opacity-70"
          aria-label="Fechar"
        >
          ✕
        </button>
        <h1 className="text-[#7F1D1D] text-xl font-semibold">{message}</h1>
        {description && <p className="text-sm text-[#7F1D1D]">{description}</p>}
      </div>
    ),
    finalOptions
  );
};

export const customToast = { success, error };
