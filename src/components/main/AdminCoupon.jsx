import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import {
  addCoupon,
  updateCoupon,
  deleteCoupon,
  fetchCoupons,
} from "../../redux/actionCreators";
import Spinner from "../sub/Spinner";
import { connect } from "react-redux";
import { FiTrash, FiEdit } from "react-icons/fi";
import dateFormat from "dateformat";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    coupons: state.coupons,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCoupon: (values) => dispatch(addCoupon(values)),
    updateCoupon: (cid, values) => dispatch(updateCoupon(cid, values)),
    deleteCoupon: (cid) => dispatch(deleteCoupon(cid)),
    fetchCoupons: () => dispatch(fetchCoupons()),
  };
};

const AdminCoupon = (props) => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);
  useEffect(() => {
    if (!props.authentication.userInfo) {
      navigate("/");
    } else if (props.authentication.userInfo.role !== "admin") {
      navigate("/");
    }
  }, [props.authentication.userInfo, navigate]);

  const handleEditCoupon = (coupon) => {
    setSelectedCoupon(coupon);
  };
  if (!props.authentication.userInfo) {
    return null;
  }
  let sl = 1;
  let couponList = null;
  {
    props.coupons.isLoading
      ? (couponList = <Spinner />)
      : (couponList =
          props.coupons.coupons.length > 0 ? (
            props.coupons.coupons.map((coupon) => {
              return (
                <tr key={coupon._id}>
                  <td>{sl++}</td>
                  <td>{coupon.code}</td>
                  <td>{coupon.amount}</td>
                  <td>{coupon.limit}</td>
                  <td>
                    {dateFormat(coupon.expirationDate, "dd/mm/yyyy, h:MM TT")}
                  </td>
                  <td>
                    <button
                      className="btn btn-dark"
                      onClick={() => handleEditCoupon(coupon)}
                    >
                      <FiEdit />
                    </button>
                    &nbsp;
                    <button
                      className="btn btn-dark"
                      onClick={() => props.deleteCoupon(coupon._id)}
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6}>No available coupons!</td>
            </tr>
          ));
  }
  return (
    <div className="admin_category_container">
      <div className="admin_category_sub_container1">
        <h4>{selectedCoupon ? "Edit Coupon" : "Add New Coupon"}</h4>
        <Formik
          key={selectedCoupon ? selectedCoupon._id : "add-coupon"}
          initialValues={{
            code: selectedCoupon ? selectedCoupon.code : "",
            amount: selectedCoupon ? selectedCoupon.amount : 0,
            limit: selectedCoupon ? selectedCoupon.limit : 0,
            expirationDate: selectedCoupon
              ? dateFormat(selectedCoupon.expirationDate, "yyyy-mm-dd")
              : "",
          }}
          onSubmit={(values, { resetForm }) => {
            if (selectedCoupon) {
              props.updateCoupon(selectedCoupon._id, values);
              setSelectedCoupon(null);
            } else {
              props.addCoupon({ values });
            }
            resetForm();
          }}
          validate={(values) => {
            const errors = {};

            if (!values.code) {
              errors.code = "Required!";
            } else if (!/^[A-Z0-9]+$/.test(values.code)) {
              errors.code =
                "Code must contain only capital letters and numbers!";
            }
            if (!values.amount) {
              errors.amount = "Required!";
            } else if (values.amount < 0) {
              errors.amount = "Amount cannot be negative!";
            }
            if (!values.limit) {
              errors.limit = "Required!";
            } else if (values.limit < 0) {
              errors.limit = "Limit cannot be negative!";
            }
            if (!values.expirationDate) {
              errors.expirationDate = "Required!";
            }
            return errors;
          }}
        >
          {({ values, handleChange, handleSubmit, errors }) => (
            <div>
              <form
                onSubmit={handleSubmit}
                style={{
                  marginTop: "5px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  textAlign: "left",
                }}
              >
                <div>
                  <label>Coupon Code</label>
                  <input
                    name="code"
                    placeholder="Enter code"
                    className="form-control"
                    value={values.code}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.code}</span>
                </div>
                <div>
                  <label>Coupon Amount</label>
                  <input
                    type="number"
                    min={0}
                    name="amount"
                    placeholder="Enter amount"
                    className="form-control"
                    value={values.amount}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.amount}</span>
                </div>
                <div>
                  <label>Coupon Limit</label>
                  <input
                    type="limit"
                    min={0}
                    name="limit"
                    placeholder="Enter limit"
                    className="form-control"
                    value={values.limit}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.limit}</span>
                </div>
                <div>
                  <label>Coupon Expiration Date</label>
                  <input
                    type="date"
                    name="expirationDate"
                    placeholder="Enter Expiration Date"
                    className="form-control"
                    value={values.expirationDate}
                    onChange={handleChange}
                  />
                  <span className="validation_error">
                    {errors.expirationDate}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <button type="submit" className="btn btn-dark">
                    {selectedCoupon ? "Update" : "Add"}
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={() => navigate("/dashboard")}
                  >
                    Go Back
                  </button>
                </div>
              </form>
            </div>
          )}
        </Formik>
      </div>
      <div className="admin_category_sub_container2">
        <h4>Coupon List</h4>
        <div className="table-responsive">
          <table className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>Sl</th>
                <th>Code</th>
                <th>Amount</th>
                <th>Limit</th>
                <th>Expire Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{couponList}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminCoupon);
