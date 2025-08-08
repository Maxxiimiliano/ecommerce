import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import '../styles/Products.css';
import "../styles/Common.css";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product, variant) => {
    dispatch(addCart(product, variant));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");    
      if (componentMounted) {
        const rawData = await response.clone().json();
        // Append variants + stock (two products always out of stock)
        let zeroStockCount = 0;
        const dataWithVars = rawData.map((item) => {
          let stockValue;

          if (zeroStockCount < 2) {
            stockValue = 0; // force out of stock
            zeroStockCount++;
          } else {
            stockValue = 1; // in stock
          }

          return {
            ...item,
            variants: ["Variable 1", "Variable 2", "Variable 3"],
            stock: stockValue,
          };
        });

        setData(dataWithVars);
        setFilter(dataWithVars);
        console.log("Data: " + JSON.stringify(data))
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => {
          return (
            <div
            id={product.id}
            key={product.id}
            className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
          >
            <div className="card text-center h-100 position-relative product-card" key={product.id}>
              {/* Out of stock badge */}
              {product.stock === 0 && (
                <span className="badge bg-secondary position-absolute top-0 start-0 m-2">
                  Out of stock
                </span>
              )}

              {/* Small variant dropdown (fixed + styled) */}
              {product.variants?.length > 0 && (
                <select
                  className="variant-select"
                  value={selectedVariants[product.id] ?? product.variants[0]}
                  onChange={(e) =>
                    setSelectedVariants((s) => ({ ...s, [product.id]: e.target.value }))
                  }
                  aria-label={`Select variant for ${product.title}`}
                >
                  {product.variants.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              )}

              {/* Image area */}
              <div className="product-media">
                <img
                  className="img-fluid"
                  src={product.image}
                  alt={product.title}
                  style={{ maxHeight: '100%', width: '100%', objectFit: 'contain' }}
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="card-body">
                <h5 className="card-title clamp-2" title={product.title}>
                  {product.title}
                </h5>
                <p className="card-text clamp-3 text-muted mb-0">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <ul className="list-group list-group-flush">
                <li className="list-group-item lead mb-0">$ {product.price}</li>
              </ul>

              {/* Actions stick to bottom */}
              <div className="product-card-footer">
                <Link to={`/product/${product.id}`} className="btn btn-outline-dark">
                  Buy Now
                </Link>

                {product.stock === 0 ? (
                  <button className="btn btn-secondary" disabled>
                    Out of Stock
                  </button>
                ) : (
                  <button
                    className="btn btn-dark"
                    onClick={() => {
                      const sv = selectedVariants[product.id] ?? product.variants?.[0] ?? null;
                      toast.success("Added to cart");
                      addProduct({ ...product, selectedVariant: sv }, sv);
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>

          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
