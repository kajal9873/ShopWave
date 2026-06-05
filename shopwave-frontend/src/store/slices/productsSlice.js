import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/products?${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Product not found");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/products/categories");
      return res.data.categories;
    } catch (err) {
      return rejectWithValue("Failed to load categories");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/products", data);
      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/products/${id}`, data);
      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete product");
    }
  }
);

export const addReview = createAsyncThunk(
  "products/addReview",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/products/${id}/reviews`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add review");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    product: null,
    categories: [],
    page: 1,
    pages: 1,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearProduct(state) { state.product = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.products;
        s.page = a.payload.page;
        s.pages = a.payload.pages;
        s.total = a.payload.total;
      })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchProductById.pending, (s) => { s.loading = true; s.product = null; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.product = a.payload; })
      .addCase(fetchProductById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload; })

      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p._id !== a.payload);
      })

      .addCase(createProduct.fulfilled, (s, a) => { s.items.unshift(a.payload); })

      .addCase(updateProduct.fulfilled, (s, a) => {
        const idx = s.items.findIndex((p) => p._id === a.payload._id);
        if (idx !== -1) s.items[idx] = a.payload;
        if (s.product?._id === a.payload._id) s.product = a.payload;
      });
  },
});

export const { clearProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;
