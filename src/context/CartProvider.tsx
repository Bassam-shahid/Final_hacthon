"use client";

import { useState, useEffect } from "react";
import { CartContext, CartItem, CartContextType } from "./CartContext";
import { WishlistContext, WishlistItem, WishlistContextType } from "./CartContext";
import { toast } from "react-toastify";

export const CombinedProvider = ({ children }: { children: React.ReactNode }) => {
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Wishlist State
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlistItems");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    }
    return [];
  });

  // Persist Cart and Wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Cart Functions
  const addToCart = (item: CartItem) => {
    const adjustedQuantity = item.quantity > 0 ? item.quantity : 1;
    let toastMessage = "";

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + adjustedQuantity;

        if (newQuantity > existingItem.stock) {
          toastMessage = `Cannot add more than ${existingItem.stock} items of this product.`;
          return prevItems;
        }

        if (newQuantity > 5) {
          toastMessage = "Cannot add more than 5 items of the same product.";
          return prevItems;
        }

        toastMessage = "Product Quantity Updated!";
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        );
      }

      if (adjustedQuantity > item.stock) {
        toastMessage = `Cannot add more than ${item.stock} items of this product.`;
        return prevItems;
      }

      if (adjustedQuantity > 5) {
        toastMessage = "Cannot add more than 5 items of the same product.";
        return prevItems;
      }

      toastMessage = "Product Added to Cart!";
      return [...prevItems, { ...item, quantity: adjustedQuantity }];
    });

    if (toastMessage) {
      setTimeout(() => {
        toast.success(toastMessage, { autoClose: 500 });
      }, 0);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setTimeout(() => {
      toast.info("Product Removed from Cart", { autoClose: 500 });
    }, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    setTimeout(() => {
      toast.info("Cart Cleared!", { autoClose: 500 });
    }, 0);
  };

  const updateQty = (id: string, quantity: number) => {
    const adjustedQuantity = quantity > 0 ? quantity : 1;
    let toastMessage = "";

    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.id === id);

      if (item && adjustedQuantity > item.stock) {
        toastMessage = `Cannot exceed ${item.stock} items of this product.`;
        return prevItems;
      }

      if (adjustedQuantity > 5) {
        toastMessage = "Cannot have more than 5 items of the same product.";
        return prevItems;
      }

      toastMessage = "Product Quantity Updated!";
      return prevItems.map((item) =>
        item.id === id ? { ...item, quantity: adjustedQuantity } : item
      );
    });

    if (toastMessage) {
      setTimeout(() => {
        toast.info(toastMessage, { autoClose: 500 });
      }, 0);
    }
  };

  // Wishlist Functions
  const addToWishlist = (item: WishlistItem) => {
    let toastMessage = "";

    setWishlistItems((prevItems) => {
      if (prevItems.find((i) => i.id === item.id)) {
        toastMessage = "Product is already in the Wishlist!";
        return prevItems;
      }

      toastMessage = "Product Added to Wishlist!";
      return [...prevItems, item];
    });

    if (toastMessage) {
      setTimeout(() => {
        toast.success(toastMessage, { autoClose: 500 });
      }, 0);
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setTimeout(() => {
      toast.info("Product Removed from Wishlist", { autoClose: 500 });
    }, 0);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    setTimeout(() => {
      toast.info("Wishlist Cleared!", { autoClose: 500 });
    }, 0);
  };

  // Combined Context Values
  const cartContextValue: CartContextType = {
    items: cartItems,
    addToCart,
    clearCart,
    removeFromCart,
    updateQty,
  };

  const wishlistContextValue: WishlistContextType = {
    items: wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      <WishlistContext.Provider value={wishlistContextValue}>
        {children}
      </WishlistContext.Provider>
    </CartContext.Provider>
  );
};
