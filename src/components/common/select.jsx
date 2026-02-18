import React from "react";

const Select = ({ name, label, options, error, ...rest }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        {...rest}
        className={"form-control " + (error ? "is-invalid" : "is-valid")}
      >
        <option value="">Please Select</option>
        {options.map((option, i) => {
          return(<option key={i} value={option._id}>
                   {option.name}
                </option>)
        })}
      </select>
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default Select;
// {options.map(option => (
//   <option key={option._id} value={option._id}>
//     {option.name}
//   </option>
// ))}