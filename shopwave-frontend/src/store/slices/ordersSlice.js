import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const placeOrder = createAsyncThunk(
  "orders/place",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/orders", data);
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to place order");
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders/myorders");
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order not found");
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/orders?${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/orders/${id}/status`, { status });
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

export const createCheckoutSession = createAsyncThunk(
  "orders/checkout",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.post("/payment/create-checkout-session", { orderId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Payment failed");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    myOrders: [],
    allOrders: [],
    order: null,
    totalRevenue: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrder(state) { state.order = null; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(placeOrder.fulfilled, (s, a) => { s.loading = false; s.order = a.payload; })
      .addCase(placeOrder.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchMyOrders.pending, (s) => { s.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (s, a) => { s.loading = false; s.myOrders = a.payload; })
      .addCase(fetchMyOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchOrderById.pending, (s) => { s.loading = true; s.order = null; })
      .addCase(fetchOrderById.fulfilled, (s, a) => { s.loading = false; s.order = a.payload; })
      .addCase(fetchOrderById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchAllOrders.pending, (s) => { s.loading = true; })
      .addCase(fetchAllOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.allOrders = a.payload.orders;
        s.totalRevenue = a.payload.totalRevenue;
      })
      .addCase(fetchAllOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        const idx = s.allOrders.findIndex((o) => o._id === a.payload._id);
        if (idx !== -1) s.allOrders[idx] = a.payload;
        if (s.order?._id === a.payload._id) s.order = a.payload;
      });
  },
});

export const { clearOrder, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
