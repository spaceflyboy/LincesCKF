import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const OrderContext = createContext();

const ORDERS_STORAGE_KEY = "lincesckf_orders";

function loadOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (items, total, shippingInfo) => {
    const orderId =
      "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const newOrder = {
      id: orderId,
      items,
      total,
      shippingInfo,
      date: new Date().toLocaleDateString(),
      status: "processing",
    };
    setOrders((prev) => [newOrder, ...prev]);
    return orderId;
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
