import * as actionTypes from "./actionTypes";
import { combineReducers } from "redux";

const authReducer = (
  authState = {
    userInfo: null,
    authLoading: false,
  },
  action
) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      return {
        ...authState,
        userInfo: action.payload.userInfo,
        authLoading: false,
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...authState,
        userInfo: null,
        authLoading: false,
      };
    case actionTypes.AUTH_LOADING:
      return {
        ...authState,
        authLoading: action.payload,
      };
    default:
      return authState;
  }
};
const categoryReducer = (
  categoryState = {
    isLoading: false,
    categories: [],
  },
  action
) => {
  switch (action.type) {
    case actionTypes.CATEGORY_LOADING:
      return {
        ...categoryState,
        isLoading: true,
        categories: [],
      };
    case actionTypes.LOAD_CATEGORY:
      return {
        ...categoryState,
        isLoading: false,
        categories: action.payload,
      };
    case actionTypes.ADD_CATEGORY:
      let newCategory = action.payload;
      return {
        ...categoryState,
        isLoading: false,
        categories: categoryState.categories.concat(newCategory),
      };
    default:
      return categoryState;
  }
};
const productReducer = (
  productState = {
    isLoading: false,
    products: [],
  },
  action
) => {
  switch (action.type) {
    case actionTypes.PRODUCT_LOADING:
      return {
        ...productState,
        isLoading: true,
        products: [],
      };
    case actionTypes.LOAD_PRODUCT:
      return {
        ...productState,
        isLoading: false,
        products: action.payload,
      };
    case actionTypes.ADD_PRODUCT:
      let newProduct = action.payload;
      return {
        ...productState,
        isLoading: false,
        products: productState.products.concat(newProduct),
      };
    default:
      return productState;
  }
};
const couponReducer = (
  couponState = {
    isLoading: false,
    coupons: [],
  },
  action
) => {
  switch (action.type) {
    case actionTypes.COUPON_LOADING:
      return {
        ...couponState,
        isLoading: true,
        coupons: [],
      };
    case actionTypes.LOAD_COUPON:
      return {
        ...couponState,
        isLoading: false,
        coupons: action.payload,
      };
    case actionTypes.ADD_COUPON:
      let newCoupon = action.payload;
      return {
        ...couponState,
        isLoading: false,
        coupons: couponState.coupons.concat(newCoupon),
      };
    case actionTypes.CLEAR_COUPON:
      return {
        ...couponState,
        isLoading: false,
        coupons: [],
      };
    default:
      return couponState;
  }
};
const cartReducer = (
  cartState = {
    isLoading: false,
    cart: [],
  },
  action
) => {
  switch (action.type) {
    case actionTypes.CART_LOADING:
      return {
        ...cartState,
        isLoading: true,
        cart: [],
      };
    case actionTypes.LOAD_CART:
      return {
        ...cartState,
        isLoading: false,
        cart: action.payload,
      };
    case actionTypes.ADD_CART:
      let newCart = action.payload;
      return {
        ...cartState,
        isLoading: false,
        cart: cartState.cart.concat(newCart),
      };
    default:
      return cartState;
  }
};
const orderReducer = (
  orderState = {
    isLoading: false,
    order: [],
  },
  action
) => {
  switch (action.type) {
    case actionTypes.ORDER_LOADING:
      return {
        ...orderState,
        isLoading: true,
        order: [],
      };
    case actionTypes.LOAD_ORDER:
      return {
        ...orderState,
        isLoading: false,
        order: action.payload,
      };

    default:
      return orderState;
  }
};
const userDetailsReducer = (
  userDetailsState = {
    isLoading: false,
    userDetails: [],
  },
  action
) => {
  switch (action.type) {
    case actionTypes.USER_DETAILS_LOADING:
      return {
        ...userDetailsState,
        isLoading: true,
        userDetails: [],
      };
    case actionTypes.LOAD_USER_DETAILS:
      return {
        ...userDetailsState,
        isLoading: false,
        userDetails: action.payload,
      };

    default:
      return userDetailsState;
  }
};
const paymentReducer = (
  paymentState = {
    gatewayPageURL: null,
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_GATEWAY_URL:
      return {
        ...paymentState,
        gatewayPageURL: action.payload,
      };
    default:
      return paymentState;
  }
};

export const Reducer = combineReducers({
  authentication: authReducer,
  categories: categoryReducer,
  products: productReducer,
  coupons: couponReducer,
  cart: cartReducer,
  order: orderReducer,
  userDetails: userDetailsReducer,
  payment: paymentReducer,
});
