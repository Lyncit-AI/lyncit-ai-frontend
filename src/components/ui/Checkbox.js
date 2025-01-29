const Checkbox = ({ id, checked, onChange }) => (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4"
    />
  );

  export default Checkbox;