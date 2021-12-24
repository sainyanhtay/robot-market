import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Cart from "./components/Cart";
import Login from "./components/Login";
import ProductList from "./components/ProductList";

import Context from "./Context";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {},
      products: [],
      storedProducts: [],
    };
    this.routerRef = React.createRef();
  }

  async componentDidMount() {
    let user = localStorage.getItem("user");

    const products = await axios.get("http://localhost:8000/api/robots");
    user = user ? JSON.parse(user) : null;

    console.log("check", products);

    this.setState({
      user,
      products: products.data.data,
      storedProducts: JSON.parse(JSON.stringify(products.data.data)),
    });
  }

  login = async (email, password) => {
    const res = await axios
      .post("http://localhost:8000/api/login", { email, password })
      .catch((res) => {
        return { status: 401, message: "Unauthorized" };
      });

    if (res.status === 200) {
      // const { email } = jwt_decode(res.data.accessToken);
      const { email } = res.data.accessToken;
      const user = {
        email,
        token: res.data.accessToken,
        accessLevel: email === "admin@example.com" ? 0 : 1,
      };

      this.setState({ user });
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  };

  logout = (e) => {
    e.preventDefault();
    this.setState({ user: null });
    localStorage.removeItem("user");
  };

  addToCart = (cartItem) => {
    let { cart, products } = this.state;

    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }

    this.setState({ cart });

    // reduce the amount of stock
    products.find((item) => item == cartItem.product).stock -= cartItem.amount;

    if (Object.keys(cart).length > 5)
      toast.warn(
        "You already have selected more than 5 different robots in the cart."
      );
  };

  removeFromCart = (cartItemId) => {
    let { cart, products } = this.state;

    // reincrease the amount of stock
    products.find((item) => item == cart[cartItemId].product).stock +=
      cart[cartItemId].amount;

    delete cart[cartItemId];

    this.setState({ cart });
  };

  clearCart = () => {
    let cart = {};
    this.setState({ cart, products: this.state.storedProducts });
  };

  checkout = () => {
    if (!this.state.user) {
      this.routerRef.current.history.push("/login");
      return;
    }

    const cart = this.state.cart;

    const products = this.state.products.map((p) => {
      if (cart[p.name]) {
        p.stock = p.stock - cart[p.name].amount;

        axios.put(`http://localhost:8000/api/products/${p.id}`, { ...p });
      }
      return p;
    });

    this.setState({ products });
    this.clearCart();
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          removeFromCart: this.removeFromCart,
          addToCart: this.addToCart,
          login: this.login,
          clearCart: this.clearCart,
          checkout: this.checkout,
        }}
      >
        <Router ref={this.routerRef}>
          <ToastContainer />
          <div className="App">
            <nav
              className="navbar container"
              role="navigation"
              aria-label="main navigation"
            >
              <div className="navbar-brand">
                <b className="navbar-item is-size-4 ">Robot Market</b>
                <label
                  role="button"
                  className="navbar-burger burger"
                  aria-label="menu"
                  aria-expanded="false"
                  data-target="navbarBasicExample"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ showMenu: !this.state.showMenu });
                  }}
                >
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </label>
              </div>
              <div
                className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}
              >
                <Link to="/products" className="navbar-item">
                  Products
                </Link>
                {this.state.user && this.state.user.accessLevel < 1 && (
                  <Link to="/add-product" className="navbar-item">
                    Add Product
                  </Link>
                )}
                <Link to="/cart" className="navbar-item">
                  Cart
                  <span
                    className="tag is-primary"
                    style={{ marginLeft: "5px" }}
                  >
                    {Object.keys(this.state.cart).length}
                  </span>
                </Link>
                {!this.state.user ? (
                  <Link to="/login" className="navbar-item">
                    Login
                  </Link>
                ) : (
                  <Link to="/" onClick={this.logout} className="navbar-item">
                    Logout
                  </Link>
                )}
              </div>
            </nav>
            <Switch>
              <Route exact path="/" component={ProductList} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/products" component={ProductList} />
            </Switch>
          </div>
        </Router>
      </Context.Provider>
    );
  }
}
