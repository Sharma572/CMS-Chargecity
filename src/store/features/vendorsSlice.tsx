import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  vendors: [],
};

export const VendorSlice = createSlice({
  name: "Vendors",
  initialState,
  reducers: {
    getAllVendors: (state, action: PayloadAction<any>) => {
      state.vendors = action.payload;
    },
  },
});

export default VendorSlice.reducer;
export const { getAllVendors } = VendorSlice.actions;
