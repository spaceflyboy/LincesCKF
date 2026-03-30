import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Globe,
  Menu,
  X,
  LogOut,
  Package,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navigation() {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout, setShowAuthModal } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const userMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/catalog", label: t("nav.catalog") },
    { path: "/services", label: t("nav.services") },
    { path: "/custom-orders", label: t("nav.customOrders") },
    { path: "/about", label: t("nav.aboutUs") },
    { path: "/contact", label: t("nav.contact") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-xl font-serif font-bold text-navy-800">
              Linces'
            </span>
            <span className="text-xl font-serif font-bold text-gold-500">
              CKF
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-gold-500 border-b-2 border-gold-500 pb-0.5"
                    : "text-navy-700 hover:text-gold-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm text-navy-600 hover:text-gold-500 transition-colors cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe size={18} />
              <span className="hidden sm:inline font-medium">
                {language === "en" ? "ES" : "EN"}
              </span>
            </button>

            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1 text-sm text-navy-600 hover:text-gold-500 transition-colors cursor-pointer"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline font-medium">
                      {user.name}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in">
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-navy-700 hover:bg-navy-50"
                      >
                        <Package size={16} />
                        {t("nav.myOrders")}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-navy-700 hover:bg-navy-50 cursor-pointer"
                      >
                        <LogOut size={16} />
                        {t("auth.logout")}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-navy-600 hover:text-gold-500 transition-colors cursor-pointer"
                  aria-label="Login"
                >
                  <User size={18} />
                </button>
              )}
            </div>

            <Link
              to="/checkout"
              className="relative text-navy-600 hover:text-gold-500 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-navy-600 hover:text-gold-500 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "text-gold-500 bg-gold-50"
                      : "text-navy-700 hover:bg-navy-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/orders"
                  className="px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 rounded-lg"
                >
                  {t("nav.myOrders")}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
