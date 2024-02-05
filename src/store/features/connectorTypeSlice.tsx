import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  connectors: [],
};

export const ConnectorTypeSlice = createSlice({
  name: "Connectors",
  initialState,
  reducers: {
    getAllConnectors: (state, action: PayloadAction<any>) => {
      state.connectors = action.payload;
    },
  },
});

export default ConnectorTypeSlice.reducer;
export const { getAllConnectors } = ConnectorTypeSlice.actions;
