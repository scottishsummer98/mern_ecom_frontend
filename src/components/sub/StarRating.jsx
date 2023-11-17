import React from "react";

const StarRating = ({ rating }) => {
  const starArray = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starArray.push(
        <i key={i} className="fa fa-star" style={{ marginRight: "7px" }}></i>
      );
    } else {
      starArray.push(
        <i key={i} className="fa fa-star-o" style={{ marginRight: "7px" }}></i>
      );
    }
  }

  return (
    <div className="star-rating" style={{ color: "gold" }}>
      {starArray}
    </div>
  );
};

export default StarRating;
