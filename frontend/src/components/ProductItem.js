import React from "react";
import moment from "moment";

function currencyFormat(num) {
  return "฿" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,");
}

const ProductItem = (props) => {
  const { product } = props;
  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img src={product.image} alt={product.shortDesc} />
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
            {product.stock > 0 ? (
              <small>{product.stock + " Available"}</small>
            ) : (
              <small className="has-text-danger">Out Of Stock</small>
            )}
            <div className="is-clearfix">
              <small className="is-pulled-left">
                {moment(product.createdAt).format("DD-MM-YYYY")}
              </small>
              <button
                className="button is-small is-outlined is-primary   is-pulled-right"
                onClick={() =>
                  props.addToCart({
                    id: product.name,
                    product,
                    amount: 1,
                  })
                }
                disabled={product.stock <= 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
