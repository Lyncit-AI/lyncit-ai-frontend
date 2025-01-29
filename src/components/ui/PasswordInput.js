import { useState } from "react";
import EyeOpen from "../../assets/icons/eyeopen";
import EyeClose from "../../assets/icons/eyeclose";

const PasswordInput = ({ value, onChange, placeholder, className = "" }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={`border rounded-[8px] px-3 py-2 w-full ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOpen /> : <EyeClose />}
      </button>
    </div>
  );
};

export default PasswordInput;
