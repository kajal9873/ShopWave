import { createSlice } from "@reduxjs/toolkit";

const stored = localStorage.getItem("cart");

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: stored ? JSON.parse(stored) : [],
  },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find((i) => i.product === item.product);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + item.quantity, item.stock);
      } else {
        state.items.push(item);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.product !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.product !== productId);
        }
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
