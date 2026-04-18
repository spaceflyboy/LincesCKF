import { useState } from "react";
import { Send, MessageSquare, CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { validateEmail } from "../utils/validation";
import { apiSubmitContact } from "../utils/api";
import FormField from "../components/FormField";

export default function CustomPage() {
  const { t } = useLanguage();
  const WHATSAPP_NUMBER = "16823139504";
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    garmentType: "",
    fabric: "",
    measurements: "",
    details: "",
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
    if (!form.garmentType) errs.garmentType = t("auth.required");
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      // Submit custom order to backend API with type 'custom_order'
      await apiSubmitContact({
        name: form.name,
        email: form.email,
        subject: `Custom Order: ${form.garmentType}`,
        message: `Garment: ${form.garmentType}\nFabric: ${form.fabric}\nMeasurements: ${form.measurements}\nDetails: ${form.details}`,
        type: "custom_order",
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit custom order:", error);
      setErrors({ submit: "Failed to submit order. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi, I would like to discuss a custom order.",
  )}`;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center animate-fade-in-up">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-navy-800">
            {t("custom.success")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-navy-800 mb-2">
            {t("custom.title")}
          </h1>
          <p className="text-navy-400">{t("custom.subtitle")}</p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormField
              label={t("custom.name")}
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <FormField
              label={t("custom.email")}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <FormField
              label={t("custom.garmentType")}
              name="garmentType"
              as="select"
              value={form.garmentType}
              onChange={handleChange}
              error={errors.garmentType}
              required
            >
              <option value="">{t("custom.selectGarment")}</option>
              <option value="blouse">{t("custom.blouse")}</option>
              <option value="dress">{t("custom.dress")}</option>
              <option value="shirt">{t("custom.shirt")}</option>
              <option value="scarf">{t("custom.scarf")}</option>
            </FormField>
            <FormField
              label={t("custom.fabric")}
              name="fabric"
              as="select"
              value={form.fabric}
              onChange={handleChange}
            >
              <option value="">{t("custom.selectFabric")}</option>
              <option value="satin">{t("custom.silkSatin")}</option>
              <option value="chiffon">{t("custom.silkChiffon")}</option>
              <option value="crepe">{t("custom.silkCrepe")}</option>
              <option value="twill">{t("custom.silkTwill")}</option>
            </FormField>
            <FormField
              label={t("custom.measurements")}
              name="measurements"
              value={form.measurements}
              onChange={handleChange}
            />
            <FormField
              label={t("custom.details")}
              name="details"
              as="textarea"
              value={form.details}
              onChange={handleChange}
              placeholder={t("custom.detailsPlaceholder")}
              rows={4}
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
              {submitting ? "Submitting..." : t("custom.submit")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              <MessageSquare size={18} />
              {t("custom.whatsapp")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
