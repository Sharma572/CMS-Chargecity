import { Autocomplete, Link, TextField } from "@mui/material";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import "./chargeSession.scss";
import DatabaseTable from "./databasetable";
import Widget from "./widget";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { it } from "node:test";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
interface optionObj {
  id: string;
  label: string;
}
const ChargeSession = memo(() => {
  // Widget Data
  const [usage, setUsage] = useState({ thisMonth: 0, lastMonth: 0, total: 0 });
  const [billedRevenue, setBilledRevenue] = useState({
    thisMonth: 0,
    lastMonth: 0,
    total: 0,
  });
  const [chargeSession, setChargeSession] = useState({
    thisMonth: 0,
    lastMonth: 0,
    total: 0,
  });
  const currentUser: any = Parse.User.current();
  const getWidgetsData = (
    userId: string,
    locationId: string,
    status: string,
    date: string,
    startDate: string | Date,
    endDate: string | Date,
    chargerSerial: string
  ) => {
    const ChargeSession = Parse.Object.extend("ChargeSession");
    const parseQuery = new Parse.Query(ChargeSession);

    parseQuery.include("ChargePoint");
    parseQuery.include("Location");
    parseQuery.include("Vehicle");
    parseQuery.include("User");
    parseQuery.descending("createdAt");
    if (userId) {
      let User = Parse.User;
      let userObj = User.createWithoutData(userId);
      parseQuery.equalTo("User", userObj);
    }
    if (currentUser && !currentUser.get("isSuperAdmin")) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", currentUser.get("CPO"));
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    if (chargerSerial) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("Serial", chargerSerial);
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    if (locationId) {
      var Location = Parse.Object.extend("Locations");
      var locationObj = Location.createWithoutData(locationId);
      parseQuery.equalTo("Location", locationObj);
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
      } else if (date === "This Week") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("week").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("week").toString())
        );
      } else if (date === "This Month") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("month").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("month").toString())
        );
      } else if (date === "This Year") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("year").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("year").toString())
        );
      }
    }

    if (startDate) {
      parseQuery.greaterThanOrEqualTo("createdAt", new Date(startDate));
    }
    if (endDate) {
      parseQuery.lessThanOrEqualTo("createdAt", new Date(endDate));
    }

    parseQuery.limit(5000);
    parseQuery.find().then((result) => {
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

          `${item.get("ChargePoint")?.get("Serial")}`,
          `${item.get("ChargePoint")?.get("Power")}`,
          `${item.get("ChargePoint")?.get("Connector")}`,
        ];

        csvRow.push(bc);
      });
      csvFirstRow.push([totalMoney, totalEnergy, totalSession], ["", "", ""]);
      setCsvState(csvFirstRow.concat(csvRow));
      setUsage({
        thisMonth: thisMonthEnergy,
        lastMonth: lastMonthEnergy,
        total: totalEnergy,
      });
      setBilledRevenue({
        thisMonth: thisMonthMoney,
        lastMonth: lastMonthMoney,
        total: totalMoney,
      });

      setChargeSession({
        thisMonth: thisMonthSession,
        lastMonth: lastMonthSession,
        total: totalSession,
      });
    });
  };

  // Filters Data
  const [allLocations, setAllLocations] = useState<any | null>([]);
  const [allUsers, setAllUsers] = useState<any | null>([]);

  // const getAllLocations = () => {
  //   const Locations = Parse.Object.extend("Locations");
  //   const parseQuery = new Parse.Query(Locations);

  //   parseQuery.limit(50);
  //   parseQuery.find().then((result) => {
  //     let addressArray: optionObj[] = [];
  //     result.forEach((item) => {
  //       addressArray.push({
  //         id: item.id,
  //         label: item.get("Name"),
  //       });
  //     });
  //     setAllLocations(addressArray);
  //   });
  // };
  let userDetail: any = localStorage.getItem("user-details");
  const getAllLocations = () => {
    const chargersQuery = new Parse.Query("Chargers");
    if (currentUser && !currentUser.get("isSuperAdmin")) {
      chargersQuery.equalTo("CPO", currentUser.get("CPO"));
    }

    chargersQuery.find().then((chargeResult) => {
      let locArray: any = [];
      chargeResult.map((chargePoint) => {
        if (!locArray.includes(chargePoint.get("Location").id)) {
          locArray.push(chargePoint?.get("Location").id);
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

  //Tabel
  const [tableData, setTableData] = useState<any>([]);

  const getOcppData = async (id: any, item: any) => {
    await fetch(`${process.env.REACT_APP_OCPP_BASE_URL}/meter_value/${id}`)
      .then((response: any) => response.json())
      .then((res: any) => {
        setTableData((oldArray: any) => [
          ...oldArray,
          {
            ...item,
            ocppEnergy: (res.energy_active_import_register / 1000).toFixed(2),
            ocppDuration:
              moment
                .duration(moment(res.timestamp).diff(item.createdAt))
                .hours() +
              "hr" +
              " " +
              moment
                .duration(moment(res.timestamp).diff(item.createdAt))
                .minutes() +
              "min",
            ocppCost: (
              item.tariff *
              (res.energy_active_import_register / 1000)
            ).toFixed(2),
          },
        ]);
      });
  };
  const [tableLoading, setTableLoading] = useState(false);
  const [csvState, setCsvState] = useState<any>([]);
  const loadSessions = (
    userId: string,
    locationId: string,
    status: string,
    date: string,
    startDate: string | Date,
    endDate: string | Date,
    chargerSerial: string
  ) => {
    setTableLoading(true);
    const parseQuery = new Parse.Query("ChargeSession");
    parseQuery.include("ChargePoint");
    if (userId) {
      let User = Parse.User;
      let userObj = User.createWithoutData(userId);
      parseQuery.equalTo("User", userObj);
    }
    if (currentUser && !currentUser.get("isSuperAdmin")) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", currentUser.get("CPO"));
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    if (locationId) {
      var Location = Parse.Object.extend("Locations");
      var locationObj = Location.createWithoutData(locationId);
      parseQuery.equalTo("Location", locationObj);
    }
    if (status) {
      status === "Completed"
        ? parseQuery.equalTo("Live", false)
        : parseQuery.equalTo("Live", true);
    }
    if (chargerSerial) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("Serial", chargerSerial);
      parseQuery.matchesQuery("ChargePoint", innerQuery);
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
      } else if (date === "This Week") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("week").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("week").toString())
        );
      } else if (date === "This Month") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("month").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("month").toString())
        );
      } else if (date === "This Year") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("year").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("year").toString())
        );
      }
    }

    if (startDate) {
      parseQuery.greaterThanOrEqualTo("createdAt", new Date(startDate));
    }
    if (endDate) {
      parseQuery.lessThanOrEqualTo("createdAt", new Date(endDate));
    }

    parseQuery.include("ChargePoint");
    parseQuery.include("Location");
    parseQuery.include("Vehicle");
    parseQuery.include("User");
    parseQuery.descending("createdAt");

    parseQuery.limit(2000);
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
        ocppCost: string;
        ocppEnergy: any;
        ocppDuration: string;
      }[] = [];

      let usersArray: any[] = [];

      result.forEach((item, index) => {
        let ocppData: any = { energy: "", time: "" };

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
        let totalDuration: any = item.get("TotalTimeConsumed")
          ? `${Math.trunc(
              item.get("TotalTimeConsumed") / 3600
            )} hr  ${Math.trunc(
              (item.get("TotalTimeConsumed") % 3600) / 60
            )} min`
          : "0 hr 0 min";

        let ab = {
          id: index + 1,
          status: `${item.get("User").get("FullName")}`,
          customer: `${item.get("User").get("FullName")}`,
          location: `${item.get("Location").get("Name")}`,
          serialNum: `${item.get("ChargePoint")?.get("Serial")}`,
          power: `${item.get("ChargePoint")?.get("Power")}`,
          connector: `${item.get("ChargePoint")?.get("Connector")}`,
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
          createdAt: `${item.get("createdAt")}`,
          tariff: `${item.get("ChargePoint")?.get("Cost")}`,
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
          }`,
          aid: `${item.get("AID")}`,
          date: `${item.get("createdAt")}`,
          cost: `₹ ${parseFloat(item.get("TotalCost")).toFixed(2)}`,
          energy: `${parseFloat(item.get("TotalEnergyConsumed")).toFixed(
            2
          )} kWh`,
          obj: item,
          ocppCost: "",
          ocppDuration: `${
            moment
              .duration(
                moment(new Date(ocppData.time)).diff(
                  moment(new Date(item.get("createdAt")))
                )
              )
              .hours() +
            "hr" +
            " " +
            moment
              .duration(
                moment(new Date(ocppData.time)).diff(
                  moment(new Date(item.get("createdAt")))
                )
              )
              .minutes() +
            "min"
          }  `,
          ocppEnergy: ocppData.energy ? ocppData.energy : "",
        };

        if (item.get("Live") && item.get("ChargePoint").get("isOCPP")) {
          getOcppData(item.get("TransactionId"), ab);
        } else {
          newRow.push(ab);
        }
      });

      setTableData(newRow);
      setTableLoading(false);
      setAllUsers(!allUsers.length ? usersArray : allUsers);
    });
  };

  useEffect(() => {
    getAllLocations();
  }, []);

  const allDateValues = [
    "Today",
    "This Week",
    "This Year",
    "This Month",
    "Custom",
  ];
  const allStatuses = ["Completed", "Charging"];
  const [userFilter, setUserFilter] = useState({ id: "", label: "" });
  const [locationFilter, setLocationFilter] = useState({ id: "", label: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState<any>("");
  const [endDateFilter, setEndDateFilter] = useState<any>("");
  const [chargerSerialFilter, setChargerSerialFilter] = useState<any>("");
  useEffect(() => {
    getWidgetsData(
      userFilter.id,
      locationFilter.id,
      statusFilter,
      dateFilter,
      startDateFilter,
      endDateFilter,
      chargerSerialFilter
    );
    loadSessions(
      userFilter.id,
      locationFilter.id,
      statusFilter,
      dateFilter,
      startDateFilter,
      endDateFilter,
      chargerSerialFilter
    );
  }, [
    userFilter.id,
    locationFilter.id,
    statusFilter,
    dateFilter,
    startDateFilter,
    endDateFilter,
    chargerSerialFilter,
  ]);
  const ab: any = html2canvas;

  return (
    <div id="invoiceCapture" className="csContainer">
      <div className="topRow">
        <div className="dwidgets">
          <Widget type="billedRevenue" data={billedRevenue} />
          <Widget type="usage" data={usage} />
          <Widget type="chargeSession" data={chargeSession} />
        </div>
        <div className="filters">
          <Autocomplete
            sx={{ width: 200 }}
            options={allUsers}
            autoHighlight
            size="small"
            onChange={(event: any, newValue: any) => {
              newValue
                ? setUserFilter(newValue)
                : setUserFilter({ id: "", label: "" });
            }}
            renderInput={(params) => <TextField {...params} label="Users" />}
          />

          <Autocomplete
            sx={{ width: 250 }}
            options={allLocations}
            autoHighlight
            size="small"
            onChange={(event: any, newValue: any) => {
              newValue
                ? setLocationFilter(newValue)
                : setLocationFilter({ id: "", label: "" });
            }}
            renderInput={(params) => <TextField {...params} label="Location" />}
          />
          <Autocomplete
            sx={{ width: 200 }}
            options={allStatuses}
            autoHighlight
            size="small"
            onChange={(event: any, newValue: any) => {
              newValue ? setStatusFilter(newValue) : setStatusFilter("");
            }}
            renderInput={(params) => <TextField {...params} label="Status" />}
          />

          <TextField
            id="outlined-basic"
            sx={{ width: 200 }}
            label="Charger Serial"
            variant="outlined"
            fullWidth
            multiline
            onChange={(event: any) => {
              setChargerSerialFilter(event.target.value);
            }}
            size="small"
          />
          <Autocomplete
            sx={{ width: 200 }}
            options={allDateValues}
            autoHighlight
            size="small"
            onChange={(event, newValue: any) => {
              setDateFilter(newValue);
              setStartDateFilter("");
              setEndDateFilter("");
            }}
            renderInput={(params) => <TextField {...params} label="Date" />}
          />
          {dateFilter === "Custom" && (
            <div className="dateSec">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Start Date"
                  value={moment(startDateFilter).format("DD MMM YYYY")}
                  onChange={(item) => setStartDateFilter(item || "")}
                  renderInput={(params) => (
                    <TextField {...params} error={false} />
                  )}
                  inputFormat="DD-MM-YYYY"
                />
              </LocalizationProvider>
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
            </div>
          )}
        </div>
      </div>
      <div className="report-button">
        <CSVLink data={csvState}>Download CSV</CSVLink>
      </div>
      {/* <DatabaseTable data={tableData} loading={tableLoading} />  👆👆👆👆👆 Code change*/} 
      <DatabaseTable data={tableData} loading={tableLoading} />
    </div>
  );
});

export default ChargeSession;
