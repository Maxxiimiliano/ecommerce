import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedSimilar, setSelectedSimilar] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product, variant) => {
  dispatch(addCart(product, variant));
};

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      

      // Append the variants
       const productWithVars = {
      ...data,
      variants: ["Variant 1", "Variant 2", "Variant 3"],
    };
      setProduct(productWithVars);
      setLoading(false);
      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const data2 = await response2.json();
      // Append the variants
      const similarWithVars = data2.map((item) => ({
      ...item,
      variants: ["Variant 1", "Variant 2", "Variant 3"],
    }));
      setSimilarProducts(similarWithVars);

      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
  return (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 col-sm-12 py-3">
          <div className="product-media-main bg-white">
            <img
              className="img-fluid"
              src={product.image}
              alt={product.title}
              loading="lazy"
            />
          </div>
        </div>

        <div className="col-md-6 py-5">
          <h4 className="text-uppercase text-muted">{product.category}</h4>
          <h1 className="display-5 clamp-2" title={product.title}>{product.title}</h1>
          <p className="lead">
            {product.rating && product.rating.rate} <i className="fa fa-star"></i>
          </p>
          <h3 className="display-6 my-4">${product.price}</h3>
          <p className="lead clamp-3">{product.description}</p>

          {/* Variant dropdown */}
          {product.variants?.length > 0 && (
            <div className="mb-3" style={{ maxWidth: 220 }}>
              <label className="variant-label">Variant</label>
              <select
                className="form-select form-select-sm"
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
              >
                {product.variants.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}

          <button
            className="btn btn-outline-dark"
            onClick={() => addProduct({ ...product, selectedVariant }, selectedVariant)}
          >
            Add to Cart
          </button>
          <Link to="/cart" className="btn btn-dark mx-3">
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};


  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

 const ShowSimilarProduct = () => {
  return (
    <div className="py-4 my-4">
      <div className="d-flex">
        {similarProducts.map((item) => {
          // fix .jpg → _t.png (only when it ends with .jpg)
          let imgSrc = (item.image || '').trim();
          if (/\.jpg$/i.test(imgSrc)) {
            imgSrc = imgSrc.replace(/\.jpg$/i, 't.png');
          }

          const variants = item.variants ?? ["Variant 1", "Variant 2", "Variant 3"];

          return (
            <div
              key={item.id}
              className="card text-center product-card mx-4"
              style={{
                width: 320,
                minHeight: 480,  
                flex: "0 0 auto" 
              }}
            >
              {/* Variant dropdown top-right */}
              {variants.length > 0 && (
                <select
                  className="variant-select"
                  defaultValue={variants[0]}
                  aria-label={`Select variant for ${item.title}`}
                >
                  {variants.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              )}

              {/* Image area */}
              <div className="product-media">
                <img
                  className="img-fluid"
                  src={imgSrc}
                  alt={item.title}
                  loading="eager"
                />
              </div>

              <div className="card-body">
                <h5 className="card-title clamp-2" title={item.title}>
                  {item.title}
                </h5>
              </div>

              <ul className="list-group list-group-flush">
                <li className="list-group-item lead mb-0">$ {item.price}</li>
              </ul>

              <div className="product-card-footer">
                <Link to={`/product/${item.id}`} className="btn btn-outline-dark">
                  Buy Now
                </Link>
                <button
                  className="btn btn-dark"
                  onClick={() => addProduct({ ...item, selectedVariant: variants[0] }, variants[0])}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
  
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="w-100">
            <h2>You may also Like</h2>

            {loading2 ? (
              <Loading2 />
            ) : (
              <>
                {/* Desktop/Tablet: marquee */}
                <div className="d-none d-md-block">
                  <Marquee pauseOnHover pauseOnClick speed={50} gradient={false} autoFill={false}>
                    <ShowSimilarProduct />
                  </Marquee>
                </div>

                {/* Mobile: horizontal scroll-snap shelf */}
                <div className="d-block d-md-none">
                  <div className="shelf">
                    <ShowSimilarProduct />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
