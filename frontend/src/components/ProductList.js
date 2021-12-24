import React, { Component } from "react";
import ProductItem from "./ProductItem";
import withContext from "../withContext";
import Select from "react-select";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: props.context.products || [],
      selectedOption: null,
      filteredProduct: props.context.products || [],
      materialList: this.getMaterialList(true) || [],
    };
  }

  getMaterialList = (isReturn) => {
    const { products } = this.props.context;

    // create material list
    let materialList = [
      { value: products[0]?.material, label: products[0]?.material },
    ];

    products.map((p) => {
      if (!materialList.find((m) => m.value == p.material))
        materialList.push({ value: p.material, label: p.material });
    });

    if (isReturn) return materialList;
    else this.setState({ products, filteredProduct: products, materialList });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.context.products?.length !== this.props.context.products?.length
    ) {
      this.getMaterialList();
    }
  }

  handleChange = (selectedOption) => {
    const { products } = this.state;
    this.setState({
      selectedOption,
      filteredProduct:
        selectedOption.length > 0
          ? products.filter((p) =>
              selectedOption.find((option) => option.value == p.material)
            )
          : products,
    });
  };

  render() {
    const { selectedOption, filteredProduct, materialList } = this.state;
    return (
      <>
        <div className="hero is-primary">
          <div className="hero-body container">
            <h4 className="title">Our Products</h4>
          </div>
        </div>
        <br />
        <div className="container">
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={materialList}
            placeholder={`Filter by material`}
            isMulti
            isSearchable
          />
          <div className="column columns is-multiline">
            {filteredProduct && filteredProduct.length ? (
              filteredProduct.map((product, index) => (
                <ProductItem
                  product={product}
                  key={index}
                  addToCart={this.props.context.addToCart}
                />
              ))
            ) : (
              <div className="column">
                <span className="title has-text-grey-light">
                  No products found!
                </span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default withContext(ProductList);
