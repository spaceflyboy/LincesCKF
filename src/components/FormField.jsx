import PropTypes from "prop-types";
export default function FormField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  as = "input",
  placeholder = "",
  rows = 4,
  children,
  required = false,
}) {
  const fieldClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent";

  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-1">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      {as === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={`${fieldClass} resize-none`}
        />
      ) : as === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${fieldClass} bg-white`}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={fieldClass}
        />
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  as: PropTypes.oneOf(["input", "textarea", "select"]),
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  children: PropTypes.node,
  required: PropTypes.bool,
};
