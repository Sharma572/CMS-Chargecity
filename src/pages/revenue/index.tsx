import { Autocomplete, TextField } from "@mui/material";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import "./revenue.scss";

import Widget from "./widget";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";

interface optionObj {
  id: string;
  label: string;
}
const Revenue = memo(() => {
  // Widget Data

  const [landCost, setLandCost] = useState({
    thisMonth: 0,
    lastMonth: 0,
    total: 0,
  });
  const [billedRevenue, setBilledRevenue] = useState({
    thisMonth: 0,
    lastMonth: 0,
    total: 0,
  });

  const [avRevenue, setAvRevenue] = useState(0);
  const [energyCost, setEnergyCost] = useState(0);
  const [chartData, setChartData] = useState<any>(0);
  const [grossMargin, setGrossMargin] = useState(0);
  const [lineChartData, setLineChartData] = useState<any>(0);
  const currentUser: any = Parse.User.current();
  const getWidgetsData = (
    userId: string,
    locationId: string,
    locationType: string,
    currentType: string,
    status: string,
    date: string,
    startDate: string | Date,
    endDate: string | Date,
    operatorId: any
  ) => {
    const ChargeSession = Parse.Object.extend("ChargeSession");
    const parseQuery = new Parse.Query(ChargeSession);
    parseQuery.include("ChargePoint");
    if (userId) {
      let User = Parse.User;
      let userObj = User.createWithoutData(userId);
      parseQuery.equalTo("User", userObj);
    }
    if (currentUser && !JSON.parse(userDetail).isSuperAdmin) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", currentUser.get("CPO"));
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    if (JSON.parse(userDetail).isSuperAdmin && operatorId) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", {
        __type: "Pointer",
        className: "ChargePointOperators",
        objectId: operatorId,
      });
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    if (locationId) {
      var Location = Parse.Object.extend("Locations");
      var locationObj = Location.createWithoutData(locationId);
      parseQuery.equalTo("Location", locationObj);
    }

    if (locationType) {
      var innerQuery = new Parse.Query("Locations");
      innerQuery.equalTo("LocationType", locationType);
      parseQuery.matchesQuery("Location", innerQuery);
    }
    if (status) {
      status === "Completed"
        ? parseQuery.equalTo("Live", false)
        : parseQuery.equalTo("Live", true);
    }
    if (currentType) {
      var innerQuery = new Parse.Query("Chargers");

      var moreInnerQuery = new Parse.Query("ConnectorTypes");
      moreInnerQuery.equalTo("CurrentType", currentType);

      innerQuery.matchesQuery("ConnectorType", moreInnerQuery);
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
    parseQuery.include("Location");
    parseQuery.ascending("createdAt");
    parseQuery.limit(5000);
    parseQuery.find().then((result) => {
      type Person = {
        name: string;
        Revenue: any;
      };
      var dateArray: any[] = [];
      var tempData: Person[] = [];
      var lineData: any = [];
      let totalEnergyCost = 0;

      let totalMoney = 0;
      let thisMonthMoney = 0;
      let lastMonthMoney = 0;
      let totalSession = 0;
      let totalEnergyConsumed = 0;
      let totalElectricityTarrif = 0;

      result.forEach((item, index) => {
        let dateM = item.createdAt;

        let dateValue = moment(dateM).format("MMM YY");
        if (date === "Today") {
          dateValue = moment(dateM).format("MMM YY hh:mm A");
        }
        if (date === "This Week") {
          dateValue = moment(dateM).format("DD MMM YY ");
        }
        if (date === "This Month") {
          dateValue = moment(dateM).format("DD MMM YY ");
        }
        let currentRevenue = item.get("TotalCost") ? item.get("TotalCost") : 0;
        let currentEnergyCost = item.get("TotalEnergyConsumed")
          ? item.get("TotalEnergyConsumed") *
            item.get("Location").get("ElectricityTariff")
          : 0;

        let currentMargin = currentRevenue - currentEnergyCost;
        if (!dateArray.includes(dateValue)) {
          dateArray.push(dateValue);
          let newItem = {
            name: dateValue,
            Revenue: parseFloat(currentRevenue.toFixed(2)),
          };
          let oldItem = {
            name: dateValue,
            Revenue: parseFloat(currentRevenue.toFixed(2)),
            Energycost: parseFloat(currentEnergyCost.toFixed(2)),
            Margin: currentMargin,
          };
          tempData.push(newItem);
          lineData.push(oldItem);
        } else {
          tempData.forEach((el: { name: string; Revenue: any }) => {
            if (el.name === dateValue) {
              var sessions = el.Revenue;
              el.Revenue = parseFloat((sessions + currentRevenue).toFixed(2));
            } else {
              return;
            }
          });
          lineData.forEach(
            (el: {
              name: string;
              Revenue: any;
              Energycost: any;
              Margin: any;
            }) => {
              if (el.name === dateValue) {
                var sessions = el.Revenue;
                var energy = el.Energycost;
                var gross = el.Margin;
                el.Revenue = parseFloat((sessions + currentRevenue).toFixed(2));
                el.Energycost = parseFloat(
                  (energy + currentEnergyCost).toFixed(2)
                );
                el.Margin = parseFloat((gross + currentMargin).toFixed(2));
              } else {
                return;
              }
            }
          );
        }

        totalEnergyCost = item.get("TotalEnergyConsumed")
          ? item.get("TotalEnergyConsumed") *
              item.get("Location").get("ElectricityTariff") +
            totalEnergyCost
          : 0 + totalEnergyCost;
        totalMoney = item.get("TotalCost")
          ? item.get("TotalCost") + totalMoney
          : 0 + totalMoney;
        totalElectricityTarrif = item.get("Location").get("ElectricityTariff")
          ? item.get("Location").get("ElectricityTariff") +
            totalElectricityTarrif
          : 0 + totalElectricityTarrif;
        totalSession = totalSession + 1;
        totalEnergyConsumed = item.get("TotalEnergyConsumed")
          ? totalEnergyConsumed + item.get("TotalEnergyConsumed")
          : totalEnergyConsumed;
      });
      setLineChartData(lineData);
      setChartData(tempData);
      setAvRevenue(totalMoney / totalSession);
      setEnergyCost(totalEnergyCost);

      setLandCost({
        thisMonth: 0,
        lastMonth: 0,
        total: totalMoney / totalEnergyConsumed,
      });
      setGrossMargin(totalMoney - totalEnergyCost);

      setBilledRevenue({
        thisMonth: thisMonthMoney,
        lastMonth: lastMonthMoney,
        total: totalMoney,
      });

      getLandCost(
        locationId,
        locationType,
        date,
        startDate,
        endDate,
        totalMoney,
        totalEnergyCost
      );
    });
  };
  // Filters Data
  const [allLocations, setAllLocations] = useState<any | null>([]);
  const [allUsers, setAllUsers] = useState<any | null>([]);
  const [allLocationType, setAllLocationType] = useState<any | null>([]);
  const [allOperators, setAllOperators] = useState<any | null>([]);
  const getAllCPO = () => {
    const Vendors = Parse.Object.extend("ChargePointOperators");
    const parseQuery = new Parse.Query(Vendors);

    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let vendorsArray: any = [];
      result.forEach((item) => {
        let ab = {
          id: item.id,
          label: item.get("Name"),
        };
        vendorsArray.push(ab);
      });
      setAllOperators(vendorsArray);
    });
  };
  useEffect(() => {
    getAllCPO();
  }, []);
  const getLandCost = (
    locationId: string,
    locationType: string,
    date: string,
    startDate: string | Date,
    endDate: string | Date,
    totalRevenue: Number | any,
    totalEnergyCost: Number | any
  ) => {
    const Locations = Parse.Object.extend("Locations");
    const parseQuery = new Parse.Query(Locations);
    if (locationId) {
      parseQuery.equalTo("objectId", locationId);
    }
    if (locationType) {
      parseQuery.equalTo("LocationType", locationType);
    }

    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let addressArray: optionObj[] = [];
      let locationType: any[] = [];
      let totalLandCost = 0;
      let avLandCost = 0;
      result.forEach((item) => {
        if (item.get("RevenueModel") === "Rental") {
          if (date) {
            if (date === "Today" && item.get("RentalAmount")) {
              totalLandCost = item.get("RentalAmount") + totalLandCost;
              avLandCost =
                totalLandCost /
                new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  0
                ).getDate();
            } else if (date === "This Week" && item.get("RentalAmount")) {
              var currDate = moment.now();

              var result = moment(currDate).diff(
                new Date(
                  new Date().setDate(new Date().getDate() - new Date().getDay())
                ),
                "days"
              );

              totalLandCost = item.get("RentalAmount") + totalLandCost;
              avLandCost =
                (totalLandCost /
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0
                  ).getDate()) *
                result;
            } else if (date === "This Month") {
              totalLandCost = item.get("RentalAmount") + totalLandCost;
              var currDate = moment.now();

              var result = moment(currDate).diff(
                new Date(
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                ),
                "days"
              );
              avLandCost =
                (totalLandCost /
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0
                  ).getDate()) *
                result;
            } else if (date === "This Year") {
              var currDate = moment.now();
              totalLandCost = item.get("RentalAmount") + totalLandCost;
              var result = moment(currDate).diff(
                new Date(new Date(new Date().getFullYear(), 0, 1)),
                "days"
              );
              avLandCost =
                (totalLandCost /
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0
                  ).getDate()) *
                result;
            } else if (date === "Custom") {
              if (startDate && endDate) {
                var currDate = moment.now();
                totalLandCost = item.get("RentalAmount") + totalLandCost;
                var result = moment(endDate).diff(new Date(startDate), "days");

                avLandCost =
                  (totalLandCost /
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() + 1,
                      0
                    ).getDate()) *
                  result;
              } else {
                avLandCost = 0;
              }
            }
          }
        } else if (item.get("RevenueModel") === "Shared") {
          avLandCost = 0;
        }
      });
    });
  };

  let userDetail: any = localStorage.getItem("user-details");
  const getAllLocations = () => {
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

  const getAllLocationTypes = () => {
    const Locations = Parse.Object.extend("Locations");
    const parseQuery = new Parse.Query(Locations);

    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let addressArray: optionObj[] = [];
      let locationType: any[] = [];

      result.forEach((item) => {
        if (
          !locationType.find(function (i) {
            return i === item.get("LocationType");
          })
        ) {
          locationType.push(item.get("LocationType"));
        }
        addressArray.push({
          id: item.id,
          label: item.get("Name"),
        });
      });

      setAllLocationType(locationType);
    });
  };

  //Tabel
  const [tableData, setTableData] = useState<any>([]);

  const loadSessions = (
    userId: string,
    locationId: string,
    locationType: string,
    currentType: string,
    status: string,
    date: string,
    startDate: string | Date,
    endDate: string | Date,
    operatorId: any
  ) => {
    const parseQuery = new Parse.Query("ChargeSession");
    parseQuery.include("ChargePoint");
    if (userId) {
      let User = Parse.User;
      let userObj = User.createWithoutData(userId);
      parseQuery.equalTo("User", userObj);
    }
    if (locationId) {
      var Location = Parse.Object.extend("Locations");
      var locationObj = Location.createWithoutData(locationId);
      parseQuery.equalTo("Location", locationObj);
    }
    if (currentUser && !JSON.parse(userDetail).isSuperAdmin) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", currentUser.get("CPO"));
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    if (JSON.parse(userDetail).isSuperAdmin && operatorId) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", {
        __type: "Pointer",
        className: "ChargePointOperators",
        objectId: operatorId,
      });
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    if (locationType) {
      var innerQuery = new Parse.Query("Locations");
      innerQuery.equalTo("LocationType", locationType);
      parseQuery.matchesQuery("Location", innerQuery);
    }
    if (status) {
      status === "Completed"
        ? parseQuery.equalTo("Live", false)
        : parseQuery.equalTo("Live", true);
    }
    if (currentType) {
      var innerQuery = new Parse.Query("Chargers");

      var moreInnerQuery = new Parse.Query("ConnectorTypes");
      moreInnerQuery.equalTo("CurrentType", currentType);

      innerQuery.matchesQuery("ConnectorType", moreInnerQuery);
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
      setTableData(newRow);
      setAllUsers(!allUsers.length ? usersArray : allUsers);
    });
  };

  // Filters

  const handleCloseAllFilters = () => {
    setUserFilter({ id: "", label: "" });
    // setDateFilter("");
    // setStartDateFilter("");
    // setEndDateFilter("");
    setCurrentTypeFilter("");

    setLocationTypeFilter("");
    setLocationFilter({ id: "", label: "" });
    setOperatorFilter({ id: "", label: "" });
  };
  const [userFilter, setUserFilter] = useState({ id: "", label: "" });
  const [operatorFilter, setOperatorFilter] = useState({ id: "", label: "" });
  const [locationFilter, setLocationFilter] = useState({ id: "", label: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState<any>("");
  const [endDateFilter, setEndDateFilter] = useState<any>("");
  const [currentTypeFilter, setCurrentTypeFilter] = useState<any>("");
  const [locationTypeFilter, setLocationTypeFilter] = useState<any>("");
  useEffect(() => {
    getAllLocations();
    getAllLocationTypes();
  }, []);
  useEffect(() => {
    getWidgetsData(
      userFilter.id,
      locationFilter.id,
      locationTypeFilter,
      currentTypeFilter,
      statusFilter,
      dateFilter,
      startDateFilter,
      endDateFilter,
      operatorFilter.id
    );
    loadSessions(
      userFilter.id,
      locationFilter.id,
      locationTypeFilter,
      currentTypeFilter,
      statusFilter,
      dateFilter,
      startDateFilter,
      endDateFilter,
      operatorFilter.id
    );
  }, [
    userFilter.id,
    locationFilter.id,
    locationTypeFilter,
    currentTypeFilter,
    statusFilter,
    dateFilter,
    startDateFilter,
    endDateFilter,
    operatorFilter.id,
  ]);
  const filterByOptns = [
    "Location",
    "Location Type",
    "Current Type",
    "Operator",
    "User",
    "User Group",
  ];
  const [filterByValue, setFilterByValue] = useState("");
  const RevenueFilter = (props: { data: any }) => {
    switch (props.data) {
      case "Location":
        return (
          <Autocomplete
            sx={{ width: 350, backgroundColor: "white" }}
            options={allLocations}
            autoHighlight
            value={locationFilter}
            size="small"
            onChange={(event: any, newValue: any) => {
              newValue
                ? setLocationFilter(newValue)
                : setLocationFilter({ id: "", label: "" });
            }}
            renderInput={(params) => <TextField {...params} label="Location" />}
          />
        );
      case "Location Type":
        return (
          <Autocomplete
            sx={{ width: 350, backgroundColor: "white" }}
            id="tags-outlined"
            autoHighlight
            size="small"
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

      case "Current Type":
        return (
          <Autocomplete
            sx={{ width: 350, backgroundColor: "white" }}
            id="tags-outlined"
            autoHighlight
            size="small"
            value={currentTypeFilter}
            onChange={(event, newValue) => {
              setCurrentTypeFilter(newValue);
            }}
            options={["AC", "DC"]}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="Current Type" />
            )}
          />
        );

      case "User":
        return (
          <Autocomplete
            sx={{ width: 350, backgroundColor: "white" }}
            options={allUsers}
            autoHighlight
            size="small"
            value={userFilter}
            onChange={(event: any, newValue: any) => {
              newValue
                ? setUserFilter(newValue)
                : setUserFilter({ id: "", label: "" });
            }}
            renderInput={(params) => <TextField {...params} label="User" />}
          />
        );
      case "Operator":
        return (
          <Autocomplete
            sx={{ width: 350, backgroundColor: "white" }}
            options={allOperators}
            autoHighlight
            size="small"
            value={operatorFilter}
            onChange={(event: any, newValue: any) => {
              newValue
                ? setOperatorFilter(newValue)
                : setOperatorFilter({ id: "", label: "" });
            }}
            renderInput={(params) => <TextField {...params} label="Operator" />}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="revenue-container">
      <div className="widgets">
        <Widget type="revenue" data={billedRevenue} />

        <Widget type="avRevenue" data={avRevenue} />

        <Widget type="energy" data={energyCost} />

        <Widget type="land" data={landCost} />

        <Widget type="margin" data={grossMargin} />
      </div>

      <div className="filters">
        <Autocomplete
          options={
            !JSON.parse(userDetail).isSuperAdmin
              ? filterByOptns.filter((e: any) => e !== "Operator")
              : filterByOptns
          }
          autoHighlight
          size="small"
          onChange={(event: any, newValue: any) => {
            handleCloseAllFilters();
            newValue ? setFilterByValue(newValue) : setFilterByValue("");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter By"
              sx={{ width: 250, backgroundColor: "white" }}
            />
          )}
        />

        <div className="filterSec">
          <RevenueFilter data={filterByValue} />
        </div>

        <Autocomplete
          options={["Today", "This Week", "This Month", "This Year", "Custom"]}
          autoHighlight
          size="small"
          onChange={(event: any, newValue: any) => {
            setStartDateFilter("");
            setEndDateFilter("");
            newValue ? setDateFilter(newValue) : setDateFilter("");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Date"
              sx={{ width: 250, backgroundColor: "white" }}
            />
          )}
        />
        {dateFilter === "Custom" ? (
          <>
            <LocalizationProvider
              sx={{ backgroundColor: "white" }}
              dateAdapter={AdapterMoment}
            >
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
          </>
        ) : (
          ""
        )}
      </div>
      <div className="charts-sec">
        <div className="chart-content">
          <p className="title">Total Revenue</p>
          <ResponsiveContainer width="95%" maxHeight={400}>
            <BarChart width={730} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis dataKey="Revenue" />
              <Tooltip />

              <Bar dataKey="Revenue" fill="#1ac47d" width="30px" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-content">
          <p className="title">Cost Margin Line Graph</p>
          <ResponsiveContainer width="95%" maxHeight={400}>
            <LineChart
              data={lineChartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Revenue"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />

              <Line
                type="monotone"
                dataKey="Energycost"
                name="Energy Cost"
                activeDot={{ r: 8 }}
                stroke="#976168"
              />
              <Line
                type="monotone"
                dataKey="Margin"
                activeDot={{ r: 8 }}
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

export default Revenue;
