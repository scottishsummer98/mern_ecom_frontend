import React from "react";

const OrderDropdown = (props) => {
  const handleChange = (e) => {
    props.handleOrderFilter(e.target.value);
  };
  return (
    <div>
      <select
        name="order"
        className="form-input"
        style={{ width: "100%" }}
        onChange={handleChange}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default OrderDropdown;
