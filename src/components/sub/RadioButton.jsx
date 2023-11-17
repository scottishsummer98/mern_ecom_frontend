import React from "react";

const RadioButton = (props) => {
  const handleChange = (e) => {
    props.handleFilters(e.target.value);
  };
  return props.options.map((option) => (
    <li className="list-unstyled" key={option._id}>
      <input
        type="radio"
        name={props.name}
        value={option._id}
        onChange={handleChange}
      />
      <label style={{ padding: "0 1rem" }}>{option.name}</label>
    </li>
  ));
};

export default RadioButton;
