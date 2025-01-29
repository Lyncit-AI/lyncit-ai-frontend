import QMarkIcon from "../../assets/icons/QMarkIcon"

const Input = ({ type, placeholder, value, onChange, className = "" }) => (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border rounded-[8px] px-3 py-2 w-full ${className}`}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#637083] focus:outline-none">
        <QMarkIcon/>
      </div>
    </div>
  );

  export default Input;