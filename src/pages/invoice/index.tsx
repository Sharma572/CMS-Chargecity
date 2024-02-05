import "./invoice.scss";
import { CSVLink, CSVDownload } from "react-csv";
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  TextField,
  Button,
  FormLabel,
  Input,
  InputLabel,
  Switch,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { Stack } from "@mui/system";
import moment from "moment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Label } from "recharts";
import InvoiceModal from "./inoviceModal";
interface dataObj {
  id: string;
  label: string;
}

const Report = memo(() => {
  const [selectPeriod, setSelectPeriod] = useState("");

  const [allLocations, setAllLocations] = useState<any | null>([]);
  const [allLocationType, setAllLocationType] = useState<any | null>([]);
  const [allCity, setAllCity] = useState<any | null>([]);
  const [openInvoice, setOpenInvoice] = useState(false);
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
          lat: `${locPoint.latitude}`,
          long: `${locPoint.longitude}`,
          openingTime: `${moment(item.get("OpenTime"), "hh:mm A")}`,
          closingTime: `${moment(item.get("CloseTime"), "hh:mm A")}`,
          electricityTariff: `${item.get("ElectricityTariff")}`,
          isEnabled: `${item.get("isEnabled") ? "true" : "false"}`,
          modelType: `${item.get("RevenueModel")}`,
          currency: "₹",
          revenueAmount: `${item.get("RevenueAmount")}`,
          revenuePercent: `${item.get("RevenueSharingType")}`,
        });

        addressOptions.push({
          id: item.id,
          label: item.get("Name"),
        });
      });

      setAllCity(allCity.length ? allCity : cityType);
      setAllLocationType(
        allLocationType.length ? allLocationType : locationType
      );
    });
  };
  let userDetail: any = localStorage.getItem("user-details");
  const getFilteredLocations = () => {
    const chargersQuery = new Parse.Query("Chargers");
    if (currentUser) {
      chargersQuery.equalTo("CPO", currentUser.get("CPO"));
    }

    chargersQuery.find().then((chargeResult) => {
      let locArray: any = [];
      chargeResult.map((chargePoint) => {
        if (!locArray.includes(chargePoint.get("Location").id)) {
          locArray.push(chargePoint.get("Location").id);
        }
      });

      const locationQuery = new Parse.Query("Locations");
      !JSON.parse(userDetail).isSuperAdmin &&
        locationQuery.containedIn("objectId", locArray);
      locationQuery.find().then((result) => {
        let addressArray: any[] = [];

        result.forEach((item) => {
          let locPoint = item.get("GeoLocation");
          addressArray.push({
            id: item.id,
            label: item.get("Name"),
          });
          setAllLocations(addressArray);
        });
      });
    });
  };
  const [allConnectorType, setAllConnectorType] = useState<any>([]);

  useEffect(() => {
    getAllLocations();
    getFilteredLocations();
  }, []);
  const [reportData, setReportData] = useState<any>([]);
  const [allUsers, setAllUsers] = useState<any>([]);
  const loadSessions = (
    userId: string,
    locationId: any,
    locationType: any,
    connectorType: any,
    currentType: any,
    status: string,
    date: string,
    startDate: string | Date,
    endDate: string | Date,
    customDate: string | Date
  ) => {
    const parseQuery = new Parse.Query("ChargeSession");
    parseQuery.include("ChargePoint");
    if (userId) {
      let User = Parse.User;
      let userObj = User.createWithoutData(userId);
      parseQuery.equalTo("User", userObj);
    }
    if (currentUser) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", currentUser.get("CPO"));
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    if (locationId.length) {
      var innerQuery = new Parse.Query("Locations");
      innerQuery.containedIn(
        "objectId",
        locationId.map((item: any) => item.id)
      );
      parseQuery.matchesQuery("Location", innerQuery);
    }
    if (locationType.length) {
      var innerQuery = new Parse.Query("Locations");
      innerQuery.containedIn(
        "LocationType",
        locationType.map((item: any) => item)
      );
      parseQuery.matchesQuery("Location", innerQuery);
    }
    if (connectorType.label) {
      var innerQuery = new Parse.Query("Chargers");
      innerQuery.equalTo("Connector", connectorType.label);
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }

    if (currentType) {
      var innerQuery = new Parse.Query("Chargers");

      var moreInnerQuery = new Parse.Query("ConnectorTypes");
      moreInnerQuery.equalTo("CurrentType", currentType);

      innerQuery.matchesQuery("ConnectorType", moreInnerQuery);
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    if (status) {
      status === "Completed"
        ? parseQuery.equalTo("Live", false)
        : parseQuery.equalTo("Live", true);
    }

    if (date) {
      if (date === "Today") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("day").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().add(1, "day").startOf("day").toString())
        );
      } else if (date === "Yesterday") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().subtract(1, "day").startOf("day").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("day").toString())
        );
      } else if (date === "This Week") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().subtract(7, "day").startOf("day").toString())
        );
        parseQuery.lessThanOrEqualTo("createdAt", new Date());
      } else if (date === "Last Month") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().subtract(1, "month").startOf("month").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().subtract(1, "month").endOf("month").toString())
        );
      }
    }

    if (startDate) {
      parseQuery.greaterThanOrEqualTo("createdAt", new Date(startDate));
    }
    if (endDate) {
      parseQuery.lessThanOrEqualTo("createdAt", new Date(endDate));
    }

    if (customDate) {
      parseQuery.greaterThanOrEqualTo(
        "createdAt",
        new Date(moment(customDate).startOf("day").toString())
      );
      parseQuery.lessThanOrEqualTo(
        "createdAt",
        new Date(moment(customDate).add(1, "day").startOf("day").toString())
      );
    }

    parseQuery.include("ChargePoint");
    parseQuery.include("Location");
    parseQuery.include("Vehicle");
    parseQuery.include("User");
    parseQuery.descending("createdAt");
    parseQuery.limit(1000);
    parseQuery.find().then((result: any[]) => {
      let newRow: {
        id: number;
        status: string;
        startTime: string;
        endTime: string;
        chargeBy: string;
        chargeFor: string;
        customer: string;
        location: string;
        carCharged: string;
        aid: string;
        date: string;
        cost: string;
        energy: string;
        duration: string;
        obj: any;
        serialNum: string;
        power: string;
        connector: string;
      }[] = [];

      let usersArray: any[] = [];

      result.forEach((item, index) => {
        let car = "";
        if (`${item.get("Vehicle")}` !== "undefined") {
          car = `${item.get("Vehicle").get("Name")}`;
        }

        const userObj = {
          id: `${item.get("User").id}`,
          label: `${item.get("User").get("FullName")}`,
        };

        if (
          !usersArray.find(function (i) {
            return i.id === userObj.id;
          })
        ) {
          usersArray.push(userObj);
        }

        newRow.push({
          id: index + 1,
          status: `${item.get("User").get("FullName")}`,
          customer: `${item.get("User").get("FullName")}`,
          location: `${item.get("Location").get("Name")}`,
          serialNum: `${item.get("ChargePoint").get("Serial")}`,
          power: `${item.get("ChargePoint").get("Power")}`,
          connector: `${item.get("ChargePoint").get("Connector")}`,
          startTime: `${
            moment(item.get("createdAt")).format("lll")
              ? moment(item.get("createdAt")).format("lll")
              : "-"
          }`,
          endTime: `${
            moment(item.get("updatedAt")).format("lll")
              ? moment(item.get("updatedAt")).format("lll")
              : "-"
          }`,
          carCharged: car,
          chargeBy: `${item.get("ChargeBy")}`,
          chargeFor: `${item.get("ChargeFor")}`,
          duration: `${
            moment
              .duration(
                moment(new Date(item.get("updatedAt"))).diff(
                  moment(new Date(item.get("createdAt")))
                )
              )
              .hours() +
            "hr" +
            " " +
            moment
              .duration(
                moment(new Date(item.get("updatedAt"))).diff(
                  moment(new Date(item.get("createdAt")))
                )
              )
              .minutes() +
            "min"
          }  `,
          aid: `${item.get("AID")}`,
          date: `${item.get("createdAt")}`,
          cost: `₹ ${parseFloat(item.get("TotalCost")).toFixed(2)}`,
          energy: `${parseFloat(item.get("TotalEnergyConsumed")).toFixed(
            2
          )} kWh`,
          obj: item,
        });
      });
      setAllUsers(!allUsers.length ? usersArray : allUsers);
      setReportData(newRow);
    });
  };

  const [userFilter, setUserFilter] = useState({ id: "", label: "" });
  const [locationFilter, setLocationFilter] = useState<any>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentTypeFilter, setCurrentTypeFilter] = useState("");
  const [chargerTypeFilter, setChargerTypeFilter] = useState({
    label: "",
    type: "",
  });

  const [startDateFilter, setStartDateFilter] = useState<any>("");
  const [endDateFilter, setEndDateFilter] = useState<any>("");
  const [customDateFilter, setCustomDateFilter] = useState<any>("");
  const [locationTypeFilter, setLocationTypeFilter] = useState<any>([]);

  useEffect(() => {
    loadSessions(
      userFilter.id,
      locationFilter,
      locationTypeFilter,
      chargerTypeFilter,
      currentTypeFilter,
      statusFilter,
      selectPeriod,
      startDateFilter,

      endDateFilter,
      customDateFilter
    );
  }, [
    userFilter.id,
    locationFilter,
    locationTypeFilter,
    chargerTypeFilter,
    currentTypeFilter,
    statusFilter,
    selectPeriod,
    startDateFilter,
    endDateFilter,
    customDateFilter,
  ]);

  const [connectorTypeLoading, setConnectorTypeLoading] = useState(false);
  const getAllConnectorType = (currentType: string) => {
    const Locations = Parse.Object.extend("ConnectorTypes");

    const parseQuery = new Parse.Query(Locations);
    if (currentType) {
      parseQuery.equalTo("CurrentType", currentType);
    }
    setConnectorTypeLoading(true);
    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let connectorArray: any = [];
      result.forEach((item) => {
        connectorArray.push({
          label: item.get("Name"),
          type: item.get("CurrentType"),
        });
      });
      setConnectorTypeLoading(false);
      setAllConnectorType(connectorArray);
    });
  };
  useEffect(() => {
    getAllConnectorType(currentTypeFilter);
  }, [currentTypeFilter]);
  const ReportFilter = (props: { data: any }) => {
    switch (props.data) {
      case "Location":
        return (
          <Autocomplete
            multiple
            sx={{ width: 350, backgroundColor: "white" }}
            id="tags-outlined"
            value={locationFilter}
            onChange={(event, newValue) => {
              setLocationFilter(newValue);
            }}
            options={allLocations}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Locations"
                placeholder="Favorites"
              />
            )}
          />
        );
      case "Location Type":
        return (
          <Autocomplete
            multiple
            sx={{ width: 350, backgroundColor: "white" }}
            id="tags-outlined"
            value={locationTypeFilter}
            onChange={(event, newValue) => {
              setLocationTypeFilter(newValue);
            }}
            options={allLocationType}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location Type"
                placeholder="Favorites"
              />
            )}
          />
        );
      case "Connector Type":
        return (
          <Autocomplete
            sx={{ width: 350, backgroundColor: "white" }}
            options={allConnectorType}
            value={chargerTypeFilter.label}
            autoHighlight
            size="small"
            disabled={connectorTypeLoading}
            onChange={(event: any, newValue: any) => {
              newValue
                ? setChargerTypeFilter(newValue)
                : setChargerTypeFilter({
                    label: "",
                    type: "",
                  });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Connector Type" />
            )}
          />
        );

      case "Current Type":
        if (chargerTypeFilter.label) {
          return (
            <FormControl variant="standard">
              <Stack direction="row" spacing={8}>
                {" "}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={chargerTypeFilter.type === "AC"}
                      disabled
                    />
                  }
                  label="AC"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={chargerTypeFilter.type === "DC"}
                      disabled
                    />
                  }
                  label="DC"
                />
              </Stack>
            </FormControl>
          );
        } else {
          return (
            <FormControl variant="standard">
              <Stack direction="row" spacing={8}>
                {" "}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentTypeFilter === "AC"}
                      onClick={() => {
                        currentTypeFilter === "AC"
                          ? setCurrentTypeFilter("")
                          : setCurrentTypeFilter("AC");
                        setChargerTypeFilter({
                          label: "",
                          type: "",
                        });
                      }}
                    />
                  }
                  label="AC"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentTypeFilter === "DC"}
                      onClick={() => {
                        currentTypeFilter === "DC"
                          ? setCurrentTypeFilter("")
                          : setCurrentTypeFilter("DC");
                        setChargerTypeFilter({
                          label: "",
                          type: "",
                        });
                      }}
                    />
                  }
                  label="DC"
                />
              </Stack>
            </FormControl>
          );
        }

      case "User":
        return (
          <FormControl>
            <Select
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ width: 350 }}
              input={<OutlinedInput />}
              value={userFilter.id}
            >
              <MenuItem disabled value="">
                User
              </MenuItem>
              {allUsers.map((item: any) => (
                <MenuItem value={item.id} onClick={() => setUserFilter(item)}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case "CPO":
        return (
          <FormControl>
            <Select
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ width: 350 }}
              input={<OutlinedInput />}
              value=""
            >
              <MenuItem disabled value="">
                CPO
              </MenuItem>

              <MenuItem>Charge City</MenuItem>
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };
  const [invoiceUserFilter, setInvoiceUserFilter] = useState<any>([]);
  const [invoiceLocationFilter, setInvoiceLocationFilter] = useState<any>([]);

  const InvoiceFilter = (props: { data: any }) => {
    switch (props.data) {
      case "Location":
        return (
          <Autocomplete
            multiple
            sx={{ width: 350, backgroundColor: "white" }}
            id="tags-outlined"
            value={invoiceLocationFilter}
            onChange={(event, newValue: any) => {
              setInvoiceLocationFilter(newValue);
            }}
            options={allLocations}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Locations"
                placeholder="Favorites"
              />
            )}
          />
        );

      case "User":
        return (
          <FormControl>
            <InputLabel id="demo-multiple-checkbox-label">Users</InputLabel>

            <Select
              sx={{ width: 350, backgroundColor: "white" }}
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              variant="outlined"
              value={invoiceUserFilter}
              onChange={(event: any) => {
                const {
                  target: { value },
                } = event;
                setInvoiceUserFilter(value);
              }}
              input={<OutlinedInput label="Users" />}
              renderValue={(selected) => {
                return selected.map((item: any) => item.label).join(", ");
              }}
              MenuProps={{
                PaperProps: { sx: { maxHeight: 400, maxWidth: 300 } },
              }}
            >
              <ListSubheader>Users</ListSubheader>
              {allUsers.map((item: any) => (
                <MenuItem key={item.id} value={item}>
                  <Checkbox
                    checked={
                      invoiceUserFilter
                        .map((item: any) => item.id)
                        .indexOf(item.id) > -1
                    }
                  />
                  <ListItemText primary={item.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      default:
        return null;
    }
  };

  const [invoiceTabelData, setInvoiceTabelData] = useState<any>([]);

  const [filteredData, setFilteredData] = useState<any>([]);
  const currentUser: any = Parse.User.current();
  const loadInvoiceSessions = (
    userId: any,
    locationId: any,
    startDate: any,
    endDate: any
  ) => {
    const parseQuery = new Parse.Query("ChargeSession");
    parseQuery.include("ChargePoint");
    if (userId.length) {
      var innerQuery = new Parse.Query("User");
      innerQuery.containedIn(
        "objectId",
        userId.map((item: any) => item.id)
      );
      parseQuery.matchesQuery("User", innerQuery);
    }
    if (currentUser) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", currentUser.get("CPO"));
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }

    if (locationId.length) {
      var innerQuery = new Parse.Query("Locations");
      innerQuery.containedIn(
        "objectId",
        locationId.map((item: any) => item.id)
      );
      parseQuery.matchesQuery("Location", innerQuery);
    }
    if (startDate) {
      parseQuery.greaterThanOrEqualTo("createdAt", new Date(startDate));
    }
    if (endDate) {
      parseQuery.lessThanOrEqualTo("createdAt", new Date(endDate));
    }
    parseQuery.descending("createdAt");
    parseQuery.limit(1000);
    parseQuery.find().then((result: any[]) => {
      let newRow: any[] = [];

      let usersArray: any[] = [];
      let rawAmt: number = 0;
      let totalAmt: number = 0;
      let ab = locationId.map((item: any) => {
        return {
          name: item.label,
          rawAmt: 0,
          energy: 0,
          rate: 0,
        };
      });

      let bc = userId.map((item: any) => {
        return {
          name: item.label,
          rawAmt: 0,
          energy: 0,
          rate: 0,
        };
      });
      result.forEach((item, index) => {
        ab.forEach((element: any) => {
          if (
            String(element.name) === String(item.get("Location").get("Name"))
          ) {
            element.rawAmt = item.get("TotalCost")
              ? (parseFloat(item.get("TotalCost")) * 100) / 118 + element.rawAmt
              : 0 + element.rawAmt;
            element.energy = item.get("TotalEnergyConsumed")
              ? item.get("TotalEnergyConsumed") + element.energy
              : 0 + element.energy;
            element.rate =
              element.rate === 0
                ? (item.get("ChargePoint").get("Cost") * 100) / 118
                : element.rate;
          } else {
            return;
          }
        });
        bc.forEach((element: any) => {
          if (
            String(element.name) === String(item.get("User").get("FullName"))
          ) {
            element.rawAmt = item.get("TotalCost")
              ? (parseFloat(item.get("TotalCost")) * 100) / 118 + element.rawAmt
              : 0 + element.rawAmt;
            element.energy = item.get("TotalEnergyConsumed")
              ? item.get("TotalEnergyConsumed") + element.energy
              : 0 + element.energy;
            element.rate =
              element.rate === 0
                ? (item.get("ChargePoint").get("Cost") * 100) / 118
                : element.rate;
          } else {
            return;
          }
        });
        rawAmt = item.get("TotalCost")
          ? (parseFloat(item.get("TotalCost")) * 100) / 118 + rawAmt
          : 0 + rawAmt;
        totalAmt = item.get("TotalCost")
          ? item.get("TotalCost") + totalAmt
          : 0 + totalAmt;
        newRow.push({
          id: index + 1,

          // customer: invoiceUserFilter.id
          //   ? item.get("User").get("FullName")
          //   : item.get("Location").get("Name"),
          location: `${item.get("Location").get("Name")}`,

          rate: (
            (parseFloat(item.get("ChargePoint").get("Cost")) * 100) /
            118
          ).toFixed(2),

          startTime: `${
            moment(item.get("createdAt")).format("lll")
              ? moment(item.get("createdAt")).format("lll")
              : "-"
          }`,
          endTime: `${
            moment(item.get("updatedAt")).format("lll")
              ? moment(item.get("updatedAt")).format("lll")
              : "-"
          }`,

          date: `${item.get("createdAt")}`,
          cost: ((parseFloat(item.get("TotalCost")) * 100) / 118).toFixed(2),
          energy: `${parseFloat(item.get("TotalEnergyConsumed")).toFixed(
            2
          )} kWh`,
          obj: item,
        });
      });
      setValues({ ...values, rawAmount: rawAmt, totalAmount: totalAmt });
      setInvoiceTabelData(bc.length ? bc : ab);
    });
  };

  const [startDateInvoiceFilter, setStartDateInvoiceFilter] = useState<any>("");
  const [endDateInvoiceFilter, setEndDateInvoiceFilter] = useState<any>("");
  useEffect(() => {
    loadInvoiceSessions(
      invoiceUserFilter,
      invoiceLocationFilter,
      startDateInvoiceFilter,
      endDateInvoiceFilter
    );
  }, [
    invoiceUserFilter,
    invoiceLocationFilter,
    startDateInvoiceFilter,
    endDateInvoiceFilter,
  ]);

  const playersData = [
    { key: "id", label: "ID" },
    { key: "customer", label: "Name" },
    { key: "location", label: "Location" },
    {
      key: "isLive",

      label: "Status",
      renderCell: (params: {
        row: { obj: { get: (arg0: string) => any } };
      }) => {
        let currentStatus = params.row.obj.get("Live");
        return currentStatus === false ? (
          <div className="labelCompleted">
            <span className="labelText">Completed</span>
          </div>
        ) : (
          <div className="label">
            <span className="labelText">Charging</span>
          </div>
        );
      },
    },
    { key: "carCharged", label: "Vehicle" },

    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },

    { key: "cost", label: "Cost" },

    { key: "energy", label: "Energy" },
    { key: "duration", label: "Duration" },
    { key: "serialNum", label: "Serial Number" },
    { key: "power", label: "Power" },
    { key: "connector", label: "Connector" },
  ];
  const csvLink = {
    filename: "Charge-City.csv",
    headers: playersData,
    data: reportData,
  };
  const initialValues = {
    name: "",
    email: "",
    address: "",
    gstNum: "",
    billto: "",
    invoiceNum: "",
    startDate: "",
    endDate: "",
    rawAmount: 0,
    totalAmount: 0,
  };

  const [values, setValues] = useState(initialValues);

  return (
    <div className="invoice-container">
      <div className="invoice-box">
        <div className="top">
          <h1>Invoice</h1>
        </div>
        <span className="invoice-row">
          <InvoiceFilter data={"Location"} /> <InvoiceFilter data={"User"} />
        </span>
        <span className="invoice-row">
          {" "}
          <Stack
            direction="column"
            spacing={1}
            sx={{ width: 350, backgroundColor: "white" }}
          >
            <h4>From</h4>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Start Date"
                value={startDateInvoiceFilter}
                onChange={(item) => {
                  setStartDateInvoiceFilter(item || "");
                  setValues({
                    ...values,
                    startDate: item || "",
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} error={false} />
                )}
                inputFormat="DD-MM-YYYY"
              />
            </LocalizationProvider>
          </Stack>
          <Stack
            direction="column"
            spacing={1}
            sx={{ width: 350, backgroundColor: "white" }}
          >
            <h4>To</h4>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="End Date"
                value={endDateInvoiceFilter}
                onChange={(item) => {
                  setEndDateInvoiceFilter(item || "");
                  setValues({
                    ...values,
                    endDate: item || "",
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} error={false} />
                )}
                inputFormat="DD-MM-YYYY"
              />
            </LocalizationProvider>
          </Stack>
        </span>
        <span className="invoice-row">
          <FormControl variant="standard" sx={{ width: 350 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Bill to
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.billto}
              onChange={(e) =>
                setValues({
                  ...values,
                  billto: e.target.value,
                })
              }
            />
          </FormControl>{" "}
          <FormControl variant="standard" sx={{ width: 350 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Invoice
            </InputLabel>
            <Input
              id="bootstrap-input"
              type="number"
              value={values.invoiceNum}
              onChange={(e) =>
                setValues({
                  ...values,
                  invoiceNum: e.target.value,
                })
              }
            />
          </FormControl>
        </span>{" "}
        <span className="invoice-row">
          <FormControl variant="standard" sx={{ width: 350 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Contact Name
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.name}
              onChange={(e) =>
                setValues({
                  ...values,
                  name: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl variant="standard" sx={{ width: 350 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Contact Email
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.email}
              onChange={(e) =>
                setValues({
                  ...values,
                  email: e.target.value,
                })
              }
            />
          </FormControl>
        </span>{" "}
        <span className="invoice-row">
          <FormControl variant="standard" sx={{ width: 350 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Address
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.address}
              onChange={(e) =>
                setValues({
                  ...values,
                  address: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl variant="standard" sx={{ width: 350 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              GSTIN
            </InputLabel>
            <Input
              id="bootstrap-input"
              type="number"
              value={values.gstNum}
              onChange={(e) =>
                setValues({
                  ...values,
                  gstNum: e.target.value,
                })
              }
            />
          </FormControl>
        </span>
        <div className="reportButton" onClick={() => setOpenInvoice(true)}>
          {" "}
          <RemoveRedEyeIcon className="icon" />
          Preview Invoice{" "}
        </div>
      </div>
      <InvoiceModal
        show={openInvoice}
        handleClose={() => setOpenInvoice(false)}
        data={values}
        tableData={invoiceTabelData}
        location={invoiceLocationFilter}
      />
    </div>
  );
});

export default Report;
