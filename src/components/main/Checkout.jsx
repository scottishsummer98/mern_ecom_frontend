import React, { useEffect } from "react";
import {
  fetchCart,
  fetchUserDetails,
  initPayment,
} from "../../redux/actionCreators";
import { API } from "../../utils/config";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../sub/Spinner";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    cart: state.cart,
    coupons: state.coupons,
    userDetails: state.userDetails,
    payment: state.payment,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
    fetchUserDetails: () => dispatch(fetchUserDetails()),
    initPayment: (cc) => dispatch(initPayment(cc)),
  };
};

const Checkout = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchUserDetails());
  }, [dispatch]);
  useEffect(() => {
    if (!props.authentication.userInfo) {
      navigate("/");
    }
  }, [props.authentication.userInfo, navigate]);

  if (!props.authentication.userInfo) {
    return null;
  }
  let sl = 1;
  let cartList = null;
  let subTotal = 0;
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
                  className="checkout_container_order_container_image"
                  src={API + "/product/photo/" + cartItem.product._id}
                  alt="ProductImage"
                />
              </td>
              <td>
                {cartItem.product.name} <br />
                {cartItem.price} X {cartItem.count}
              </td>
              <td style={{ textAlign: "right" }}>
                {cartItem.count * cartItem.price} Tk
              </td>
            </tr>
          </>
        );
      }))
    : (cartList = (
        <>
          <tr>
            <td colSpan={4}>Shopping cart is empty!</td>
          </tr>
        </>
      ));
  let checkoutDetails = null;
  {
    props.userDetails.isLoading
      ? (checkoutDetails = <Spinner />)
      : (checkoutDetails = (
          <>
            <div className="card text-white bg-secondary">
              <h5 className="card-header">Shipping Details</h5>
              <table className="table table-dark">
                <tbody style={{ textAlign: "left" }}>
                  <tr>
                    <th style={{ width: "40%" }}>Name</th>
                    <td>{props.authentication.userInfo.name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{props.authentication.userInfo.email}</td>
                  </tr>
                  <tr>
                    <th>Phone Number</th>
                    <td>{props.userDetails.userDetails.phone}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>
                      {props.userDetails.userDetails.address1},{" "}
                      {props.userDetails.userDetails.address2}
                    </td>
                  </tr>
                  <tr>
                    <th>City</th>
                    <td>{props.userDetails.userDetails.city}</td>
                  </tr>
                  <tr>
                    <th>State</th>
                    <td>{props.userDetails.userDetails.state}</td>
                  </tr>
                  <tr>
                    <th>Post Code</th>
                    <td>{props.userDetails.userDetails.postcode}</td>
                  </tr>
                  <tr>
                    <th>Country</th>
                    <td>{props.userDetails.userDetails.country}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="card text-white bg-secondary">
                <h5 className="card-header">Order Details</h5>

                <table className="table table-dark">
                  <tbody>{cartList}</tbody>
                  <tfoot>
                    {props.coupons.coupons.data ? (
                      <>
                        <tr>
                          <th colSpan={3}>Total</th>
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
                        </tr>
                        <tr>
                          <th colSpan={3}>
                            PROMO {props.coupons.coupons.data.code}
                          </th>
                          <th style={{ textAlign: "right" }}>
                            {props.coupons.coupons.data.amount} Tk
                          </th>
                        </tr>
                        <tr>
                          <th colSpan={3}>Sub Total</th>
                          <th style={{ textAlign: "right" }}>
                            {subTotal - props.coupons.coupons.data.amount} Tk
                          </th>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <th colSpan={3}>Sub Total</th>
                        <th style={{ textAlign: "right" }}>{subTotal} Tk</th>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
              <div>
                <br />

                <button
                  style={{ float: "right" }}
                  className="btn btn-success"
                  onClick={async () => {
                    try {
                      let gatewayPageURL = "";
                      if (props.coupons.coupons.data) {
                        gatewayPageURL = await props.initPayment(
                          props.coupons.coupons.data.code
                        );
                      } else {
                        gatewayPageURL = await props.initPayment("blank");
                      }

                      window.location = gatewayPageURL;
                    } catch (error) {
                      console.error("Error:", error);
                    }
                  }}
                >
                  Make Payment
                </button>
                <button
                  className="btn btn-warning"
                  style={{ float: "right", marginRight: "1rem" }}
                  onClick={() => navigate("/shipping")}
                >
                  Go Back
                </button>
              </div>
            </div>
          </>
        ));
  }
  return <div className="checkout_container">{checkoutDetails}</div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
