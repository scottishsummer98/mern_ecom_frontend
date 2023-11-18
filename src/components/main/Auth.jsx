import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { auth, authGoogle } from "../../redux/actionCreators";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../sub/Spinner";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    auth: (user) => dispatch(auth(user)),
    authGoogle: () => dispatch(authGoogle()),
  };
};

function Auth(props) {
  const [mode, setMode] = useState("Login");
  const navigate = useNavigate();
  useEffect(() => {
    if (props.authentication.userInfo) {
      navigate("/");
    }
  }, [props.authentication.userInfo, navigate]);
  const switchModeHandler = () => {
    if (mode === "Register") {
      setMode("Login");
    } else {
      setMode("Register");
    }
  };
  let form = null;
  if (props.authentication.authLoading) {
    form = <Spinner />;
  } else {
    form = (
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        onSubmit={(values, { resetForm }) => {
          props.auth({ mode, values });
          resetForm();
        }}
        validate={(values) => {
          const errors = {};
          if (mode === "Register") {
            if (!values.name) {
              errors.name = "Required!";
            }
          }

          if (!values.email) {
            errors.email = "Required!";
          } else if (
            !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
              values.email
            )
          ) {
            errors.email = "Invalid email address!";
          }

          if (!values.password) {
            errors.password = "Required!";
          } else if (values.password.length < 4) {
            errors.password = "Must be atleast 4 characters!";
          }
          return errors;
        }}
      >
        {({ values, handleChange, handleSubmit, errors }) => (
          <div>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".5rem",
              }}
            >
              {mode === "Register" ? (
                <div>
                  <label>Name</label>
                  <input
                    name="name"
                    placeholder="Enter your name"
                    className="form-control"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.name}</span>
                </div>
              ) : null}
              <label>Email</label>
              <input
                name="email"
                placeholder="Enter your email"
                className="form-control"
                value={values.email}
                onChange={handleChange}
              />
              <span className="validation_error">{errors.email}</span>
              <label>Password</label>
              <input
                name="password"
                placeholder="Password"
                className="form-control"
                value={values.password}
                onChange={handleChange}
              />
              <span className="validation_error">{errors.password}</span>
              <button type="submit" className="btn btn-dark">
                {mode}
              </button>
            </form>
            <button
              className="btn btn-dark"
              style={{
                width: "100%",
                marginTop: ".5rem",
              }}
              onClick={switchModeHandler}
            >
              {mode === "Register"
                ? "Already Registered?"
                : "Not Registered Yet?"}
            </button>
          </div>
        )}
      </Formik>
    );
  }
  return (
    <div className="form_container">
      {form}
      <hr />
      <div>
        <button
          className="btn btn-dark"
          style={{
            width: "100%",
            marginTop: ".5rem",
          }}
        >
          Or {mode} using
        </button>
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <button
            className="btn btn-dark"
            style={{
              width: "50%",
              marginTop: ".5rem",
            }}
            onClick={props.authGoogle}
          >
            <span className="fa fa-google"></span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Google
          </button>
          <button
            className="btn btn-dark"
            style={{
              width: "50%",
              marginTop: ".5rem",
            }}
          >
            <span className="fa fa-facebook"></span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
