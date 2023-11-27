import * as actionTypes from "./actionTypes";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { API } from "../utils/config";

//Authentication
export const auth = (user) => (dispatch) => {
  dispatch(authLoading(true));
  let authURL = null;
  if (user.mode === "Register") {
    authURL = `${API}/auth/registration`;
  } else {
    authURL = `${API}/auth/login`;
  }
  axios
    .post(`${authURL}`, user.values, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(authLoading(false));
      dispatch(authSuccess(res.data.token, res.data.message));
    })
    .catch((err) => {
      dispatch(authLoading(false));
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data,
      });
    });
};
export const authSuccess = (token, message) => {
  localStorage.setItem("jwt", JSON.stringify(token));
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const decoded = jwt_decode(jwt);
  if (message) {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: message,
    });
  }
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {
      userInfo: decoded,
    },
  };
};
export const authLoading = (isLoading) => {
  return {
    type: actionTypes.AUTH_LOADING,
    payload: isLoading,
  };
};
export const authCheck = () => (dispatch) => {
  const tokenExists = JSON.parse(localStorage.getItem("jwt"));
  if (!tokenExists) {
    dispatch(logout());
  } else {
    const { exp } = jwt_decode(tokenExists);
    if (new Date().getTime() < exp * 1000) {
      dispatch(authSuccess(tokenExists, null));
    } else {
      dispatch(logout());
    }
  }
};
export const logout = () => {
  localStorage.removeItem("jwt");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};
// Authentication Google
export const authGoogle = () => (dispatch) => {
  dispatch(authLoading(true));
  window.location.href = `${API}/auth/google`;
};
// Authentication Facebook
export const authFacebook = () => (dispatch) => {
  dispatch(authLoading(true));
  window.location.href = `${API}/auth/facebook`;
};

//Category
const categoryLoading = () => ({
  type: actionTypes.CATEGORY_LOADING,
});
const loadCategory = (category) => ({
  type: actionTypes.LOAD_CATEGORY,
  payload: category,
});
export const fetchCategories = () => {
  return (dispatch) => {
    dispatch(categoryLoading());

    axios
      .get(`${API}/category`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .then((category) => dispatch(loadCategory(category)))
      .catch((error) => console.log(error));
  };
};
export const addCategory = (values) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  axios
    .post(`${API}/category`, values.values, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((category) => {
      dispatch(categoryConcat(category));
      dispatch(fetchCategories());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: category.message,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.response.data,
      });
    });
};
const categoryConcat = (category) => ({
  type: actionTypes.ADD_CATEGORY,
  payload: category,
});
export const updateCategory = (cid, name) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const updatedCategoryData = {
    _id: cid,
    name: name,
  };
  axios
    .put(`${API}/category`, updatedCategoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((category) => {
      dispatch(fetchCategories());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: category,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Something went wrong!",
      });
    });
};
export const deleteCategory = (cid) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  axios
    .delete(`${API}/category/${cid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((category) => {
      dispatch(fetchCategories());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: category,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Something went wrong!",
      });
    });
};

//Product
const productLoading = () => ({
  type: actionTypes.PRODUCT_LOADING,
});
const loadProduct = (product) => ({
  type: actionTypes.LOAD_PRODUCT,
  payload: product,
});
export const fetchProducts = () => {
  return (dispatch) => {
    dispatch(productLoading());

    axios
      .get(`${API}/product`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data)
      .then((product) => dispatch(loadProduct(product)))
      .catch((error) => console.log(error));
  };
};
export const addProduct = (formData) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  axios
    .post(`${API}/product`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
    .then((product) => {
      dispatch(productConcat(product));
      dispatch(fetchProducts());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: product.message,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.response.data,
      });
    });
};
const productConcat = (product) => ({
  type: actionTypes.ADD_PRODUCT,
  payload: product,
});
export const fetchSingleProduct = (id) => {
  return (dispatch) => {
    dispatch(productLoading());

    axios
      .get(`${API}/product/${id}`)
      .then((res) => res.data)
      .then((product) => dispatch(loadProduct(product)))
      .catch((error) => console.log(error));
  };
};
export const filterProducts = (order, sortBy, limit, skip, filters = {}) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const data = {
    order: order,
    sortBy: sortBy,
    limit: limit,
    skip: skip,
    filters: { ...filters },
  };
  return (dispatch) => {
    dispatch(productLoading());

    axios
      .post(`${API}/product/filter`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((product) => dispatch(loadProduct(product)))
      .catch((error) => console.log(error));
  };
};
export const updateProduct = (pid, values) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const formData = new FormData();
  for (const key in values) {
    formData.append(key, values[key]);
  }
  axios
    .put(`${API}/product/${pid}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((product) => {
      dispatch(fetchProducts());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: product.message,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Something went wrong!",
      });
    });
};
export const deleteProduct = (pid) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  axios
    .delete(`${API}/product/${pid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((product) => {
      dispatch(fetchProducts());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: product,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Something went wrong!",
      });
    });
};
export const addReview = (pid, comment, rating) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const newReviewData = {
    productId: pid,
    comment: comment,
    rating: rating,
  };
  axios
    .post(`${API}/product/review`, newReviewData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((review) => {
      dispatch(fetchSingleProduct(pid));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: review.message,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.response.data,
      });
    });
};
export const updateReview = (pid, rid, comment, rating) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const updatedReviewData = {
    productId: pid,
    comment: comment,
    rating: rating,
  };
  axios
    .put(`${API}/product/review/${rid}`, updatedReviewData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((review) => {
      dispatch(fetchSingleProduct(pid));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: review.message,
      });
    })
    .catch((error) => {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.response.data,
      });
    });
};
export const deleteReview = (pid, rid) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  axios
    .delete(`${API}/product/review/${rid}?productId=${pid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((review) => {
      dispatch(fetchSingleProduct(pid));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: review.message,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data,
      });
    });
};

//Coupon
const couponLoading = () => ({
  type: actionTypes.COUPON_LOADING,
});
const loadCoupon = (coupon) => ({
  type: actionTypes.LOAD_COUPON,
  payload: coupon,
});
export const fetchCoupons = () => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  return (dispatch) => {
    dispatch(couponLoading());

    axios
      .get(`${API}/coupon`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((coupon) => dispatch(loadCoupon(coupon)))
      .catch((error) => console.log(error));
  };
};
export const addCoupon = (values) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  axios
    .post(`${API}/coupon`, values.values, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((coupon) => {
      dispatch(couponConcat(coupon));
      dispatch(fetchCoupons());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: coupon.message,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.response.data,
      });
    });
};
const couponConcat = (coupon) => ({
  type: actionTypes.ADD_COUPON,
  payload: coupon,
});
export const updateCoupon = (cid, values) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const updatedCouponData = {
    code: values.code,
    amount: values.amount,
    limit: values.limit,
    expirationDate: values.expirationDate,
  };
  axios
    .put(`${API}/coupon/${cid}`, updatedCouponData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((coupon) => {
      dispatch(fetchCoupons());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: coupon,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Something went wrong!",
      });
    });
};
export const deleteCoupon = (cid) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  axios
    .delete(`${API}/coupon/${cid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((coupon) => {
      dispatch(fetchCoupons());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: coupon,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Something went wrong!",
      });
    });
};
export const checkCoupon = (code) => {
  return (dispatch) => {
    dispatch(couponLoading());

    axios
      .get(`${API}/coupon/${code}`)
      .then((res) => res.data)
      .then((coupon) => {
        dispatch(loadCoupon(coupon));
        Swal.fire({
          icon: "success",
          title: "Success",
          text: coupon.message,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "error",
          text: error.response.data,
        });
      });
  };
};
export const clearCoupon = () => {
  return {
    type: "CLEAR_COUPON",
  };
};

//Cart
const cartLoading = () => ({
  type: actionTypes.CART_LOADING,
});
const loadCart = (cart) => ({
  type: actionTypes.LOAD_CART,
  payload: cart,
});
export const fetchCart = () => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  return (dispatch) => {
    dispatch(cartLoading());
    axios
      .get(`${API}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((cart) => dispatch(loadCart(cart)))
      .catch((error) => console.log(error));
  };
};
export const addCart = (pid, price, uid) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const cartData = {
    product: pid,
    price: price,
    user: uid,
  };
  axios
    .post(`${API}/cart`, cartData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((cart) => {
      dispatch(cartConcat(cart));
      dispatch(fetchCart());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: cart.message,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.response.data,
      });
    });
};
const cartConcat = (cart) => ({
  type: actionTypes.ADD_CART,
  payload: cart,
});

export const updateCart = (cid, count) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const updatedCartData = {
    _id: cid,
    count: count,
  };
  axios
    .put(`${API}/cart`, updatedCartData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((cart) => {
      dispatch(fetchCart());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: cart,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Something went wrong!",
      });
    });
};
export const deleteCart = (cid) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  axios
    .delete(`${API}/cart/${cid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((cart) => {
      dispatch(fetchCart());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: cart,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Something went wrong!",
      });
    });
};

// Order
const orderLoading = () => ({
  type: actionTypes.ORDER_LOADING,
});
const loadOrder = (order) => ({
  type: actionTypes.LOAD_ORDER,
  payload: order,
});
export const fetchOrder = () => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  return (dispatch) => {
    dispatch(orderLoading());
    axios
      .get(`${API}/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((order) => dispatch(loadOrder(order)))
      .catch((error) => console.log(error));
  };
};

//Shipping
const userDetailsLoading = () => ({
  type: actionTypes.USER_DETAILS_LOADING,
});
const loadUserDetails = (info) => ({
  type: actionTypes.LOAD_USER_DETAILS,
  payload: info,
});
export const fetchUserDetails = () => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  return (dispatch) => {
    dispatch(userDetailsLoading());
    axios
      .get(`${API}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((info) => dispatch(loadUserDetails(info)))
      .catch((error) => console.log(error));
  };
};
export const addUserDetails = (values) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const formData = new FormData();
  for (const key in values) {
    formData.append(key, values[key]);
  }
  axios
    .post(`${API}/profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((info) => {
      dispatch(fetchUserDetails());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: info.message,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.response.data,
      });
    });
};
export const updateUserDetails = (uid, values) => (dispatch) => {
  const token = JSON.parse(localStorage.getItem("jwt"));
  const formData = new FormData();
  for (const key in values) {
    formData.append(key, values[key]);
  }
  axios
    .put(`${API}/profile/${uid}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((info) => {
      dispatch(fetchUserDetails());
      Swal.fire({
        icon: "success",
        title: "Success",
        text: info.message,
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Something went wrong!",
      });
    });
};
//SSL
const setGatewayPageURL = (url) => ({
  type: actionTypes.SET_GATEWAY_URL,
  payload: url,
});
export const initPayment = (cc) => {
  return (dispatch) => {
    const token = JSON.parse(localStorage.getItem("jwt"));
    return new Promise((resolve, reject) => {
      axios
        .get(`${API}/payment/${cc}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.status === "SUCCESS") {
            dispatch(setGatewayPageURL(response.data.GatewayPageURL));
            resolve(response.data.GatewayPageURL);
          } else {
            reject(new Error("Payment initialization failed"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};
