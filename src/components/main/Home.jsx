import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SingleProduct from "../sub/SingleProduct";
import {
  fetchCategories,
  fetchProducts,
  filterProducts,
  fetchCart,
} from "../../redux/actionCreators";
import { connect } from "react-redux";
import Checkbox from "../sub/Checkbox";
import RadioButton from "../sub/RadioButton";
import OrderDropdown from "../sub/OrderDropdown";
import SortDropdown from "../sub/SortDropdown";
import Searchbar from "../sub/Searchbar";
import Spinner from "../sub/Spinner";

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
    fetchCategories: () => dispatch(fetchCategories()),
    fetchProducts: () => dispatch(fetchProducts()),
    fetchCart: () => dispatch(fetchCart()),
    filterProducts: (order, sortBy, limit, skip, filters) =>
      dispatch(filterProducts(order, sortBy, limit, skip, filters)),
  };
};

const Home = (props) => {
  const [filters, setFilters] = useState({
    category: [],
    price: [],
  });
  const [buttonState, setButtonState] = useState(true);
  const [orderFilter, setOrderFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("");
  const [limitFilter, setLimitFilter] = useState(4);
  const [skipFilter, setSkipFilter] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const handleSearchChange = (key) => {
    setSearchKey(key);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchCart());
  }, [dispatch]);
  useEffect(() => {
    props.filterProducts(
      orderFilter,
      sortFilter,
      limitFilter,
      skipFilter,
      filters
    );
  }, [orderFilter, sortFilter, limitFilter, skipFilter, filters]);
  let priceRangeOptions = [
    {
      _id: 0,
      name: "Any",
      arr: [],
    },
    {
      _id: 1,
      name: "0-1000",
      arr: [0, 1000],
    },
    {
      _id: 2,
      name: "1000-2000",
      arr: [1000, 2000],
    },
    {
      _id: 3,
      name: "2000-3000",
      arr: [2000, 3000],
    },
    {
      _id: 4,
      name: "More than 3000",
      arr: [3000, 1000000],
    },
  ];
  let products = null;
  if (props.products.isLoading) {
    products = <Spinner />;
  } else {
    if (props.products !== null && Array.isArray(props.products.products)) {
      products = props.products.products
        .filter((product) => {
          if (searchKey === "") {
            return true;
          } else {
            return product.name.toLowerCase().includes(searchKey.toLowerCase());
          }
        })
        .map((product) => <SingleProduct product={product} key={product.id} />);
    }
  }

  const handleFilters = (myFilters, filterBy) => {
    const newFilters = { ...filters };
    console.log(newFilters);
    if (filterBy === "category") {
      newFilters[filterBy] = myFilters;
    } else if (filterBy === "price") {
      const data = priceRangeOptions;
      let arr = [];
      for (let i in data) {
        if (data[i]._id === parseInt(myFilters)) {
          arr = data[i].arr;
        }
      }
      newFilters[filterBy] = arr;
    }
    setFilters(newFilters);
    props.filterProducts(orderFilter, sortFilter, 20, 0, newFilters);
  };
  const handleOrderFilter = (orderType) => {
    setOrderFilter(orderType);
  };
  const handleSortFilter = (sortType) => {
    setSortFilter(sortType);
  };
  return (
    <div>
      <div className="home_container">
        <div className="home_bg"></div>
        <div className="home_bg_container">
          <div className="home_bg_container_text">
            <h1>BET YOU CANNOT BUY LESS</h1>
            <p>Browse Buy & Use</p>
          </div>
          <div className="filter_search_container">
            <div className="search_container">
              <Searchbar onSearchChange={handleSearchChange} />
            </div>
            <div className="filter_container">
              <div>
                <p>Filter By Categories</p>
                <ul>
                  <Checkbox
                    options={props.categories.categories}
                    handleFilters={(myFilters) =>
                      handleFilters(myFilters, "category")
                    }
                  />
                </ul>
              </div>
              <div style={{ borderRight: "2px solid white" }}></div>
              <div>
                <p>Filter By Price</p>
                <ul>
                  <RadioButton
                    options={priceRangeOptions}
                    name="price"
                    handleFilters={(myFilters) =>
                      handleFilters(myFilters, "price")
                    }
                  />
                </ul>
              </div>
              <div style={{ borderRight: "2px solid white" }}></div>
              <div>
                <p>Filter By Order</p>
                <ul>
                  <OrderDropdown
                    handleOrderFilter={(orderType) =>
                      handleOrderFilter(orderType)
                    }
                  />
                </ul>
                <p>Filter By Sort Criteria</p>
                <ul>
                  <SortDropdown
                    handleSortFilter={(sortType) => handleSortFilter(sortType)}
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product_list_button_container">
        <div className="product_list_container">{products}</div>&nbsp;
        {buttonState ? (
          <div>
            <button
              className="btn btn-success mb-3"
              onClick={() => {
                const skipIncrement = 1;
                const newSkipFilter = skipFilter + skipIncrement;
                setSkipFilter(newSkipFilter);
              }}
            >
              Load More
            </button>
            &nbsp;
            <button
              className="btn btn-success mb-3"
              onClick={() => {
                setButtonState(false);
                setSkipFilter(0);
                setLimitFilter(100);
              }}
            >
              View All
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
