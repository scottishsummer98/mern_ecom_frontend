import React, { useEffect } from "react";
import { Formik } from "formik";
import {
  addUserDetails,
  updateUserDetails,
  fetchUserDetails,
} from "../../redux/actionCreators";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../sub/Spinner";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    userDetails: state.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUserDetails: (values) => dispatch(addUserDetails(values)),
    fetchUserDetails: () => dispatch(fetchUserDetails()),
    updateUserDetails: (uid, values) =>
      dispatch(updateUserDetails(uid, values)),
  };
};

const Shipping = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);
  useEffect(() => {
    if (!props.authentication.userInfo) {
      navigate("/");
    }
  }, [props.authentication.userInfo, navigate]);
  let form = null;
  if (props.userDetails.isLoading) {
    form = <Spinner />;
  } else {
    form = (
      <Formik
        key={
          props.userDetails.userDetails
            ? props.userDetails.userDetails._id
            : "add-user-details"
        }
        initialValues={{
          phone: props.userDetails.userDetails
            ? props.userDetails.userDetails.phone
            : "",
          address1: props.userDetails.userDetails
            ? props.userDetails.userDetails.address1
            : "",
          address2: props.userDetails.userDetails
            ? props.userDetails.userDetails.address2
            : "",
          city: props.userDetails.userDetails
            ? props.userDetails.userDetails.city
            : "",
          state: props.userDetails.userDetails
            ? props.userDetails.userDetails.state
            : "",
          postcode: props.userDetails.userDetails
            ? props.userDetails.userDetails.postcode
            : "",
          country: props.userDetails.userDetails
            ? props.userDetails.userDetails.country
            : "",
        }}
        onSubmit={(values, { resetForm }) => {
          if (props.userDetails.userDetails) {
            props.updateUserDetails(props.userDetails.userDetails._id, values);
          } else {
            props.addUserDetails(values);
          }
          navigate("/checkout");
          resetForm();
        }}
        validate={(values) => {
          const errors = {};

          if (!values.phone) {
            errors.phone = "Required!";
          } else if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(values.phone)) {
            errors.phone = "Invalid phone number!";
          }
          if (!values.address1) {
            errors.address1 = "Required!";
          } else if (values.address1.length < 5) {
            errors.address1 = "Address is too short!";
          } else if (values.address1.length > 255) {
            errors.address1 = "Address is too long!";
          }
          if (!values.address2) {
            errors.address2 = "Required!";
          } else if (values.address2.length < 5) {
            errors.address2 = "Address is too short!";
          } else if (values.address2.length > 255) {
            errors.address2 = "Address is too long!";
          }
          if (!values.city) {
            errors.city = "Required!";
          } else if (values.city.length < 5) {
            errors.city = "City name is too short!";
          } else if (values.city.length > 255) {
            errors.city = "City name is too long!";
          }
          if (!values.state) {
            errors.state = "Required!";
          } else if (values.state.length < 5) {
            errors.state = "State name is too short!";
          } else if (values.state.length > 255) {
            errors.state = "State name is too long!";
          }
          if (!values.postcode) {
            errors.postcode = "Required!";
          } else if (values.postcode.length > 4 || values.postcode.length < 4) {
            errors.postcode = "Invalid Postcode!";
          }
          if (!values.country) {
            errors.country = "Required!";
          } else if (values.country.length < 5) {
            errors.country = "Country name is too short!";
          } else if (values.country.length > 255) {
            errors.country = "Country name is too long!";
          }
          return errors;
        }}
      >
        {({ values, handleChange, handleSubmit, errors }) => (
          <div>
            <h4>Shipping Details</h4>
            <form onSubmit={handleSubmit} className="shipping_container_form">
              <div className="row">
                <div className="col-lg-2 col-md-4 col-sm-2">
                  <label>Phone number</label>
                  <input
                    name="phone"
                    placeholder="Enter phone number"
                    className="form-control"
                    value={values.phone}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.phone}</span>
                </div>
                <div className="col-lg-5 col-md-4 col-sm-5">
                  <label>Address Line 1</label>
                  <input
                    name="address1"
                    placeholder="Enter Address"
                    className="form-control"
                    value={values.address1}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.address1}</span>
                </div>
                <div className="col-lg-5 col-md-4 col-sm-5">
                  <label>Address Line 2</label>
                  <input
                    name="address2"
                    placeholder="Enter Address"
                    className="form-control"
                    value={values.address2}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.address2}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-3">
                  <label>City</label>
                  <input
                    name="city"
                    placeholder="Enter city"
                    className="form-control"
                    value={values.city}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.city}</span>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-3">
                  <label>State</label>
                  <input
                    name="state"
                    placeholder="Enter state"
                    className="form-control"
                    value={values.state}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.state}</span>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-3">
                  <label>Postcode</label>
                  <input
                    name="postcode"
                    placeholder="Enter Postcode"
                    className="form-control"
                    value={values.postcode}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.postcode}</span>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-3">
                  <label>Country</label>
                  <input
                    name="country"
                    placeholder="Enter country"
                    className="form-control"
                    value={values.country}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.country}</span>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="btn btn-success "
                  style={{ float: "right" }}
                >
                  Save & Checkout
                </button>
                <button
                  className="btn btn-warning"
                  style={{ float: "right", marginRight: "1rem" }}
                  onClick={() => navigate("/cart")}
                >
                  Go Back
                </button>
              </div>
            </form>
          </div>
        )}
      </Formik>
    );
  }
  return <div className="shipping_container">{form}</div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Shipping);
