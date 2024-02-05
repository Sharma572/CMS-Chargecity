import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  cpo: [],
};

export const allCpoSlice = createSlice({
  name: "CPO",
  initialState,
  reducers: {
    getAllCpo: (state, action: PayloadAction<any>) => {
      state.cpo = action.payload;
    },
  },
});

export default allCpoSlice.reducer;
export const { getAllCpo } = allCpoSlice.actions;
