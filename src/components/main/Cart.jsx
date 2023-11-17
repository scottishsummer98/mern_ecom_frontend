import React, { useEffect, useState } from "react";
import {
  checkCoupon,
  clearCoupon,
  fetchCart,
  deleteCart,
  updateCart,
} from "../../redux/actionCreators";
import Spinner from "../sub/Spinner";
import { connect, useDispatch } from "react-redux";
import { API } from "../../utils/config";
import { FiTrash, FiPlus, FiMinus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    cart: state.cart,
    coupons: state.coupons,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkCoupon: (code) => dispatch(checkCoupon(code)),
    clearCoupon: () => dispatch(clearCoupon()),
    fetchCart: () => dispatch(fetchCart()),
    deleteCart: (cid) => dispatch(deleteCart(cid)),
    updateCart: (cid, count) => dispatch(updateCart(cid, count)),
  };
};

const Cart = (props) => {
  const [couponForm, setCouponForm] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.authentication.userInfo) {
      navigate("/");
    }
  }, [props.authentication.userInfo, navigate]);
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  const handleCouponApply = () => {
    props.checkCoupon(couponCode);
    setCouponForm(false);
  };
  const increaseCartItem = (cid, count) => () => {
    if (count < 5) {
      props.updateCart(cid, count + 1);
    }
  };
  const decreaseCartItem = (cid, count) => () => {
    if (count > 1) {
      props.updateCart(cid, count - 1);
    }
  };
  let sl = 1;
  let cartList = null;
  let subTotal = 0;
  if (props.cart.isLoading) {
    return <Spinner />;
  } else {
    props.cart.cart.length > 0
      ? (cartList = props.cart.cart.map((cartItem) => {
          const itemTotal = cartItem.count * cartItem.price;
          subTotal += itemTotal;
          return (
            <>
              <tr key={cartItem._id}>
                <td>{sl++}</td>
                <td>
                  <img
                    style={{ width: "5rem", height: "5rem" }}
                    src={API + "/product/photo/" + cartItem.product._id}
                    alt="ProductImage"
                  />
                </td>
                <td>{cartItem.product.name}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={decreaseCartItem(cartItem._id, cartItem.count)}
                  >
                    <FiMinus />
                  </button>
                  &nbsp;&nbsp;&nbsp;
                  {cartItem.count}
                  &nbsp;&nbsp;&nbsp;
                  <button
                    className="btn btn-success"
                    onClick={increaseCartItem(cartItem._id, cartItem.count)}
                  >
                    <FiPlus />
                  </button>
                </td>
                <td style={{ textAlign: "right" }}>
                  {cartItem.count * cartItem.price} Tk
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => props.deleteCart(cartItem._id)}
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            </>
          );
        }))
      : (cartList = (
          <>
            <tr>
              <td colSpan={6}>Shopping cart is empty!</td>
            </tr>
          </>
        ));
  }

  return (
    <div className="cart_container">
      <h4>My Shopping Cart</h4>
      <div className="table-responsive">
        <table className="table table-dark">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Image</th>
              <th>Name</th>
              <th>Quantity</th>
              <th style={{ textAlign: "right" }}>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{cartList}</tbody>
          <tfoot>
            {props.coupons.coupons.data ? (
              <>
                <tr>
                  <th colSpan={4}>Total</th>
                  <th
                    style={{
                      textAlign: "right",
                      textDecoration: "line-through",
                      textDecorationColor: "red",
                      textDecorationThickness: "2px",
                    }}
                  >
                    {subTotal} Tk
                  </th>
                  <th></th>
                </tr>
                <tr>
                  <th colSpan={4}>PROMO {props.coupons.coupons.data?.code}</th>
                  <th style={{ textAlign: "right" }}>
                    {props.coupons.coupons.data?.amount} Tk
                  </th>
                  <th>
                    <button
                      className="btn btn-danger"
                      onClick={() => props.clearCoupon()}
                    >
                      <FiTrash />
                    </button>
                  </th>
                </tr>
                <tr>
                  <th colSpan={4}>Sub Total</th>
                  <th style={{ textAlign: "right" }}>
                    {subTotal - (props.coupons.coupons.data?.amount || 0)} Tk
                  </th>
                  <th></th>
                </tr>
              </>
            ) : (
              <tr>
                <th colSpan={4}>Sub Total</th>
                <th style={{ textAlign: "right" }}>{subTotal} Tk</th>
                <th></th>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
      {couponForm ? (
        <div className="coupon_container">
          <div className="coupon_container_input">
            <label name="coupon">Coupon Code</label>
            <input
              className="form-input"
              type="text"
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>
          <div className="coupon_container_buttons">
            <button className="btn btn-success" onClick={handleCouponApply}>
              Apply
            </button>
            <button
              className="btn btn-danger"
              onClick={() => setCouponForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      <div className="cart_buttons_container">
        <button className="btn btn-warning" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
        <button className="btn btn-success" onClick={() => setCouponForm(true)}>
          Have a coupon?
        </button>
        {subTotal > 0 ? (
          <button
            className="btn btn-success"
            onClick={() => navigate("/shipping")}
          >
            Proceed To Checkout
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
