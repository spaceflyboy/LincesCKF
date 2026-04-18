import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import {
  apiGetCart,
  apiAddToCart,
  apiUpdateCartItem,
  apiRemoveFromCart,
} from "../utils/api";

const CartContext = createContext();

const CART_STORAGE_KEY = "lincesckf_cart";

// Load local cart for non-authenticated users
function loadLocalCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState(loadLocalCart);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calculate cart total from items
  const calculateTotal = useCallback((cartItems) => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  }, []);

  // Sync cart: merge guest cart into server on login, then load from API
  useEffect(() => {
    if (!user?.id) {
      const localItems = loadLocalCart();
      setItems(localItems);
      setCartTotal(calculateTotal(localItems));
      return;
    }

    let cancelled = false;
    (async () => {
      const localItems = loadLocalCart();
      if (localItems.length > 0) {
        for (const item of localItems) {
          try {
            await apiAddToCart(
              item.id,
              item.quantity || 1,
              item.selectedSize || null,
            );
          } catch (e) {
            console.error("Failed to merge cart item:", e);
          }
        }
        localStorage.removeItem(CART_STORAGE_KEY);
      }
      if (!cancelled) {
        await fetchCart();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save to localStorage for non-authenticated fallback
  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      setCartTotal(calculateTotal(items));
    }
  }, [items, isAuthenticated, calculateTotal]);

  // Fetch cart from backend API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await apiGetCart();
      // Map backend cart items to frontend format
      const mappedItems = data.items.map((item) => ({
        id: item.product_id,
        name: { en: item.name_en, es: item.name_es },
        description: { en: item.description_en, es: item.description_es },
        price: parseFloat(item.price),
        image: item.image,
        category: item.category,
        quantity: item.quantity,
        selectedSize: item.selected_size,
        sizes: item.sizes,
      }));
      setItems(mappedItems);
      setCartTotal(parseFloat(data.total) || 0);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product) => {
    if (isAuthenticated()) {
      try {
        const data = await apiAddToCart(product.id, 1, product.selectedSize || null);
        const mappedItems = data.items.map((item) => ({
          id: item.product_id,
          name: { en: item.name_en, es: item.name_es },
          description: { en: item.description_en, es: item.description_es },
          price: parseFloat(item.price),
          image: item.image,
          category: item.category,
          quantity: item.quantity,
          selectedSize: item.selected_size,
          sizes: item.sizes,
        }));
        setItems(mappedItems);
        setCartTotal(parseFloat(data.total) || 0);
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    } else {
      // Fallback: local cart for non-authenticated users
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (isAuthenticated()) {
      try {
        const data = await apiRemoveFromCart(productId);
        const mappedItems = data.items.map((item) => ({
          id: item.product_id,
          name: { en: item.name_en, es: item.name_es },
          description: { en: item.description_en, es: item.description_es },
          price: parseFloat(item.price),
          image: item.image,
          category: item.category,
          quantity: item.quantity,
          selectedSize: item.selected_size,
          sizes: item.sizes,
        }));
        setItems(mappedItems);
        setCartTotal(parseFloat(data.total) || 0);
      } catch (error) {
        console.error("Failed to remove from cart:", error);
      }
    } else {
      setItems((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (isAuthenticated()) {
      try {
        const data = await apiUpdateCartItem(productId, quantity);
        const mappedItems = data.items.map((item) => ({
          id: item.product_id,
          name: { en: item.name_en, es: item.name_es },
          description: { en: item.description_en, es: item.description_es },
          price: parseFloat(item.price),
          image: item.image,
          category: item.category,
          quantity: item.quantity,
          selectedSize: item.selected_size,
          sizes: item.sizes,
        }));
        setItems(mappedItems);
        setCartTotal(parseFloat(data.total) || 0);
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    setCartTotal(0);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
