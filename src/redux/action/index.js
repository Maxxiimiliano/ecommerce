// For Add Item to Cart
export const addCart = (product, selectedVariant = null) =>{
    return {
        type:"ADDITEM",
        payload: {
            ...product,
            selectedVariant: selectedVariant ?? product.selectedVariant ?? null,
        }
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}