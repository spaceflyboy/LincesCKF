import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import { apiGetOrders, apiPlaceOrder } from "../utils/api";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch orders from backend API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiGetOrders();
      // Map backend orders to frontend format
      const mappedOrders = data.orders.map((order) => ({
        id: order.id,
        total: parseFloat(order.total_price),
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString(),
        shippingInfo: {
          address: order.shipping_address,
          city: order.shipping_city,
          state: order.shipping_state,
          zip: order.shipping_zip,
        },
        items: order.items.map((item) => ({
          id: item.product_id,
          name: { en: item.name_en, es: item.name_es },
          image: item.image,
          quantity: item.quantity,
          price: parseFloat(item.price),
          selectedSize: item.selected_size,
        })),
      }));
      setOrders(mappedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Place a new order via backend API
  const placeOrder = async (items, total, shippingInfo) => {
    const data = await apiPlaceOrder(shippingInfo);
    await fetchOrders();
    return data.orderId;
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, loading, fetchOrders }}>
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
