import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  roles: [],
};

export const RoleSlice = createSlice({
  name: "Roles",
  initialState,
  reducers: {
    getAllRoles: (state, action: PayloadAction<any>) => {
      state.roles = action.payload;
    },
  },
});

export default RoleSlice.reducer;
export const { getAllRoles } = RoleSlice.actions;
