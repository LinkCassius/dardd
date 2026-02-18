import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <React.Fragment>
      <input
        {...rest}
        id={name}
        name={name}
        placeholder={label}
        className={"form-control " + (error ? "is-invalid" : "is-valid")}
        autoComplete={name}
      />
      {error && <div className="text-danger">{error}</div>}
    </React.Fragment>
  );
};

export default Input;
