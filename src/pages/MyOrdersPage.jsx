import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useOrders } from "../context/OrderContext";

export default function MyOrdersPage() {
  const { language, t } = useLanguage();
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Package size={64} className="text-navy-200 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-navy-800 mb-2">
            {t("orders.title")}
          </h1>
          <p className="text-navy-400 mb-2">{t("orders.empty")}</p>
          <p className="text-sm text-navy-300 mb-8">{t("orders.emptyDesc")}</p>
          <Link
            to="/catalog"
            className="btn-gold text-white px-8 py-3 rounded-lg font-semibold text-sm inline-block"
          >
            {t("orders.startShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-navy-800 mb-8">
          {t("orders.title")}
        </h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-navy-400">
                    {t("orders.orderId")}:{" "}
                    <span className="font-semibold text-navy-700">
                      {order.id}
                    </span>
                  </p>
                  <p className="text-xs text-navy-300">
                    {t("orders.date")}: {order.date}
                  </p>
                </div>
                <span className="px-3 py-1 bg-gold-50 text-gold-600 text-xs font-semibold rounded-full capitalize">
                  {t("orders.processing")}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name?.[language] || ""}
                      className="w-10 h-10 rounded-lg border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <span className="text-sm text-navy-400">
                  {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                  {t("orders.items")}
                </span>
                <span className="ml-auto text-lg font-bold text-navy-800">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
