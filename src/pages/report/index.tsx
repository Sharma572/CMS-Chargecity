import "./report.scss";
import { CSVLink } from "react-csv";
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  TextField,
  InputLabel,
  ListItemText,
  ListSubheader,
  Input,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { memo, useEffect, useState } from "react";
import { Stack } from "@mui/system";
import moment from "moment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import InvoiceModal from "./invoice";
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
  const [csvState, setCsvState] = useState<any>([]);
  const payConfirm = () => {
    window.confirm("Do you want to proceed");
  };
  const [totalRevenue, setTotalRevenue] = useState(0);
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
      let totalEnergy = 0;
      let thisMonthEnergy = 0;
      let lastMonthEnergy = 0;
      let percentageEnergy = 0;
      let totalMoney = 0;
      let thisMonthMoney = 0;
      let lastMonthMoney = 0;
      let totalSession = 0;
      let thisMonthSession = 0;
      let lastMonthSession = 0;
      let csvRow: any[] = [
        [
          "Id",
          "Name",
          "Location",
          "Start Time",
          "End Time",
          "Cost",
          "Energy",
          "Serial",
          "Power",
          "Connector",
        ],
      ];
      let csvFirstRow: any[] = [
        ["Revenue", "Energy Consumed", "Total Session"],
      ];

      result.forEach((item, index) => {
        totalEnergy = item.get("TotalEnergyConsumed")
          ? item.get("TotalEnergyConsumed") + totalEnergy
          : 0 + totalEnergy;
        totalMoney = item.get("TotalCost")
          ? item.get("TotalCost") + totalMoney
          : 0 + totalMoney;
        totalSession = totalSession + 1;
        setTotalRevenue(totalMoney);
        let bc = [
          index + 1,
          `${item.get("User").get("FullName")}`,
          item.get("Location").get("Name"),
          `${
            moment(item.get("createdAt")).format("lll")
              ? moment(item.get("createdAt")).format("lll")
              : "-"
          }`,
          `${
            moment(item.get("updatedAt")).format("lll")
              ? moment(item.get("updatedAt")).format("lll")
              : "-"
          }`,
          `₹ ${parseFloat(item.get("TotalCost")).toFixed(2)}`,
          `${parseFloat(item.get("TotalEnergyConsumed")).toFixed(2)} kWh`,

          `${item.get("ChargePoint").get("Serial")}`,
          `${item.get("ChargePoint").get("Power")}`,
          `${item.get("ChargePoint").get("Connector")}`,
        ];

        csvRow.push(bc);

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

      csvFirstRow.push([totalMoney, totalEnergy, totalSession], ["", "", ""]);
      setCsvState(csvFirstRow.concat(csvRow));
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
  const [gdata, setGdata] = useState<any>([]);

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
  const currentUser: any = Parse.User.current();
  const intitalPayoutFields = {
    cpo: currentUser.get("CPO").get("Name"),
    isProcessed: false,
    status: "Pending",

    amount: 0,
  };
  const [payoutFields, setPayoutFields] = useState(intitalPayoutFields);
  const columns = [
    {
      field: "id",
      headerName: "S.No.",
      width: 50,
    },
    {
      field: "cpo",
      headerName: "CPO",
      width: 150,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 100,
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 250,
    },

    {
      field: "status",
      width: 120,
      headerName: "Status",
      renderCell: (params: { row: { obj: any } }) => {
        let currentStatus = params.row.obj.get("Status");
        console.log("lHey", currentStatus);
        return currentStatus === "Approved" ? (
          <div className="label-Approved">
            <span className="labelText">Approved</span>
          </div>
        ) : (
          <div className="label-offline">
            <span className="labelText">{params.row.obj.get("Status")}</span>
          </div>
        );
      },
    },
  ];

  const submitPayout = () => {
    if (payoutFields.amount) {
      let myNewObject: Parse.Object = new Parse.Object("Payouts");
      myNewObject.set("CPO", currentUser.get("CPO"));
      myNewObject.set("isProcessed", payoutFields.isProcessed);
      myNewObject.set("Amount", Number(payoutFields.amount));
      myNewObject.set("Status", "Pending");

      myNewObject.save().then((res) => {
        alert("Payout Added Sucessfully");
        getAllPayoutData();
      });
    } else {
      window.alert("Please fill amount");
    }
  };
  const [allPayouts, setAllPayouts] = useState<any>([]);
  const [totalPayout, setTotalPayout] = useState<any>(0);
  const getAllPayoutData = () => {
    const Locations = Parse.Object.extend("Payouts");

    const parseQuery = new Parse.Query(Locations);
    parseQuery.include("ChargePoint");
    parseQuery.limit(50);

    parseQuery.find().then((result) => {
      let allPayoutsArray: any = [];
      let payout: number = 0;
      result.forEach((item, index) => {
        payout = payout + (item.get("Amount") || 0);
        allPayoutsArray.push({
          id: index + 1,

          cpo: `${item.get("CPO").get("Name")}`,
          isProcessed: `${item.get("isProcessed")}`,
          status: `${item.get("Status")}`,
          updatedAt: `${item.get("updatedAt")}`,
          amount: `${item.get("Amount")}`,
          createdAt: `${moment(item.get("createdAt")).format("lll")}`,
          obj: item,
        });
      });
      setTotalPayout(payout);
      setAllPayouts(allPayoutsArray);
    });
  };
  useEffect(() => {
    getAllPayoutData();
  }, []);
  console.log("allPay", allPayouts);
  const [invoiceTabelData, setInvoiceTabelData] = useState<any>([]);

  const [filteredData, setFilteredData] = useState<any>([]);

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
    <div className="report-container">
      <div className="reportBox">
        <div className="top">
          <h1>Reports</h1>
          {/* <Button onClick={() => setOpenInvoice(true)}>
            {" "}
            Generate Invoice
          </Button> */}
        </div>
        <div className="mid">
          <div className="top-filter">
            <ReportFilter data={"Location"} />{" "}
            <ReportFilter data={"Location Type"} />
          </div>
          <div className="bottom-filter">
            <ReportFilter data={"Current Type"} />
            <h4>OR | AND</h4>
            <ReportFilter data={"Connector Type"} />
          </div>
        </div>
        <div className="bottom">
          <Stack
            direction="row"
            spacing={2}
            sx={{ margin: 4, marginBottom: 10 }}
          >
            <Stack direction="column" spacing={1}>
              <h4>Select Period</h4>
              <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                <Select
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{ width: 280 }}
                  input={<OutlinedInput />}
                  value={selectPeriod}
                >
                  <MenuItem disabled value="">
                    Period
                  </MenuItem>

                  <MenuItem
                    onClick={() => setSelectPeriod("Today")}
                    value={"Today"}
                  >
                    Today
                  </MenuItem>
                  <MenuItem
                    onClick={() => setSelectPeriod("Yesterday")}
                    value={"Yesterday"}
                  >
                    Yesterday
                  </MenuItem>
                  <MenuItem
                    onClick={() => setSelectPeriod("This Week")}
                    value={"This Week"}
                  >
                    Last 7 days
                  </MenuItem>
                  <MenuItem
                    onClick={() => setSelectPeriod("Last Month")}
                    value={"Last Month"}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    onClick={() => setSelectPeriod("Daily")}
                    value={"Daily"}
                  >
                    Daily
                  </MenuItem>

                  <MenuItem
                    onClick={() => setSelectPeriod("Custom")}
                    value={"Custom"}
                  >
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Specify Time"
              />
              <h4>Select Format</h4>
              <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                <Select
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{ width: 280 }}
                  input={<OutlinedInput />}
                  value=""
                >
                  <MenuItem disabled value="">
                    <em>CSV</em>
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
            {selectPeriod === "Custom" && (
              <>
                {" "}
                <Stack direction="column" spacing={1}>
                  <h4>From</h4>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Start Date"
                      value={startDateFilter}
                      onChange={(item) => setStartDateFilter(item || "")}
                      renderInput={(params) => (
                        <TextField {...params} error={false} />
                      )}
                      inputFormat="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </Stack>
                <Stack direction="column" spacing={1}>
                  <h4>To</h4>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="End Date"
                      value={endDateFilter}
                      onChange={(item) => setEndDateFilter(item || "")}
                      renderInput={(params) => (
                        <TextField {...params} error={false} />
                      )}
                      inputFormat="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </Stack>
              </>
            )}
            {selectPeriod === "Daily" && (
              <Stack direction="column" spacing={1} sx={{ marginTop: 100 }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <h4>Select Date</h4>
                  <DatePicker
                    label="Select Date"
                    value={customDateFilter}
                    onChange={(item) => setCustomDateFilter(item || "")}
                    renderInput={(params) => (
                      <TextField {...params} error={false} />
                    )}
                    inputFormat="DD-MM-YYYY"
                  />
                </LocalizationProvider>
              </Stack>
            )}
          </Stack>
          <CSVLink
            data={csvState}
            className="reportButton"
            filename={"Charge-City.csv"}
          >
            {" "}
            Generate Report
          </CSVLink>
        </div>
      </div>
      <div className="payout-box">
        <h1 className="head">Payouts</h1>
        <div className="payout-sec">
          <div className="payout-container">
            <Stack direction="column" spacing={4}>
              <FormControl variant="standard" sx={{ maxWidth: 400 }}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Name
                </InputLabel>
                <Input
                  id="bootstrap-input"
                  value={currentUser.get("CPO").get("Name")}
                />
              </FormControl>
              <FormControl variant="standard" sx={{ maxWidth: 400 }}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Amount available for payout
                </InputLabel>
                <Input
                  id="bootstrap-input"
                  defaultValue="₹"
                  value={(
                    totalRevenue -
                    (totalPayout + (2 / 100) * (totalRevenue + totalPayout))
                  ).toFixed(2)}
                />
              </FormControl>
              <FormControl variant="standard" sx={{ maxWidth: 400 }}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Amount
                </InputLabel>
                <Input
                  id="bootstrap-input"
                  defaultValue="₹"
                  type="number"
                  onChange={(e: any) => {
                    if (
                      e.target.value <=
                      totalRevenue -
                        (totalPayout + (2 / 100) * (totalRevenue + totalPayout))
                    ) {
                      setPayoutFields({
                        ...payoutFields,
                        amount: e.target.value,
                      });
                    } else {
                      alert(
                        `Can'nt withdwrall more than ${
                          totalRevenue -
                          (totalPayout +
                            (2 / 100) * (totalRevenue + totalPayout))
                        }`
                      );
                    }
                  }}
                />
              </FormControl>
              <button className="confirm-Button" onClick={() => submitPayout()}>
                Confirm
              </button>
            </Stack>
          </div>{" "}
          <div className="payout-breakup">
            <h3 className="heading">Payout Calculation</h3>
            <hr />
            <span className="list-item">
              <p className="item-head">Revenue</p>
              <small className="tail">₹ {totalRevenue.toFixed(2)}</small>
            </span>
            <span className="list-item">
              <p className="item-head">Payouts</p>
              <small className="tail">₹ {totalPayout.toFixed(2)}</small>
            </span>
            {/* <span className="list-item">
              <p className="item-head">Platform fee</p>
              <small className="tail">₹ 300</small>
            </span> */}
            <span className="list-item">
              <p className="item-head">Payment Gateway Charges</p>
              <small className="tail">
                ₹ {((2 / 100) * (totalRevenue + totalPayout)).toFixed(2)}
              </small>
            </span>
            <hr />
            <span className="list-item">
              <p className="item-head">Amount Available for Payout</p>
              <small className="tail">
                ₹{" "}
                {(
                  totalRevenue -
                  (totalPayout + (2 / 100) * (totalRevenue + totalPayout))
                ).toFixed(2)}
              </small>
            </span>
            <hr />
            <div className="reportButton" onClick={() => setOpenInvoice(true)}>
              {" "}
              <RemoveRedEyeIcon className="icon" />
              Preview Invoice{" "}
            </div>
          </div>
        </div>

        <DataGrid
          rows={allPayouts}
          columns={columns}
          pageSize={100}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick
          autoHeight
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1ac47d",
              color: "rgba(255,255,255,1)",
              fontSize: 14,
            },
          }}
        />
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
