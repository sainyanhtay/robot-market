import React from "react";
import withContext from "../withContext";
import CartItem from "./CartItem";

const currencyFormat = (num) => {
  return "฿ " + Intl.NumberFormat("en-US").format(num);
};

const Cart = (props) => {
  const { cart } = props.context;
  const cartKeys = Object.keys(cart || {});
  let totalAmount = 0;
  let totalPrice = 0;

  for (const property in cart) {
    totalAmount += cart[property].amount;
    totalPrice += Number(cart[property].product.price) * cart[property].amount;
  }

  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">My Cart</h4>
        </div>
      </div>
      <br />
      <div className="container">
        <b className="is-pulled-left" style={{ textTransform: "capitalize" }}>
          Total in Cart: {totalAmount}
        </b>
        <b className="is-pulled-right" style={{ textTransform: "capitalize" }}>
          Total Price: {currencyFormat(totalPrice)}
        </b>
        {cartKeys.length ? (
          <div className="column columns is-multiline">
            {cartKeys.map((key) => (
              <CartItem
                cartKey={key}
                key={key}
                cartItem={cart[key]}
                removeFromCart={props.context.removeFromCart}
                addToCart={props.context.addToCart}
              />
            ))}
            <div className="column is-12 is-clearfix">
              <br />
              <div className="is-pulled-right">
                <button
                  onClick={props.context.clearCart}
                  className="button is-warning "
                >
                  Clear cart
                </button>{" "}
                <button
                  className="button is-success"
                  onClick={props.context.checkout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="column">
            <div className="title has-text-grey-light">No item in cart!</div>
          </div>
        )}
      </div>
    </>
  );
};

export default withContext(Cart);
