import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { validateEmail } from "../utils/validation";
import FormField from "./FormField";

export default function AuthModal() {
  const { t } = useLanguage();
  const { login, register, showAuthModal, setShowAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [errors, setErrors] = useState({});

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [accountType, setAccountType] = useState("customer");

  if (!showAuthModal) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    const errs = {};
    if (!loginEmail) errs.loginEmail = t("auth.required");
    else if (!validateEmail(loginEmail))
      errs.loginEmail = t("auth.invalidEmail");
    if (!loginPassword) errs.loginPassword = t("auth.required");
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    login(loginEmail);
    resetForms();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const errs = {};
    if (!regName) errs.regName = t("auth.required");
    if (!regEmail) errs.regEmail = t("auth.required");
    else if (!validateEmail(regEmail)) errs.regEmail = t("auth.invalidEmail");
    if (!regPassword) errs.regPassword = t("auth.required");
    if (regPassword !== regConfirm)
      errs.regConfirm = t("auth.passwordMismatch");
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    register(regName, regEmail, regPassword, accountType);
    resetForms();
  };

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegName("");
    setRegEmail("");
    setRegPassword("");
    setRegConfirm("");
    setAccountType("customer");
    setErrors({});
  };

  const close = () => {
    setShowAuthModal(false);
    resetForms();
    setActiveTab("login");
  };

  return (
    <div
      className="fixed inset-0 z-[100] modal-backdrop flex items-center justify-center p-4"
      onClick={close}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab("login");
                setErrors({});
              }}
              className={`text-sm font-semibold pb-1 transition-colors cursor-pointer ${
                activeTab === "login"
                  ? "text-gold-500 border-b-2 border-gold-500"
                  : "text-navy-400 hover:text-navy-600"
              }`}
            >
              {t("auth.login")}
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setErrors({});
              }}
              className={`text-sm font-semibold pb-1 transition-colors cursor-pointer ${
                activeTab === "register"
                  ? "text-gold-500 border-b-2 border-gold-500"
                  : "text-navy-400 hover:text-navy-600"
              }`}
            >
              {t("auth.register")}
            </button>
          </div>
          <button
            onClick={close}
            className="text-navy-400 hover:text-navy-600 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <FormField
                label={t("auth.email")}
                name="loginEmail"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                error={errors.loginEmail}
                required
              />
              <FormField
                label={t("auth.password")}
                name="loginPassword"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                error={errors.loginPassword}
                required
              />
              <button
                type="submit"
                className="btn-gold text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer"
              >
                {t("auth.loginBtn")}
              </button>
              <p className="text-center text-sm text-navy-400">
                {t("auth.noAccount")}{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className="text-gold-500 font-medium cursor-pointer"
                >
                  {t("auth.register")}
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <FormField
                label={t("auth.name")}
                name="regName"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                error={errors.regName}
                required
              />
              <FormField
                label={t("auth.email")}
                name="regEmail"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                error={errors.regEmail}
                required
              />
              <FormField
                label={t("auth.password")}
                name="regPassword"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                error={errors.regPassword}
                required
              />
              <FormField
                label={t("auth.confirmPassword")}
                name="regConfirm"
                type="password"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                error={errors.regConfirm}
                required
              />

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  {t("auth.accountType")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType("customer")}
                    className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer ${
                      accountType === "customer"
                        ? "border-gold-500 bg-gold-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-navy-800">
                      {t("auth.customer")}
                    </p>
                    <p className="text-xs text-navy-400 mt-0.5">
                      {t("auth.customerDesc")}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("brand")}
                    className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer ${
                      accountType === "brand"
                        ? "border-gold-500 bg-gold-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-navy-800">
                      {t("auth.brand")}
                    </p>
                    <p className="text-xs text-navy-400 mt-0.5">
                      {t("auth.brandDesc")}
                    </p>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-gold text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer"
              >
                {t("auth.registerBtn")}
              </button>
              <p className="text-center text-sm text-navy-400">
                {t("auth.hasAccount")}{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-gold-500 font-medium cursor-pointer"
                >
                  {t("auth.login")}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
