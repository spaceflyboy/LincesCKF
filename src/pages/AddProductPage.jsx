import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { apiCreateProduct, apiGetCategories } from "../utils/api";
import FormField from "../components/FormField";

export default function AddProductPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, setShowAuthModal } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    nameEn: "",
    nameEs: "",
    descriptionEn: "",
    descriptionEs: "",
    price: "",
    categoryId: "",
    image: "",
    sizes: "XS,S,M,L,XL",
  });

  // Redirect non-brand users or unauthenticated users
  useEffect(() => {
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    if (user?.accountType !== "brand") {
      navigate("/");
      return;
    }
    // Fetch categories for the dropdown
    fetchCategories();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCategories = async () => {
    try {
      const data = await apiGetCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.nameEn.trim()) errs.nameEn = "Product name is required";
    if (!form.price || parseFloat(form.price) <= 0) errs.price = "Valid price is required";
    if (!form.categoryId) errs.categoryId = "Category is required";
    if (!form.descriptionEn.trim()) errs.descriptionEn = "Description is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      const sizesArray = form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await apiCreateProduct({
        nameEn: form.nameEn,
        nameEs: form.nameEs || form.nameEn,
        descriptionEn: form.descriptionEn,
        descriptionEs: form.descriptionEs || form.descriptionEn,
        price: parseFloat(form.price),
        categoryId: parseInt(form.categoryId),
        image: form.image || "/images/placeholder.png",
        sizes: sizesArray.length > 0 ? sizesArray : ["One Size"],
      });

      setSuccess(true);
      // Reset form
      setForm({
        nameEn: "",
        nameEs: "",
        descriptionEn: "",
        descriptionEs: "",
        price: "",
        categoryId: "",
        image: "",
        sizes: "XS,S,M,L,XL",
      });
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center animate-fade-in-up">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-navy-800 mb-2">
            Product Listed Successfully!
          </h2>
          <p className="text-navy-400 mb-6">
            Your product is now visible on the catalog.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setSuccess(false);
              }}
              className="btn-gold text-white px-8 py-3 rounded-lg font-semibold text-sm cursor-pointer"
            >
              List Another Product
            </button>
            <button
              onClick={() => navigate("/catalog")}
              className="text-sm text-gold-500 hover:text-gold-600 font-medium cursor-pointer"
            >
              View Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Only render for brand accounts
  if (!user || user.accountType !== "brand") {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 bg-gold-50 rounded-full flex items-center justify-center">
            <Package size={28} className="text-gold-500" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-navy-800 mb-2">
            List a Product
          </h1>
          <p className="text-navy-400">
            Add a new product to the Linces&apos;CKF catalog
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Product Name */}
            <FormField
              label="Product Name (English)"
              name="nameEn"
              value={form.nameEn}
              onChange={handleChange}
              error={errors.nameEn}
              placeholder="e.g. Golden Silk Blouse"
              required
            />
            <FormField
              label="Product Name (Spanish)"
              name="nameEs"
              value={form.nameEs}
              onChange={handleChange}
              placeholder="e.g. Blusa de Seda Dorada (optional)"
            />

            {/* Description */}
            <FormField
              label="Description (English)"
              name="descriptionEn"
              as="textarea"
              value={form.descriptionEn}
              onChange={handleChange}
              error={errors.descriptionEn}
              placeholder="Describe your product..."
              rows={3}
              required
            />
            <FormField
              label="Description (Spanish)"
              name="descriptionEs"
              as="textarea"
              value={form.descriptionEs}
              onChange={handleChange}
              placeholder="Descripción del producto... (optional)"
              rows={3}
            />

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Price ($)"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="149.00"
                required
              />
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-white ${
                    errors.categoryId ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
                )}
              </div>
            </div>

            {/* Image URL */}
            <FormField
              label="Image URL"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="/images/your-product.png or https://..."
            />

            {/* Sizes */}
            <FormField
              label="Available Sizes (comma-separated)"
              name="sizes"
              value={form.sizes}
              onChange={handleChange}
              placeholder="XS, S, M, L, XL"
            />

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Package size={16} />
              {submitting ? "Listing Product..." : "List Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
