const Button = ({ children, className, ...props }) => (
    <button className={`px-4 py-3 rounded-[8px] ${className}`} {...props}>
      {children}
    </button>
  );
  
  export default Button;