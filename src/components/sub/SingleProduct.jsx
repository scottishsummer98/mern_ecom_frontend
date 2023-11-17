import React from "react";
import { API } from "../../utils/config";
import { useNavigate } from "react-router-dom";
import { addCart, deleteCart } from "../../redux/actionCreators";
import { connect } from "react-redux";
import StarRating from "./StarRating";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    cart: state.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCart: (pid, price, uid) => dispatch(addCart(pid, price, uid)),
    deleteCart: (cid) => dispatch(deleteCart(cid)),
  };
};

const SingleProduct = (props) => {
  const navigate = useNavigate();
  const isProductInCart = props.cart.cart.some(
    (item) => item.product._id === props.product._id
  );
  const handleRemoveFromCart = () => {
    if (isProductInCart) {
      const cartItem = props.cart.cart.find(
        (item) => item.product._id === props.product._id
      );
      props.deleteCart(cartItem._id);
    }
  };
  return (
    <div className="single_product_container" key={props.product._id}>
      <img
        src={API + "/product/photo/" + props.product._id}
        alt={props.product.name}
        className="single_product_image"
      />
      <div className="single_product_details">
        <div className="single_product_name_price_container">
          <h3 className="single_product_name_price">{props.product.name}</h3>
          <h3 className="single_product_name_price">
            {props.product.price} Tk
          </h3>
        </div>
        <h4>
          <StarRating rating={props.product.avg_rating} />
        </h4>
        <div className="single_product_name_quantity_sold_container">
          <p
            className={`single_product_quantity_sold ${
              props.product.quantity > 0 ? "green" : "red"
            }`}
          >
            {props.product.quantity > 0
              ? `In Stock: ${props.product.quantity}`
              : "Out of Stock"}
          </p>
          <p className="single_product_quantity_sold yellow">
            Sold: {props.product.sold}
          </p>
        </div>
      </div>
      <div className="single_product_buttons">
        <button
          className="btn btn-warning"
          onClick={() => {
            navigate(`/product/${props.product._id}`);
          }}
        >
          View Product
        </button>
        {props.authentication.userInfo ? (
          isProductInCart ? (
            <button className="btn btn-danger" onClick={handleRemoveFromCart}>
              Remove from Cart
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => {
                props.addCart(
                  props.product._id,
                  props.product.price,
                  props.authentication.userInfo._id
                );
              }}
            >
              Add To Cart
            </button>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);
