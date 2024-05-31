import { deleteRequest } from "../services/api";
import { toast } from "react-toastify";

export function formatCurrencyUZS(amount) {
  const formatter = new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

export const handleDelete = (url, setLoader, handleUpdate, token) => {
  setLoader(true);
  deleteRequest(url, token)
    .then(({ data }) => {
      setLoader(false);
      toast.info(data?.result);
      handleUpdate(true);
    })
    .catch((err) => {
      setLoader(false);
      toast.error(err?.response?.data?.result);
    });
};
