import React from "react";

const Searchbar = ({ onSearchChange }) => {
  const handleInputChange = (e) => {
    const newSearchKey = e.target.value;
    onSearchChange(newSearchKey);
  };

  return (
    <div>
      <input
        type="text"
        className="form-control"
        placeholder="Search Product"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default Searchbar;
