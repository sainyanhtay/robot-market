import React from "react";

const currencyFormat = (num) => {
  return "฿" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,");
};

const adjustCart = (props, isIncrease) => {
  const { product } = props.cartItem;

  props.addToCart({
    id: product.name,
    product,
    amount: isIncrease ? 1 : -1,
  });
};

const CartItem = (props) => {
  const { cartItem, cartKey } = props;

  const { product, amount } = cartItem;
  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img src={product.image} alt={product.name} />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.name}{" "}
              <span className="tag is-primary">
                {currencyFormat(Number(product.price))}
              </span>
            </b>
            <div>{product.material}</div>
            <small>{`${amount} in cart ( ${product.stock} left )`}</small>
          </div>

          <div
            className="media-right"
            onClick={() => props.removeFromCart(cartKey)}
          >
            <span className="delete is-large"></span>
          </div>
        </div>
        <div className="is-clearfix">
          <button
            className="button is-small is-warning is-outlined is-primary   is-pulled-left"
            disabled={amount == 0}
            onClick={() => adjustCart(props, false)}
          >
            -
          </button>
          <button
            className="button is-small is-outlined is-primary   is-pulled-right"
            disabled={product.stock <= 0}
            onClick={() => adjustCart(props, true)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
