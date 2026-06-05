import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchListings = createAsyncThunk(
  "listings/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/listings?${query}`);
      return res.data.listings;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch listings");
    }
  }
);

export const fetchMyListings = createAsyncThunk(
  "listings/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/listings/my");
      return res.data.listings;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch listings");
    }
  }
);

export const createListing = createAsyncThunk(
  "listings/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/listings", data);
      return res.data.listing;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create listing");
    }
  }
);

export const fetchAllListingsAdmin = createAsyncThunk(
  "listings/fetchAdmin",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/listings/admin?${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const updateListingStatus = createAsyncThunk(
  "listings/updateStatus",
  async ({ id, status, adminNote }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/listings/${id}/status`, { status, adminNote });
      return res.data.listing;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const deleteListing = createAsyncThunk(
  "listings/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/listings/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

const listingsSlice = createSlice({
  name: "listings",
  initialState: {
    items: [],
    myListings: [],
    adminListings: [],
    totalCommission: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (s) => { s.loading = true; })
      .addCase(fetchListings.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchListings.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchMyListings.pending, (s) => { s.loading = true; })
      .addCase(fetchMyListings.fulfilled, (s, a) => { s.loading = false; s.myListings = a.payload; })
      .addCase(fetchMyListings.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createListing.pending, (s) => { s.loading = true; })
      .addCase(createListing.fulfilled, (s, a) => { s.loading = false; s.myListings.unshift(a.payload); })
      .addCase(createListing.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchAllListingsAdmin.pending, (s) => { s.loading = true; })
      .addCase(fetchAllListingsAdmin.fulfilled, (s, a) => {
        s.loading = false;
        s.adminListings = a.payload.listings;
        s.totalCommission = a.payload.totalCommission;
      })
      .addCase(fetchAllListingsAdmin.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateListingStatus.fulfilled, (s, a) => {
        const idx = s.adminListings.findIndex((l) => l._id === a.payload._id);
        if (idx !== -1) s.adminListings[idx] = a.payload;
      })

      .addCase(deleteListing.fulfilled, (s, a) => {
        s.myListings = s.myListings.filter((l) => l._id !== a.payload);
        s.adminListings = s.adminListings.filter((l) => l._id !== a.payload);
      });
  },
});

export const { clearError } = listingsSlice.actions;
export default listingsSlice.reducer;
