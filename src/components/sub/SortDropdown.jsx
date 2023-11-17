import React from "react";

const SortDropdown = (props) => {
  const handleChange = (e) => {
    props.handleSortFilter(e.target.value);
  };
  return (
    <div>
      <select
        name="sort"
        className="form-input"
        onChange={handleChange}
        style={{ width: "100%" }}
      >
        <option value="price">Price</option>
        <option value="sold">Sold</option>
        <option value="avg_rating">Review</option>
      </select>
    </div>
  );
};

export default SortDropdown;
