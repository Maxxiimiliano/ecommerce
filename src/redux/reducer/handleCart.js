// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cart");
  console.log("cart: " + JSON.stringify(storedCart))
  return storedCart ? JSON.parse(storedCart) : [];
};

const save = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
};

const sameLine = (a, b) =>
  a.id === b.id && (a.selectedVariant ?? null) === (b.selectedVariant ?? null);

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;

  switch (action.type) {
    case "ADDITEM": {
      const incoming = {
        ...product,
        selectedVariant: product.selectedVariant ?? null,
      };

      const exist = state.find((x) => sameLine(x, incoming));
      if (exist) {
        updatedCart = state.map((x) =>
          sameLine(x, incoming) ? { ...x, qty: (x.qty || 1) + 1 } : x
        );
      } else {
        updatedCart = [...state, { ...incoming, qty: 1 }];
      }
      return save(updatedCart);
    }

    case "DELITEM": {
      // Decrement only the matching line (id + selectedVariant)
      const target = state.find((x) => sameLine(x, product));
      if (!target) return state;

      if ((target.qty || 1) === 1) {
        updatedCart = state.filter((x) => !sameLine(x, product));
      } else {
        updatedCart = state.map((x) =>
          sameLine(x, product) ? { ...x, qty: x.qty - 1 } : x
        );
      }
      return save(updatedCart);
    }

    default:
      return state;
  }
};

export default handleCart;
