import { memo, useEffect, useState } from "react";
/* 3rd Party Libraries */
import { Autocomplete, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
/* Location Table */
import DatabaseTable from "./databasetable";
/* Add Edit Location Modal */
import AddEditModal from "./addEditModal/AddEditModal";
/* Redux Toolkit */
import { useAppDispatch } from "../../store/store";
import { getAllConnectors } from "../../store/features/connectorTypeSlice";
import { getAllVendors } from "../../store/features/vendorsSlice";
import { getAllCpo } from "../../store/features/allCpoSlice";
/* Scss file */
import "./stationList.scss";

interface dataObj {
  id: string;
  label: string;
}
const StationList = memo(() => {
  /* -------------------------------------------------------------------------- */
  /*                            Current User Details                            */
  /* -------------------------------------------------------------------------- */
  let userDetail: any = localStorage.getItem("user-details");
  const currentUser: any = Parse.User.current();

  /* -------------------------------------------------------------------------- */
  /*                Prefetched Data for Add Edit Modals Dropdown                */
  /* -------------------------------------------------------------------------- */
  const dispatch = useAppDispatch();
  const getAllConnectorType = () => {
    const Locations = Parse.Object.extend("ConnectorTypes");
    const parseQuery = new Parse.Query(Locations);

    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let addressArray: any = [];
      result.forEach((item) => {
        addressArray.push({
          id: item.id,
          name: item.get("Name"),
          type: item.get("CurrentType"),
        });
      });
      dispatch(getAllConnectors(addressArray));
    });
  };

  const getAllVendorsType = () => {
    const Vendors = Parse.Object.extend("CP_Vendor");
    const parseQuery = new Parse.Query(Vendors);

    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let vendorsArray: any = [];
      result.forEach((item) => {
        let ab = {
          id: item.id,
          name: item.get("Name"),
        };
        vendorsArray.push(ab);
      });
      dispatch(getAllVendors(vendorsArray));
    });
  };

  const getAllCPO = () => {
    const Vendors = Parse.Object.extend("ChargePointOperators");
    const parseQuery = new Parse.Query(Vendors);

    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let vendorsArray: any = [];
      result.forEach((item) => {
        let ab = {
          id: item.id,
          name: item.get("Name"),
        };
        vendorsArray.push(ab);
      });
      dispatch(getAllCpo(vendorsArray));
    });
  };
  useEffect(() => {
    getAllConnectorType();
    getAllVendorsType();
    getAllCPO();
  }, []);
  /* -------------------------------------------------------------------------- */
  /*                                Filters State                               */
  /* -------------------------------------------------------------------------- */
  const [nameFilter, setNameFilter] = useState<dataObj>({ id: "", label: "" });
  const [locationTypeFilter, setLocationTypeFilter] = useState<any | null>(
    null
  );
  const [cityFilter, setCityFilter] = useState<any | null>(null);
  /* -------------------------------------------------------------------------- */
  /*               Data for Location type filter and Cities filter              */
  /* -------------------------------------------------------------------------- */
  const [allLocationType, setAllLocationType] = useState<any | null>([]);
  const [allCity, setAllCity] = useState<any | null>([]);
  const getAllLocations = () => {
    const Locations = Parse.Object.extend("Locations");

    const parseQuery = new Parse.Query(Locations);

    parseQuery.limit(50);

    parseQuery.find().then((result) => {
      let addressOptions: dataObj[] = [];
      let locationArray: any[] = [];
      let locationType: any[] = [];
      let cityType: any[] = [];
      result.forEach((item, index) => {
        if (
          !cityType.find(function (i) {
            return i === item.get("City");
          })
        ) {
          cityType.push(item.get("City"));
        }

        if (
          !locationType.find(function (i) {
            return i === item.get("LocationType");
          })
        ) {
          locationType.push(item.get("LocationType"));
        }

        let locPoint = item.get("GeoLocation");

        locationArray.push({
          id: item.id,
          stationName: `${item.get("Name")}`,
          type: `${item.get("LocationType")}`,
          city: `${item.get("City")}`,
          access: `${
            item.get("hasRestrictedAccess") ? "Restricted" : "Public"
          }`,
          operator: "Charge City",
          address: `${item.get("Address")}`,
          state: `${item.get("State")}`,
          lat: `${locPoint?.latitude}`,
          long: `${locPoint?.longitude}`,
          openingTime: `${moment(item.get("OpenTime"), "hh:mm A")}`,
          closingTime: `${moment(item.get("CloseTime"), "hh:mm A")}`,
          electricityTariff: `${item.get("ElectricityTariff")}`,
          isEnabled: `${item.get("isEnabled") ? "true" : "false"}`,
          modelType: `${item.get("RevenueModel")}`,
          currency: "₹",
          revenueAmount: `${item.get("RevenueAmount")}`,
          revenuePercent: `${item.get("RevenueSharingType")}`,
          rentalAmount: `${item.get("RentalAmount")}`,
          amenities: item.get("Amenities"),
          description: `${item.get("Description")}`,
          connectorType: item.get("ConnectorType")
            ? item.get("ConnectorType")
            : [],
          currentType: item.get("CurrentType") ? item.get("CurrentType") : [],
        });

        addressOptions.push({
          id: item.id,
          label: item.get("Name"),
        });
      });

      setAllCity(cityType);
      setAllLocationType(locationType);
    });
  };
  useEffect(() => {
    getAllLocations();
  }, []);
  /* -------------------------------------------------------------------------- */
  /*                             Location Table Data                            */
  /* -------------------------------------------------------------------------- */
  /**
   * Super Admin- All Data
   * Others- Data filtered for CPOs
   */

  const [tableData, setTableData] = useState<any>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [allLocations, setAllLocations] = useState<any | null>([]);
  const [showAddEditLocationModal, setShowAddEditLocationModal] =
    useState(false);

  const getFilteredLocation = (
    nameId: string,
    typeId: string,
    cityId: string
  ) => {
    setTableLoading(true);
    const chargersQuery = new Parse.Query("Chargers");
    /* All data for Super Admin */
    if (currentUser) {
      chargersQuery.equalTo("CPO", currentUser.get("CPO"));
    }
    /*<--------------------------------------------------------->*/
    chargersQuery.find().then((chargeResult) => {
      let locArray: any = [];
      chargeResult.map((chargePoint) => {
        if (!locArray.includes(chargePoint.get("Location").id)) {
          locArray.push(chargePoint.get("Location").id);
        }
      });

      const locationQuery = new Parse.Query("Locations");
      if (nameId) {
        locationQuery.equalTo("objectId", nameId);
      }
      if (typeId) {
        locationQuery.equalTo("LocationType", typeId);
      }
      if (cityId) {
        locationQuery.equalTo("City", cityId);
      }
      !JSON.parse(userDetail).isSuperAdmin &&
        locationQuery.containedIn("objectId", locArray);

      locationQuery.find().then((result) => {
        let locationArray: any = [];
        let addressOptions: any = [];
        result.forEach((item) => {
          let locPoint = item.get("GeoLocation");
          locationArray.push({
            id: item.id,
            stationName: `${item.get("Name")}`,
            type: `${item.get("LocationType")}`,
            city: `${item.get("City")}`,
            access: `${
              item.get("hasRestrictedAccess") ? "Restricted" : "Public"
            }`,
            operator: "Charge City",
            address: `${item.get("Address")}`,
            state: `${item.get("State")}`,
            lat: `${locPoint?.latitude}`,
            long: `${locPoint?.longitude}`,
            openingTime: `${moment(item.get("OpenTime"), "hh:mm A")}`,
            closingTime: `${moment(item.get("CloseTime"), "hh:mm A")}`,
            electricityTariff: `${item.get("ElectricityTariff")}`,
            isEnabled: `${item.get("isEnabled") ? "true" : "false"}`,
            modelType: `${item.get("RevenueModel")}`,
            currency: "₹",
            revenueAmount: `${item.get("RevenueAmount")}`,
            revenuePercent: `${item.get("RevenueSharingType")}`,
            rentalAmount: `${item.get("RentalAmount")}`,
            amenities: item.get("Amenities"),
            description: `${item.get("Description")}`,
            connectorType: item.get("ConnectorType")
              ? item.get("ConnectorType")
              : [],
            currentType: item.get("CurrentType") ? item.get("CurrentType") : [],
          });
          addressOptions.push({
            id: item.id,
            label: item.get("Name"),
          });
        });
        setTableData(locationArray);
        setTableLoading(false);
        setAllLocations(allLocations.length ? allLocations : addressOptions);
      });
    });
  };
  useEffect(() => {
    getFilteredLocation(nameFilter?.id, locationTypeFilter, cityFilter);
  }, [nameFilter?.id, locationTypeFilter, cityFilter]);

  /* -------------------------------------------------------------------------- */
  /*                     Active Clients Data (Only Ocpp Chargers)                 */
  /* -------------------------------------------------------------------------- */

  /**
   * status
   * energy.
   * cost
   * duration*/

  const [allOcppStatus, setAllOcppStatus] = useState([]);
  const OcppData = () => {
    fetch(`${process.env.REACT_APP_OCPP_BASE_URL}/active_clients`)
      .then((response: any) => response.json())
      .then((res: any) => {
        let ab: any = [];
        res.forEach((el: any) => {
          ab.push({
            id:
              el.charger_attributes[0].charge_box_serial_number ||
              el.charger_attributes[0].charge_point_serial_number,
            status: el.is_active
              ? el.connectors.filter((item: any) => item.connector_num === 1)[0]
                  .status
              : "Offline",
            active: el.is_active,
            ocppName: el.name,
          });
        });
        setAllOcppStatus(ab);
      });
  };

  useEffect(() => {
    OcppData();
  }, []);

  return (
    <div className="station-container">
      <div className="topRow">
        <div className="filters">
          <Autocomplete
            sx={{ width: 200 }}
            options={allLocations}
            autoHighlight
            size="small"
            onChange={(event: any, newValue: any) => {
              newValue
                ? setNameFilter(newValue)
                : setNameFilter({ id: "", label: "" });
            }}
            renderInput={(params) => <TextField {...params} label="Name" />}
          />

          <Autocomplete
            sx={{ width: 250 }}
            options={allLocationType}
            autoHighlight
            size="small"
            onChange={(event: any, newValue: any) => {
              newValue
                ? setLocationTypeFilter(newValue)
                : setLocationTypeFilter("");
            }}
            renderInput={(params) => <TextField {...params} label="Type" />}
          />

          <Autocomplete
            sx={{ width: 200 }}
            options={allCity}
            autoHighlight
            size="small"
            onChange={(event: any, newValue: any) => {
              newValue ? setCityFilter(newValue) : setCityFilter(null);
            }}
            renderInput={(params) => <TextField {...params} label="City" />}
          />

          <div className="addLocation">
            <Button
              variant="contained"
              sx={{ width: 160 }}
              onClick={() => setShowAddEditLocationModal(true)}
            >
              <AddIcon /> Add Location
            </Button>
          </div>
        </div>
      </div>

      <DatabaseTable
        dataRow={tableData}
        liveOcppData={allOcppStatus}
        refreshLocation={() =>
          getFilteredLocation(nameFilter.id, locationTypeFilter, cityFilter)
        }
        loading={tableLoading}
      />
      <AddEditModal
        show={showAddEditLocationModal}
        handleClose={() => setShowAddEditLocationModal(false)}
        type="add"
        data={{
          stationName: "",
          address: "",
          city: "",
          state: "",
          country: "",
          type: "",
          lat: "",
          long: "",
          openingTime: "",
          closingTime: "",
          daysOpen: "",
          chargingTariff: "",
          electricityTariff: "",
          currency: "₹",
          tax: "",
          access: "",
          authType: "",
          paymentReq: "",
          modelType: "",
          isEnabled: "",
          revenueAmount: "",
          revenuePercent: "",
          rentalAmount: "",
          description: "",
          amenities: [],
        }}
        refreshLocation={() =>
          getFilteredLocation(nameFilter.id, locationTypeFilter, cityFilter)
        }
        allChargePointData={[]}
      />
    </div>
  );
});

export default StationList;
