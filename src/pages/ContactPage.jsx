import { useState } from "react";
import { Send, CheckCircle, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { validateEmail } from "../utils/validation";
import { apiSubmitContact } from "../utils/api";
import FormField from "../components/FormField";

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name) errs.name = t("auth.required");
    if (!form.email) errs.email = t("auth.required");
    else if (!validateEmail(form.email)) errs.email = t("auth.invalidEmail");
    if (!form.message) errs.message = t("auth.required");
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      // Submit contact form to backend API
      await apiSubmitContact({ ...form, type: "contact" });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      setErrors({ submit: "Failed to send message. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center animate-fade-in-up">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-navy-800">
            {t("contact.success")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-navy-800 mb-2">
            {t("contact.title")}
          </h1>
          <p className="text-navy-400">{t("contact.subtitle")}</p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-navy-800 uppercase tracking-wider mb-4">
                {t("contact.visitTitle")}
              </h2>
              <ul className="space-y-4 text-sm text-navy-600">
                <li className="flex gap-3">
                  <MapPin className="text-gold-500 shrink-0 mt-0.5" size={18} />
                  <span>{t("contact.addressLine")}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="text-gold-500 shrink-0" size={18} />
                  <a
                    href={`tel:${t("contact.phoneRaw")}`}
                    className="hover:text-gold-600 font-medium text-navy-800"
                  >
                    {t("contact.phoneDisplay")}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="text-gold-500 shrink-0" size={18} />
                  <a
                    href={`mailto:${t("contact.emailAddress")}`}
                    className="hover:text-gold-600 font-medium text-navy-800 break-all"
                  >
                    {t("contact.emailAddress")}
                  </a>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <h2 className="text-sm font-semibold text-navy-800 uppercase tracking-wider px-6 pt-6 pb-2">
                {t("contact.mapTitle")}
              </h2>
              <iframe
                title={t("contact.mapTitle")}
                className="w-full h-56 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={t("contact.mapEmbedUrl")}
              />
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormField
              label={t("contact.name")}
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <FormField
              label={t("contact.email")}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <FormField
              label={t("contact.subject")}
              name="subject"
              value={form.subject}
              onChange={handleChange}
            />
            <FormField
              label={t("contact.message")}
              name="message"
              as="textarea"
              value={form.message}
              onChange={handleChange}
              error={errors.message}
              placeholder={t("contact.messagePlaceholder")}
              rows={5}
              required
            />

            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={16} />
              {submitting ? "Sending..." : t("contact.send")}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-5">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-400 hover:text-gold-500 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-400 hover:text-gold-500 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={22} />
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-400 hover:text-gold-500 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={22} />
            </a>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
