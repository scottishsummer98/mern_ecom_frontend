import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import {
  fetchProducts,
  addProduct,
  fetchCategories,
  updateProduct,
  deleteProduct,
} from "../../redux/actionCreators";
import Spinner from "../sub/Spinner";
import { connect } from "react-redux";
import { API } from "../../utils/config";
import PreviewImage from "../sub/PreviewImage";
import { FiTrash, FiEdit } from "react-icons/fi";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    categories: state.categories,
    products: state.products,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addProduct: (values) => dispatch(addProduct(values)),
    fetchCategories: () => dispatch(fetchCategories()),
    fetchProducts: () => dispatch(fetchProducts()),
    updateProduct: (pid, values) => dispatch(updateProduct(pid, values)),
    deleteProduct: (pid) => dispatch(deleteProduct(pid)),
  };
};

const AdminProduct = (props) => {
  const [selectedProduct, setselectedProduct] = useState(null);
  const [selectedProductImageURL, setselectedProductImageURL] = useState(null);
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);
  useEffect(() => {
    if (!props.authentication.userInfo) {
      navigate("/");
    } else if (props.authentication.userInfo.role !== "admin") {
      navigate("/");
    }
  }, [props.authentication.userInfo, navigate]);
  const handleEditProduct = (product) => {
    setselectedProduct(product);
    fetch(API + "/product/photo/" + product._id)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "product-image.png"); // Create a File from the blob
        setselectedProductImageURL(file);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  };
  if (!props.authentication.userInfo) {
    return null;
  }
  let sl = 1;
  let productList = null;
  if (props.products.isLoading) {
    productList = <Spinner />;
  } else {
    productList = props.products.products.map((product) => {
      return (
        <tr key={product._id}>
          <td>{sl++}</td>
          <td>{product.name}</td>
          <td>
            <img
              style={{ width: "5rem", height: "5rem" }}
              src={API + "/product/photo/" + product._id}
              alt="ProductImage"
            />
          </td>
          <td>{product.description}</td>
          <td>{product.price}</td>
          <td>{product.category.name}</td>
          <td>{product.quantity}</td>
          <td>{product.sold}</td>
          <td>
            <button
              className="btn btn-dark"
              onClick={() => handleEditProduct(product)}
            >
              <FiEdit />
            </button>
            <br />
            <br />
            <button
              className="btn btn-dark"
              onClick={() => props.deleteProduct(product._id)}
            >
              <FiTrash />
            </button>
          </td>
        </tr>
      );
    });
  }
  return (
    <div className="admin_product_container">
      <div>
        <h4>{selectedProduct ? "Edit Product" : "Add New Product"}</h4>
        <Formik
          key={selectedProduct ? selectedProduct._id : "add-product"}
          initialValues={{
            name: selectedProduct ? selectedProduct.name : "",
            description: selectedProduct ? selectedProduct.description : "",
            price: selectedProduct ? selectedProduct.price : "",
            category: selectedProduct ? selectedProduct.category._id : "",
            quantity: selectedProduct ? selectedProduct.quantity : "",
            photo: null,
          }}
          onSubmit={(values, { resetForm }) => {
            if (selectedProduct) {
              props.updateProduct(selectedProduct._id, values);
              setselectedProduct(null);
              setselectedProductImageURL(null);
            } else {
              props.addProduct(values);
            }

            resetForm();
          }}
          validate={(values) => {
            const errors = {};

            if (!values.name) {
              errors.name = "Required!";
            }
            if (!values.description) {
              errors.description = "Required!";
            }
            if (!values.price) {
              errors.price = "Required!";
            } else if (values.price < 0) {
              errors.price = "Negative Values not allowed";
            }
            if (!values.quantity) {
              errors.quantity = "Required!";
            } else if (values.quantity < 0) {
              errors.quantity = "Negative Values not allowed";
            }
            if (!selectedProductImageURL && !values.photo) {
              errors.photo = "Required!";
            }
            return errors;
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue, errors }) => (
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
                  <label>Product Name</label>
                  <input
                    name="name"
                    placeholder="Enter name"
                    className="form-control"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.name}</span>
                </div>
                <div>
                  <label>Product Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter description"
                    className="form-control"
                    value={values.description}
                    rows={3}
                    onChange={handleChange}
                  />
                  <span className="validation_error">{errors.description}</span>
                </div>
                <div>
                  <label>Product Category</label>
                  <select
                    name="category"
                    className="form-control"
                    value={values.category}
                    onChange={handleChange}
                  >
                    <option value="">Pick a category</option>
                    {props.categories.categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <span className="validation_error">{errors.category}</span>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <label>Product Price</label>
                    <input
                      name="price"
                      step="0.01"
                      min="0"
                      type="number"
                      placeholder="Enter price"
                      className="form-control"
                      value={values.price}
                      onChange={handleChange}
                    />
                    <span className="validation_error">{errors.price}</span>
                  </div>
                  <div className="col-lg-6">
                    <label>Product Quantity</label>
                    <input
                      name="quantity"
                      min="0"
                      max="25"
                      type="number"
                      placeholder="Enter quantity"
                      className="form-control"
                      value={values.quantity}
                      onChange={handleChange}
                    />
                    <span className="validation_error">{errors.quantity}</span>
                  </div>
                </div>
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    name="photo"
                    hidden
                    placeholder="Choose Image"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("photo", e.target.files[0]);
                    }}
                  />

                  {values.photo ? (
                    <>
                      <PreviewImage file={values.photo} />
                      <br />
                    </>
                  ) : selectedProductImageURL ? (
                    <>
                      <PreviewImage file={selectedProductImageURL} />
                      <br />
                    </>
                  ) : null}

                  <button
                    className="btn btn-dark"
                    onClick={(e) => {
                      e.preventDefault();
                      fileRef.current.click();
                    }}
                  >
                    Choose Image
                  </button>
                  <br />
                  <span className="validation_error">{errors.photo}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <button type="submit" className="btn btn-dark">
                    {selectedProduct ? "Update" : "Add"}
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
      <div>
        <h4>Product List</h4>
        <div className="table-responsive">
          <table className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>Sl</th>
                <th>Name</th>
                <th>Image</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Sold</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{productList}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminProduct);
