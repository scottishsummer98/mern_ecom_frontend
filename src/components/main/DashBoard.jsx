import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrder } from "../../redux/actionCreators";
import { NavLink } from "react-router-dom";
import Spinner from "../sub/Spinner";
import { connect, useDispatch } from "react-redux";
import dateFormat from "dateformat";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    order: state.order,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOrder: () => dispatch(fetchOrder()),
  };
};

const DashBoard = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    if (!props.authentication.userInfo) {
      navigate("/");
    }
  }, [props.authentication.userInfo, navigate]);

  useEffect(() => {
    dispatch(fetchOrder());
  }, [dispatch]);
  if (!props.authentication.userInfo) {
    return null;
  }
  let purchaseHistory = null;
  {
    props.order.isLoading
      ? (purchaseHistory = <Spinner />)
      : (purchaseHistory =
          props.order.order.length > 0 ? (
            props.order.order.map((order) => {
              return (
                <tr onClick={() => setSelectedOrder(order)}>
                  <td>{order.transaction_id}</td>
                  <td>{dateFormat(order.createdAt, "dd/mm/yyyy, h:MM TT")}</td>
                  <td>{order.sslStatus}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3}>No available purchase history!</td>
            </tr>
          ));
  }
  let subTotal = 0;
  return (
    <div className="dashboard_container">
      {props.authentication.userInfo.role === "admin" ? (
        <div className="dashboard_sub_container1">
          <h4>Admin Options</h4>
          <div className="dashboard_admin_options_container_buttons">
            <NavLink className="btn btn-secondary" to="/admin/coupon">
              Create Coupon
            </NavLink>
            <NavLink className="btn btn-secondary" to="/admin/category">
              Create Category
            </NavLink>
            <NavLink className="btn btn-secondary" to="/admin/product">
              Create Product
            </NavLink>
          </div>
          &nbsp;
          <h4>Purchase History</h4>
          <div className="table-responsive">
            <table className="table table-dark table-bordered">
              <thead>
                <tr>
                  <th>Transaction Id</th>
                  <th>Ordered At</th>
                  <th>SSL Order Validity</th>
                </tr>
              </thead>
              <tbody>{purchaseHistory}</tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="dashboard_sub_container1">
          <table className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>Transaction Id</th>
                <th>Ordered At</th>
                <th>SSL Order Validity</th>
              </tr>
            </thead>
            <tbody>{purchaseHistory}</tbody>
          </table>
        </div>
      )}

      <div className="dashboard_sub_container2">
        <h4>
          {" "}
          {props.authentication.userInfo.role === "admin"
            ? "Admin Details"
            : "User Details"}
        </h4>
        <div className="dashboard_admin_details_container_card">
          <h5>Name: {props.authentication.userInfo.name}</h5>
          <h5>Email: {props.authentication.userInfo.email}</h5>
          <h5>Role: {props.authentication.userInfo.role}</h5>
        </div>
        {selectedOrder ? (
          <>
            &nbsp;
            <h4>Purchase Details</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-dark">
                <thead>
                  <tr>
                    <th>Trancation Id</th>
                    <td>{selectedOrder.transaction_id}</td>
                    <th>Ordered At</th>
                    <td>
                      {dateFormat(
                        selectedOrder.createdAt,
                        "dd/mm/yyyy, h:MM TT"
                      )}
                    </td>
                    <th>SSL Order Validity</th>
                    <td>{selectedOrder.sslStatus}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="text-center" colSpan={6}>
                      Ordered Items
                    </th>
                  </tr>
                  {selectedOrder.cartItems.map((item) => {
                    const itemTotal = item.count * item.price;
                    subTotal += itemTotal;
                    return (
                      <tr>
                        <td colSpan={3}>{item.product.name}</td>
                        <td style={{ textAlign: "center" }}>
                          {item.price} X {item.count}
                        </td>
                        <td colSpan={2} style={{ textAlign: "right" }}>
                          {item.price * item.count} Tk.
                        </td>
                      </tr>
                    );
                  })}
                  {selectedOrder.coupon_applied === "Y" ? (
                    <>
                      <tr>
                        <th className="text-center" colSpan={4}>
                          Total
                        </th>
                        <td
                          colSpan={2}
                          style={{
                            textAlign: "right",
                            textDecoration: "line-through",
                            textDecorationColor: "red",
                            textDecorationThickness: "2px",
                          }}
                        >
                          {subTotal} Tk.
                        </td>
                      </tr>
                      <tr>
                        <th className="text-center" colSpan={4}>
                          {selectedOrder.coupon.code}
                        </th>
                        <td colSpan={2} style={{ textAlign: "right" }}>
                          {selectedOrder.coupon.amount} Tk.
                        </td>
                      </tr>
                      <tr>
                        <th className="text-center" colSpan={4}>
                          Subtotal
                        </th>
                        <td colSpan={2} style={{ textAlign: "right" }}>
                          {subTotal - selectedOrder.coupon.amount} Tk.
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <th className="text-center" colSpan={4}>
                        Subtotal
                      </th>
                      <td colSpan={2} style={{ textAlign: "right" }}>
                        {subTotal} Tk.
                      </td>
                    </tr>
                  )}

                  <tr>
                    <th className="text-center" colSpan={6}>
                      Delivered To
                    </th>
                  </tr>
                  <tr>
                    <td rowSpan={2} colSpan={3}>
                      <b>Address: </b>
                      {selectedOrder.address.address1},{" "}
                      {selectedOrder.address.address2}
                    </td>
                    <td>
                      <b>City: </b>
                      {selectedOrder.address.city} <br />
                      <b>State: </b>
                      {selectedOrder.address.state}
                    </td>
                    <td>
                      <b>Postcode: </b>
                      {selectedOrder.address.postcode} <br />
                      <b>Country: </b>
                      {selectedOrder.address.country}
                    </td>
                    <td>
                      <b>Phone Number: </b>
                      {selectedOrder.address.phone}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
