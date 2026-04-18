import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Bell, User, Lock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import {
  apiUpdateProfile,
  apiChangePassword,
  apiGetPreferences,
  apiUpdatePreferences,
} from "../utils/api";
import FormField from "../components/FormField";

const defaultPrefs = {
  emailMarketing: true,
  smsOrderUpdates: false,
};

function parsePreferences(raw) {
  if (!raw) return { ...defaultPrefs };
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return { ...defaultPrefs, ...parsed };
    } catch {
      return { ...defaultPrefs };
    }
  }
  if (typeof raw === "object") return { ...defaultPrefs, ...raw };
  return { ...defaultPrefs };
}

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, updateUser, setShowAuthModal } = useAuth();
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [prefsMsg, setPrefsMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [prefsErr, setPrefsErr] = useState("");
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    if (user) {
      setProfileName(user.name || "");
      setProfileEmail(user.email || "");
    }
  }, [user, isAuthenticated, setShowAuthModal]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGetPreferences();
        if (!cancelled) {
          setPrefs(parsePreferences(data.preferences));
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setPrefsErr(t("settings.loadPrefsError"));
      } finally {
        if (!cancelled) setLoadingPrefs(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, t]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileErr("");
    setProfileMsg("");
    try {
      const data = await apiUpdateProfile(profileName.trim(), profileEmail.trim());
      updateUser(data.user);
      setProfileMsg(t("settings.profileSaved"));
    } catch (err) {
      setProfileErr(err.message || t("settings.saveFailed"));
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordErr("");
    setPasswordMsg("");
    if (newPassword.length < 6) {
      setPasswordErr(t("settings.passwordTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr(t("auth.passwordMismatch"));
      return;
    }
    try {
      await apiChangePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMsg(t("settings.passwordSaved"));
    } catch (err) {
      setPasswordErr(err.message || t("settings.saveFailed"));
    }
  };

  const handlePrefsSave = async (e) => {
    e.preventDefault();
    setPrefsErr("");
    setPrefsMsg("");
    try {
      await apiUpdatePreferences(prefs);
      setPrefsMsg(t("settings.prefsSaved"));
    } catch (err) {
      setPrefsErr(err.message || t("settings.saveFailed"));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="text-navy-600 text-sm">{t("settings.signInPrompt")}</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-gold-500 mb-6"
        >
          <ChevronLeft size={16} />
          {t("nav.home")}
        </Link>
        <h1 className="text-3xl font-serif font-bold text-navy-800 mb-2">
          {t("settings.title")}
        </h1>
        <p className="text-navy-400 text-sm mb-10">{t("settings.subtitle")}</p>

        {/* Profile */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-gold-500" />
            <h2 className="text-lg font-semibold text-navy-800">
              {t("settings.accountSection")}
            </h2>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <FormField
              label={t("auth.name")}
              name="name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />
            <FormField
              label={t("auth.email")}
              name="email"
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              required
            />
            {profileErr && (
              <p className="text-red-500 text-sm">{profileErr}</p>
            )}
            {profileMsg && (
              <p className="text-green-600 text-sm">{profileMsg}</p>
            )}
            <button
              type="submit"
              className="btn-gold text-white px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
            >
              {t("settings.saveProfile")}
            </button>
          </form>
        </section>

        {/* Password */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-gold-500" />
            <h2 className="text-lg font-semibold text-navy-800">
              {t("settings.passwordSection")}
            </h2>
          </div>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <FormField
              label={t("settings.currentPassword")}
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <FormField
              label={t("settings.newPassword")}
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <FormField
              label={t("auth.confirmPassword")}
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordErr && (
              <p className="text-red-500 text-sm">{passwordErr}</p>
            )}
            {passwordMsg && (
              <p className="text-green-600 text-sm">{passwordMsg}</p>
            )}
            <button
              type="submit"
              className="btn-gold text-white px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
            >
              {t("settings.updatePassword")}
            </button>
          </form>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-gold-500" />
            <h2 className="text-lg font-semibold text-navy-800">
              {t("settings.notificationsSection")}
            </h2>
          </div>
          {loadingPrefs ? (
            <div className="py-8 text-center text-navy-400 text-sm">
              {t("settings.loading")}
            </div>
          ) : (
            <form onSubmit={handlePrefsSave} className="space-y-5">
              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <span className="text-sm text-navy-700">
                  {t("settings.emailNotif")}
                </span>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-gold-500 focus:ring-gold-400"
                  checked={!!prefs.emailMarketing}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, emailMarketing: e.target.checked }))
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <span className="text-sm text-navy-700">
                  {t("settings.smsNotif")}
                </span>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-gold-500 focus:ring-gold-400"
                  checked={!!prefs.smsOrderUpdates}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, smsOrderUpdates: e.target.checked }))
                  }
                />
              </label>
              {prefsErr && <p className="text-red-500 text-sm">{prefsErr}</p>}
              {prefsMsg && (
                <p className="text-green-600 text-sm">{prefsMsg}</p>
              )}
              <button
                type="submit"
                className="btn-gold text-white px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
              >
                {t("settings.savePreferences")}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
