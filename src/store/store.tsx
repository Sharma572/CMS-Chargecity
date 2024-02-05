import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ConnectorTypeSlice } from "./features/connectorTypeSlice";
import { VendorSlice } from "./features/vendorsSlice";
import { RoleSlice } from "./features/roleSlice";
import allCpoSlice from "./features/allCpoSlice";
export const store = configureStore({
  reducer: {
    connectors: ConnectorTypeSlice.reducer,
    vendors: VendorSlice.reducer,
    assginedRoles: RoleSlice.reducer,
    cpo: allCpoSlice,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
