import React, { useState } from "react";

const Checkbox = (props) => {
  const [checked, setChecked] = useState([]);
  const checkedIds = [...checked];
  const handleToggle = (id) => () => {
    const foundId = checked.indexOf(id);
    if (foundId === -1) {
      checkedIds.push(id);
    } else {
      checkedIds.splice(foundId, 1);
    }
    setChecked(checkedIds);
    props.handleFilters(checkedIds);
  };
  return props.options.map((option) => (
    <li className="list-unstyled" key={option._id}>
      <input
        type="checkbox"
        onChange={handleToggle(option._id)}
        value={checked.indexOf(option._id === -1)}
      />
      <label style={{ padding: "0 1rem" }}>{option.name}</label>
    </li>
  ));
};

export default Checkbox;
