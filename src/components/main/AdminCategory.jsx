import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import {
  addCategory,
  fetchCategories,
  updateCategory,
  deleteCategory,
} from "../../redux/actionCreators";
import Spinner from "../sub/Spinner";
import { connect } from "react-redux";
import { FiTrash, FiEdit } from "react-icons/fi";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    categories: state.categories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCategory: (values) => dispatch(addCategory(values)),
    fetchCategories: () => dispatch(fetchCategories()),
    updateCategory: (cid, name) => dispatch(updateCategory(cid, name)),
    deleteCategory: (cid) => dispatch(deleteCategory(cid)),
  };
};

const AdminCategory = (props) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  useEffect(() => {
    if (!props.authentication.userInfo) {
      navigate("/");
    } else if (props.authentication.userInfo.role !== "admin") {
      navigate("/");
    }
  }, [props.authentication.userInfo, navigate]);

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
  };
  if (!props.authentication.userInfo) {
    return null;
  }
  let sl = 1;
  let categoryList = null;
  if (props.categories.isLoading) {
    categoryList = <Spinner />;
  } else {
    categoryList = props.categories.categories.map((category) => {
      return (
        <tr key={category._id}>
          <td>{sl++}</td>
          <td>{category.name}</td>
          <td>
            <button
              className="btn btn-dark"
              onClick={() => handleEditCategory(category)}
            >
              <FiEdit />
            </button>
            &nbsp;
            <button
              className="btn btn-dark"
              onClick={() => props.deleteCategory(category._id)}
            >
              <FiTrash />
            </button>
          </td>
        </tr>
      );
    });
  }
  return (
    <div className="admin_category_container">
      <div className="admin_category_sub_container1">
        <h4>{selectedCategory ? "Edit Category" : "Add New Category"}</h4>
        <Formik
          key={selectedCategory ? selectedCategory._id : "add-category"}
          initialValues={{
            name: selectedCategory ? selectedCategory.name : "",
          }}
          onSubmit={(values, { resetForm }) => {
            if (selectedCategory) {
              props.updateCategory(selectedCategory._id, values.name);
              setSelectedCategory(null);
            } else {
              props.addCategory({ values });
            }
            resetForm();
          }}
          validate={(values) => {
            const errors = {};

            if (!values.name) {
              errors.name = "Required!";
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
                  <label>Category Name</label>
                  <input
                    name="name"
                    placeholder="Enter name"
                    className="form-control"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.name}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <button type="submit" className="btn btn-dark">
                    {selectedCategory ? "Update" : "Add"}
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
        <h4>Category List</h4>
        <div className="table-responsive">
          <table className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>Sl</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{categoryList}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminCategory);
