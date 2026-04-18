import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function OrderConfirmationPage() {
  const { t } = useLanguage();
  const { orderId } = useParams();
  const validOrderId =
    orderId &&
    orderId !== "undefined" &&
    !String(orderId).includes("[object") &&
    /^\d+$/.test(String(orderId));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-6 bg-gold-50 rounded-full flex items-center justify-center">
          <CheckCircle size={48} className="text-gold-500" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-navy-800 mb-2">
          {t("confirmation.title")}
        </h1>
        {validOrderId && (
          <p className="text-sm text-navy-400 mb-1">
            {t("confirmation.orderId")}:{" "}
            <span className="font-semibold text-navy-700">{orderId}</span>
          </p>
        )}
        {!validOrderId && (
          <p className="text-sm text-amber-700 mb-4 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            {t("confirmation.missingOrderId")}
          </p>
        )}
        <p className="text-sm text-navy-400 mb-8">
          {t("confirmation.message")}
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/orders"
            className="btn-gold text-white font-semibold py-3 rounded-lg text-sm block"
          >
            {t("confirmation.viewOrders")}
          </Link>
          <Link
            to="/catalog"
            className="text-sm text-gold-500 hover:text-gold-600 font-medium"
          >
            {t("confirmation.continueShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}
