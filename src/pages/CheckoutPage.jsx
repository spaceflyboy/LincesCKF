import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import FormField from "../components/FormField";

export default function CheckoutPage() {
  const { language, t } = useLanguage();
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [shippingErrors, setShippingErrors] = useState({});

  const handleShippingChange = (e) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setShippingErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handlePlaceOrder = () => {
    const errs = {};
    if (!shipping.address.trim()) errs.address = t("auth.required");
    if (!shipping.city.trim()) errs.city = t("auth.required");
    if (!shipping.state.trim()) errs.state = t("auth.required");
    if (!shipping.zip.trim()) errs.zip = t("auth.required");

    if (Object.keys(errs).length > 0) {
      setShippingErrors(errs);
      return;
    }

    const orderId = placeOrder(items, cartTotal, shipping);
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <ShoppingBag size={64} className="text-navy-200 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-navy-800 mb-2">
            {t("cart.title")}
          </h1>
          <p className="text-navy-400 mb-6">{t("cart.empty")}</p>
          <p className="text-sm text-navy-300 mb-8">{t("cart.emptyDesc")}</p>
          <Link
            to="/catalog"
            className="btn-gold text-white px-8 py-3 rounded-lg font-semibold text-sm inline-block"
          >
            {t("cart.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-navy-800 mb-8">
          {t("cart.title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-navy-800 mb-4 font-sans">
                {t("cart.shippingInfo")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormField
                    label={t("cart.address")}
                    name="address"
                    value={shipping.address}
                    onChange={handleShippingChange}
                    error={shippingErrors.address}
                    required
                  />
                </div>
                <FormField
                  label={t("cart.city")}
                  name="city"
                  value={shipping.city}
                  onChange={handleShippingChange}
                  error={shippingErrors.city}
                  required
                />
                <FormField
                  label={t("cart.state")}
                  name="state"
                  value={shipping.state}
                  onChange={handleShippingChange}
                  error={shippingErrors.state}
                  required
                />
                <FormField
                  label={t("cart.zip")}
                  name="zip"
                  value={shipping.zip}
                  onChange={handleShippingChange}
                  error={shippingErrors.zip}
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-navy-800 text-sm">
                      {item.name[language]}
                    </h3>
                    <p className="text-sm text-navy-400">
                      ${item.price.toFixed(2)}
                    </p>
                    {item.selectedSize && (
                      <p className="text-xs text-navy-300 mt-0.5">
                        Size: <span className="font-medium text-navy-500">{item.selectedSize}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-navy-600 hover:bg-gray-50 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium text-navy-800 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-navy-600 hover:bg-gray-50 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-navy-800 w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-navy-300 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-navy-800 mb-4 font-sans">
                {t("cart.orderSummary")}
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-navy-400">{t("cart.subtotal")}</span>
                  <span className="text-navy-800 font-medium">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-navy-400">{t("cart.shipping")}</span>
                  <span className="text-green-600 font-medium">
                    {t("cart.free")}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-navy-800">
                    {t("cart.total")}
                  </span>
                  <span className="font-bold text-lg text-navy-800">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full btn-gold text-white font-semibold py-3 rounded-lg text-sm cursor-pointer"
              >
                {t("cart.placeOrder")}
              </button>
              <Link
                to="/catalog"
                className="block text-center mt-3 text-sm text-gold-500 hover:text-gold-600 font-medium"
              >
                {t("cart.continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
