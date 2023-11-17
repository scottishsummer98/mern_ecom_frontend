import React, { useEffect } from "react";
import Header from "./Header";
import Home from "./Home";
import Auth from "../main/Auth";
import Cart from "./Cart";
import Footer from "./Footer";
import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";
import { authCheck } from "../../redux/actionCreators";
import DashBoard from "./DashBoard";
import AdminCategory from "./AdminCategory";
import AdminProduct from "./AdminProduct";
import SingleProductDetails from "../sub/SingleProductDetails";
import Shipping from "./Shipping";
import Checkout from "./Checkout";
import AdminCoupon from "./AdminCoupon";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    authCheck: () => dispatch(authCheck()),
  };
};

const Root = (props) => {
  const { authCheck } = props;

  useEffect(() => {
    authCheck();
  }, [authCheck]);
  return (
    <div>
      <Header />
      <div className="route_container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/dashboard" element={<DashBoard />}></Route>
          <Route path="/admin/category" element={<AdminCategory />}></Route>
          <Route path="/admin/product" element={<AdminProduct />}></Route>
          <Route path="/admin/coupon" element={<AdminCoupon />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/product/:id" element={<SingleProductDetails />}></Route>
          <Route path="/shipping" element={<Shipping />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/auth" element={<Auth />}></Route>
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
