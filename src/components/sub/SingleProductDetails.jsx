import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../utils/config";
import {
  fetchSingleProduct,
  addCart,
  deleteCart,
  addReview,
  updateReview,
  deleteReview,
} from "../../redux/actionCreators";
import Spinner from "./Spinner";
import { connect, useDispatch } from "react-redux";
import { Formik } from "formik";
import StarRating from "./StarRating";
import dateFormat from "dateformat";
import AvatarImage from "../../images/blank_avatar.jpg";
import { FiTrash, FiEdit } from "react-icons/fi";

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    categories: state.categories,
    products: state.products,
    cart: state.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSingleProduct: (pid) => dispatch(fetchSingleProduct(pid)),
    addCart: (pid, price, uid) => dispatch(addCart(pid, price, uid)),
    deleteCart: (cid) => dispatch(deleteCart(cid)),
    addReview: (pid, comment, rating) =>
      dispatch(addReview(pid, comment, rating)),
    updateReview: (pid, rid, comment, rating) =>
      dispatch(updateReview(pid, rid, comment, rating)),
    deleteReview: (pid, rid) => dispatch(deleteReview(pid, rid)),
  };
};

const SingleProductDetails = (props) => {
  const { id } = useParams();
  const [selectedReview, setSelectedReview] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch]);

  const isProductInCart = props.cart.cart.some(
    (item) => item.product._id === props.products.products._id
  );
  const handleRemoveFromCart = () => {
    if (isProductInCart) {
      const cartItem = props.cart.cart.find(
        (item) => item.product._id === props.products.products._id
      );
      props.deleteCart(cartItem._id);
    }
  };
  let reviews = null;
  props.products.products.reviews && props.products.products.reviews.length > 0
    ? (reviews = (
        <div className="single_product_details_reviews_container">
          {props.products.products.reviews
            .map((review) => ({
              ...review,
              createdAt: new Date(review.createdAt),
            }))
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((review) => {
              let actionButtions = null;
              if (props.authentication.userInfo._id === review.user._id) {
                actionButtions = (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignSelf: "flex-end",
                    }}
                  >
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "white",
                      }}
                      onClick={() => setSelectedReview(review)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "white",
                      }}
                      onClick={() => props.deleteReview(id, review._id)}
                    >
                      <FiTrash />
                    </button>
                  </div>
                );
              }
              return (
                <div className="commentsList_container" key={review._id}>
                  <div className="commenteesinfo">
                    <img
                      className="commentList_avatarimage"
                      src={AvatarImage}
                      alt="blank_avatar"
                    />
                    <span className="commentList_user">{review.user.name}</span>
                    <span className="commentList_date">
                      {dateFormat(review.createdAt, "dd/mm/yyyy, h:MM TT")}
                    </span>
                  </div>
                  <hr style={{ margin: "0" }} />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        textAlign: "justify",
                        marginLeft: "3rem",
                        marginRight: "3rem",
                        alignSelf: "flex-start",
                      }}
                    >
                      {review.comment}
                      <StarRating rating={review.rating} />
                    </div>
                    {actionButtions}
                  </div>
                </div>
              );
            })}
        </div>
      ))
    : (reviews = (
        <div className="commentsList_container">No Review Available</div>
      ));
  let selectedProduct = null;
  props.products.isLoading
    ? (selectedProduct = <Spinner />)
    : (selectedProduct = (
        <>
          <img
            src={API + "/product/photo/" + id}
            alt="Product"
            className="single_product_details_img"
          />
          <div className="single_product_details_info">
            <h2>{props.products.products.name}</h2>
            <h5>
              <StarRating rating={props.products.products.avg_rating} />
            </h5>
            {props.products.products.category && (
              <p className="single_product_details_category">
                {props.products.products.category.name}
              </p>
            )}
            <hr />
            <p className="single_product_details_description">
              {props.products.products.description}
            </p>
            <hr />
            <div className="single_product_details_price_quantity_sold_container">
              <p className="single_product_details_price">
                {props.products.products.price} Tk
              </p>
              <div className="single_product_details_quantity_sold_container">
                <p
                  className={`single_product_details_quantity_sold ${
                    props.products.products.quantity > 0 ? "green" : "red"
                  }`}
                >
                  {props.products.products.quantity > 0
                    ? `In Stock : ${props.products.products.quantity}`
                    : "Out of Stock"}
                </p>
                <p className="single_product_details_quantity_sold yellow">
                  Sold: {props.products.products.sold}
                </p>
              </div>
            </div>
            <hr />
            <div className="single_product_details_buttons_container">
              {props.authentication.userInfo ? (
                isProductInCart ? (
                  <button
                    className="btn btn-danger"
                    onClick={handleRemoveFromCart}
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      props.addCart(
                        props.products.products._id,
                        props.products.products.price,
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

              <button
                className="btn btn-secondary"
                onClick={() => {
                  navigate("/");
                }}
              >
                Go Back
              </button>
            </div>
          </div>

          <div>
            {props.authentication.userInfo ? (
              <Formik
                key={selectedReview ? selectedReview._id : "add-review"}
                initialValues={{
                  comment: selectedReview ? selectedReview.comment : "",
                  rating: selectedReview ? selectedReview.rating : 5,
                }}
                onSubmit={(values, { resetForm }) => {
                  if (selectedReview) {
                    props.updateReview(
                      id,
                      selectedReview._id,
                      values.comment,
                      values.rating
                    );
                    setSelectedReview(null);
                  } else {
                    props.addReview(id, values.comment, values.rating);
                  }

                  resetForm();
                }}
                validate={(values) => {
                  const errors = {};

                  if (!values.comment) {
                    errors.comment = "Required!";
                  }

                  return errors;
                }}
              >
                {({ values, handleChange, handleSubmit, errors }) => (
                  <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div>
                      <input
                        name="comment"
                        placeholder="Enter review"
                        className="form-control single_product_details_reviews_form_input"
                        value={values.comment}
                        onChange={handleChange}
                      />
                      <span className="validation_error">{errors.comment}</span>
                    </div>
                    <div>
                      <select
                        name="rating"
                        className="form-control"
                        value={values.rating}
                        onChange={handleChange}
                        style={{ width: "2.5rem" }}
                      >
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                      </select>
                    </div>
                    <button className="btn btn-secondary">
                      {selectedReview ? "Update" : "Comment"}
                    </button>
                  </form>
                )}
              </Formik>
            ) : (
              <div
                className="single_product_details_reviews_container"
                style={{
                  height: "3.5rem",
                  backgroundColor: "rgb(51, 51, 51)",
                  padding: "1rem",
                  overflow: "hidden",
                }}
              >
                Please log in to comment
              </div>
            )}

            {reviews}
          </div>
        </>
      ));
  return (
    <div className="single_product_details_container">{selectedProduct}</div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleProductDetails);
