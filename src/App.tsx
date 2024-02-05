import Home from "./pages/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import List from "./pages/list";
import Single from "./pages/single";
import { initializeParse } from "@parse/react";
import StationMap from "./pages/stationMap";
import Report from "./pages/report";
import Invoice from "./pages/invoice";
import StationList from "./pages/station";
import ChargeSession from "./pages/chargeSession";
import Transaction from "./pages/transaction";
import Revenue from "./pages/revenue";
import Ev from "./pages/electricVehicles";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Vendors from "./pages/vendors";

import Energy from "./pages/energyConsumption";
import Bookings from "./pages/bookings";
import ProtectedRoute from "./utils/protectedRoute";
import Promocode from "./pages/promocode";
import Pushnotification from "./pages/pushNotification";
import Cpo from "./pages/cpo";
import NewDash from "./pages/newDash";
import AssignRoles from "./pages/assignRoles";
initializeParse(
  "https://parseapi.back4app.com/",
  `${process.env.REACT_APP_APPLICATION_ID}`,
  `${process.env.REACT_APP_JAVASCRIPT_KEY}`
);
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login />} />

          <Route path="/">
            <Route path="home" element={<ProtectedRoute Component={Home} />} />
            <Route path="users" element={<ProtectedRoute Component={List} />} />
            <Route
              path="charge-session"
              element={<ProtectedRoute Component={ChargeSession} />}
            />
            <Route
              path="station-list"
              element={<ProtectedRoute Component={StationList} />}
            />

            <Route
              path="station-map"
              element={<ProtectedRoute Component={StationMap} />}
            />
            <Route
              path="transaction"
              element={<ProtectedRoute Component={Transaction} />}
            />
            <Route
              path="report"
              element={<ProtectedRoute Component={Report} />}
            />
            <Route
              path="invoice"
              element={<ProtectedRoute Component={Invoice} />}
            />

            <Route path="Ev's" element={<ProtectedRoute Component={Ev} />} />
            <Route
              path="Vendors"
              element={<ProtectedRoute Component={Vendors} />}
            />
            <Route
              path="revenue"
              element={<ProtectedRoute Component={Revenue} />}
            />
            <Route
              path="energy-consumption"
              element={<ProtectedRoute Component={Energy} />}
            />
            <Route
              path="bookings"
              element={<ProtectedRoute Component={Bookings} />}
            />
            <Route
              path="promocode"
              element={<ProtectedRoute Component={Promocode} />}
            />
            <Route
              path="push-notification"
              element={<ProtectedRoute Component={Pushnotification} />}
            />
            <Route
              path="assign-roles"
              element={<ProtectedRoute Component={AssignRoles} />}
            />
            <Route
              path="new-dash"
              element={<ProtectedRoute Component={NewDash} />}
            />
            <Route path="cpo" element={<ProtectedRoute Component={Cpo} />} />

            <Route path="users" element={<ProtectedRoute Component={List} />} />
            <Route path="products">
              <Route index element={<List />} />
              <Route path=":productId" element={<Single />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
