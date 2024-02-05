import { Autocomplete, TextField } from "@mui/material";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import "./energy.scss";

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

import ReactApexChart from "react-apexcharts";
interface optionObj {
  id: string;
  label: string;
}
const Energy = memo(() => {
  // Widget Data

  const [energyConsumed, setEnergyConsumed] = useState({
    thisMonth: 0,
    lastMonth: 0,
    total: 0,
  });

  const [avEnergy, setAvEnergy] = useState(0);
  const [energyCost, setEnergyCost] = useState(0);
  const [chartData, setChartData] = useState<any>(0);
  const [lineChartData, setLineChartData] = useState<any>(0);
  const [avCostPerKw, setAvCostPerKw] = useState(0);
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

  const getLocationData = (locationId: string, locationType: string) => {
    const ChargePoints = Parse.Object.extend("Locations");

    const parseQuery = new Parse.Query(ChargePoints);

    if (locationId) {
      parseQuery.equalTo("objectId", locationId);
    }
    if (locationType) {
      parseQuery.equalTo("LocationType", locationType);
    }
    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let totalLocations = 0;
      let totalElectricityTariff = 0;
      result.forEach((item, index) => {
        totalLocations = totalLocations + 1;

        totalElectricityTariff =
          totalElectricityTariff + item.get("ElectricityTariff");
      });

      setAvCostPerKw(totalElectricityTariff / totalLocations);
    });
  };
  const currentUser: any = Parse.User.current();
  const getWidgetsData = (
    userId: string,
    locationId: string,
    locationType: string,
    currentType: string,

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
        Energy: any;
      };
      var dateArray: any[] = [];
      var tempData: Person[] = [];
      var lineData: any = [];
      let totalEnergyCost = 0;

      let totalEnergy = 0;
      let thisMonthMoney = 0;
      let lastMonthMoney = 0;
      let totalSession = 0;

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
        let currentEnergy = item.get("TotalEnergyConsumed")
          ? item.get("TotalEnergyConsumed")
          : 0;
        let currentAvEnergyCost = item.get("TotalEnergyConsumed")
          ? item.get("TotalEnergyConsumed") / totalSession
          : 0;
        totalSession = totalSession + 1;
        totalEnergyCost = item.get("TotalEnergyConsumed")
          ? item.get("TotalEnergyConsumed") *
              item.get("Location").get("ElectricityTariff") +
            totalEnergyCost
          : 0 + totalEnergyCost;
        totalEnergy = item.get("TotalEnergyConsumed")
          ? item.get("TotalEnergyConsumed") + totalEnergy
          : 0 + totalEnergy;
        totalElectricityTarrif = item.get("Location").get("ElectricityTariff")
          ? item.get("Location").get("ElectricityTariff") +
            totalElectricityTarrif
          : 0 + totalElectricityTarrif;
        if (!dateArray.includes(dateValue)) {
          dateArray.push(dateValue);
          let newItem = {
            name: dateValue,
            Energy: parseFloat(currentEnergy.toFixed(2)),
          };
          let oldItem = {
            name: dateValue,
            Energy: parseFloat(currentEnergy.toFixed(2)),
            AverageEnergyConsumed: parseFloat(currentAvEnergyCost.toFixed(2)),
          };
          tempData.push(newItem);
          lineData.push(oldItem);
        } else {
          tempData.forEach((el: { name: string; Energy: any }) => {
            if (el.name === dateValue) {
              var sessions = el.Energy;
              el.Energy = parseFloat((sessions + currentEnergy).toFixed(2));
            } else {
              return;
            }
          });
          lineData.forEach(
            (el: { name: string; Energy: any; AverageEnergyConsumed: any }) => {
              if (el.name === dateValue) {
                var sessions = el.Energy;

                el.Energy = parseFloat((sessions + currentEnergy).toFixed(2));
                el.AverageEnergyConsumed = parseFloat(
                  (totalEnergy / totalSession).toFixed(2)
                );
              } else {
                return;
              }
            }
          );
        }
      });
      setLineChartData(lineData);
      setChartData(tempData);
      setAvEnergy(totalEnergy / totalSession);
      setEnergyCost(totalEnergyCost);
      setEnergyConsumed({
        thisMonth: thisMonthMoney,
        lastMonth: lastMonthMoney,
        total: totalEnergy,
      });
    });
  };

  // Filters Data
  const [allLocations, setAllLocations] = useState<any | null>([]);
  const [allUsers, setAllUsers] = useState<any | null>([]);
  const [allLocationType, setAllLocationType] = useState<any | null>([]);

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

  const getAllLocationType = () => {
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

      setAllLocationType(
        allLocationType.length ? allLocationType : locationType
      );
    });
  };

  //Tabel

  const [series, setSeries] = useState([
    {
      name: "9 am - 11 am",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "11 am -1pm",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "1 pm - 3pm",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "3 pm - 5pm",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "5 pm - 7pm",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "7 pm - 9pm",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "9 pm -  11pm",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "11 pm -1am",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "1 am - 3am",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "3 am - 5am",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "5 am -7am",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "7 am - 9am",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ]);
  const loadSessions = (
    userId: string,
    locationId: string,
    locationType: string,
    currentType: string,

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
      let nine: any = [0, 0, 0, 0, 0, 0, 0];
      let eleven: any = [0, 0, 0, 0, 0, 0, 0];
      let thirteen: any = [0, 0, 0, 0, 0, 0, 0];
      let fifteen: any = [0, 0, 0, 0, 0, 0, 0];
      let seventeen: any = [0, 0, 0, 0, 0, 0, 0];
      let nineteen: any = [0, 0, 0, 0, 0, 0, 0];
      let twentyone: any = [0, 0, 0, 0, 0, 0, 0];
      let twentythree: any = [0, 0, 0, 0, 0, 0, 0];
      let one: any = [0, 0, 0, 0, 0, 0, 0];
      let three: any = [0, 0, 0, 0, 0, 0, 0];
      let five: any = [0, 0, 0, 0, 0, 0, 0];
      let seven: any = [0, 0, 0, 0, 0, 0, 0];
      result.forEach((item, index) => {
        let createdAt = item.get("createdAt").getHours();
        let day = item.get("createdAt").getDay();

        if (createdAt >= 9 && createdAt < 11) {
          if (day === 0) {
            nine[0] = nine[0] + 1;
          } else if (day === 1) {
            nine[1] = nine[1] + 1;
          } else if (day === 2) {
            nine[2] = nine[2] + 1;
          } else if (day === 3) {
            nine[3] = nine[3] + 1;
          } else if (day === 4) {
            nine[4] = nine[4] + 1;
          } else if (day === 5) {
            nine[5] = nine[5] + 1;
          } else if (day === 6) {
            nine[6] = nine[6] + 1;
          }
        } else if (createdAt >= 11 && createdAt < 13) {
          if (day === 0) {
            eleven[0] = eleven[0] + 1;
          } else if (day === 1) {
            eleven[1] = eleven[1] + 1;
          } else if (day === 2) {
            eleven[2] = eleven[2] + 1;
          } else if (day === 3) {
            eleven[3] = eleven[3] + 1;
          } else if (day === 4) {
            eleven[4] = eleven[4] + 1;
          } else if (day === 5) {
            eleven[5] = eleven[5] + 1;
          } else if (day === 6) {
            eleven[6] = eleven[6] + 1;
          }
        } else if (createdAt >= 13 && createdAt < 15) {
          if (day === 0) {
            thirteen[0] = thirteen[0] + 1;
          } else if (day === 1) {
            thirteen[1] = thirteen[1] + 1;
          } else if (day === 2) {
            thirteen[2] = thirteen[2] + 1;
          } else if (day === 3) {
            thirteen[3] = thirteen[3] + 1;
          } else if (day === 4) {
            thirteen[4] = thirteen[4] + 1;
          } else if (day === 5) {
            thirteen[5] = thirteen[5] + 1;
          } else if (day === 6) {
            thirteen[6] = thirteen[6] + 1;
          }
        } else if (createdAt >= 15 && createdAt < 17) {
          if (day === 0) {
            fifteen[0] = fifteen[0] + 1;
          } else if (day === 1) {
            fifteen[1] = fifteen[1] + 1;
          } else if (day === 2) {
            fifteen[2] = fifteen[2] + 1;
          } else if (day === 3) {
            fifteen[3] = fifteen[3] + 1;
          } else if (day === 4) {
            fifteen[4] = fifteen[4] + 1;
          } else if (day === 5) {
            fifteen[5] = fifteen[5] + 1;
          } else if (day === 6) {
            fifteen[6] = fifteen[6] + 1;
          }
        } else if (createdAt >= 17 && createdAt < 19) {
          if (day === 0) {
            seventeen[0] = seventeen[0] + 1;
          } else if (day === 1) {
            seventeen[1] = seventeen[1] + 1;
          } else if (day === 2) {
            seventeen[2] = seventeen[2] + 1;
          } else if (day === 3) {
            seventeen[3] = seventeen[3] + 1;
          } else if (day === 4) {
            seventeen[4] = seventeen[4] + 1;
          } else if (day === 5) {
            seventeen[5] = seventeen[5] + 1;
          } else if (day === 6) {
            seventeen[6] = seventeen[6] + 1;
          }
        } else if (createdAt >= 19 && createdAt < 21) {
          if (day === 0) {
            nineteen[0] = nineteen[0] + 1;
          } else if (day === 1) {
            nineteen[1] = nineteen[1] + 1;
          } else if (day === 2) {
            nineteen[2] = nineteen[2] + 1;
          } else if (day === 3) {
            nineteen[3] = nineteen[3] + 1;
          } else if (day === 4) {
            nineteen[4] = nineteen[4] + 1;
          } else if (day === 5) {
            nineteen[5] = nineteen[5] + 1;
          } else if (day === 6) {
            nineteen[6] = nineteen[6] + 1;
          }
        } else if (createdAt >= 21 && createdAt < 23) {
          if (day === 0) {
            twentyone[0] = twentyone[0] + 1;
          } else if (day === 1) {
            twentyone[1] = twentyone[1] + 1;
          } else if (day === 2) {
            twentyone[2] = twentyone[2] + 1;
          } else if (day === 3) {
            twentyone[3] = twentyone[3] + 1;
          } else if (day === 4) {
            twentyone[4] = twentyone[4] + 1;
          } else if (day === 5) {
            twentyone[5] = twentyone[5] + 1;
          } else if (day === 6) {
            twentyone[6] = twentyone[6] + 1;
          }
        } else if (createdAt >= 23 && createdAt < 1) {
          if (day === 0) {
            twentythree[0] = twentythree[0] + 1;
          } else if (day === 1) {
            twentythree[1] = twentythree[1] + 1;
          } else if (day === 2) {
            twentythree[2] = twentythree[2] + 1;
          } else if (day === 3) {
            twentythree[3] = twentythree[3] + 1;
          } else if (day === 4) {
            twentythree[4] = twentythree[4] + 1;
          } else if (day === 5) {
            twentythree[5] = twentythree[5] + 1;
          } else if (day === 6) {
            twentythree[6] = twentythree[6] + 1;
          }
        } else if (createdAt >= 1 && createdAt < 3) {
          if (day === 0) {
            one[0] = one[0] + 1;
          } else if (day === 1) {
            one[1] = one[1] + 1;
          } else if (day === 2) {
            one[2] = one[2] + 1;
          } else if (day === 3) {
            one[3] = one[3] + 1;
          } else if (day === 4) {
            one[4] = one[4] + 1;
          } else if (day === 5) {
            one[5] = one[5] + 1;
          } else if (day === 6) {
            one[6] = one[6] + 1;
          }
        } else if (createdAt >= 3 && createdAt < 5) {
          if (day === 0) {
            three[0] = three[0] + 1;
          } else if (day === 1) {
            three[1] = three[1] + 1;
          } else if (day === 2) {
            three[2] = three[2] + 1;
          } else if (day === 3) {
            three[3] = three[3] + 1;
          } else if (day === 4) {
            three[4] = three[4] + 1;
          } else if (day === 5) {
            three[5] = three[5] + 1;
          } else if (day === 6) {
            three[6] = three[6] + 1;
          }
        } else if (createdAt >= 5 && createdAt < 7) {
          if (day === 0) {
            five[0] = five[0] + 1;
          } else if (day === 1) {
            five[1] = five[1] + 1;
          } else if (day === 2) {
            five[2] = five[2] + 1;
          } else if (day === 3) {
            five[3] = five[3] + 1;
          } else if (day === 4) {
            five[4] = five[4] + 1;
          } else if (day === 5) {
            five[5] = five[5] + 1;
          } else if (day === 6) {
            five[6] = five[6] + 1;
          }
        } else if (createdAt >= 7 && createdAt < 9) {
          if (day === 0) {
            seven[0] = seven[0] + 1;
          } else if (day === 1) {
            seven[1] = seven[1] + 1;
          } else if (day === 2) {
            seven[2] = seven[2] + 1;
          } else if (day === 3) {
            seven[3] = seven[3] + 1;
          } else if (day === 4) {
            seven[4] = seven[4] + 1;
          } else if (day === 5) {
            seven[5] = seven[5] + 1;
          } else if (day === 6) {
            seven[6] = seven[6] + 1;
          }
        }

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

      setSeries([
        {
          name: "9 am - 11am",
          data: nine,
        },
        {
          name: "11 am -1pm",
          data: eleven,
        },
        {
          name: "1 pm - 3 pm",
          data: thirteen,
        },
        {
          name: "3 pm - 5pm",
          data: fifteen,
        },
        {
          name: "5 pm - 7pm",
          data: seventeen,
        },
        {
          name: "7 pm - 9pm",
          data: nineteen,
        },
        {
          name: "9 pm - 11pm",
          data: twentyone,
        },
        {
          name: "11 pm - 1 am",
          data: twentythree,
        },
        {
          name: "1 am - 3 am",
          data: one,
        },
        {
          name: "3 am - 5 am",
          data: three,
        },
        {
          name: "5 am -7 am",
          data: five,
        },
        {
          name: "7 am - 9am",
          data: seven,
        },
      ]);

      setAllUsers(!allUsers.length ? usersArray : allUsers);
    });
  };

  // Filters

  useEffect(() => {
    getAllLocations();
    getAllLocationType();
  }, []);

  const [userFilter, setUserFilter] = useState({ id: "", label: "" });
  const [operatorFilter, setOperatorFilter] = useState({ id: "", label: "" });
  const [locationFilter, setLocationFilter] = useState({ id: "", label: "" });
  const [dateFilter, setDateFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState<any>("");
  const [endDateFilter, setEndDateFilter] = useState<any>("");
  const [currentTypeFilter, setCurrentTypeFilter] = useState<any>("");
  const [locationTypeFilter, setLocationTypeFilter] = useState<any>("");

  const handleCloseAllFilters = () => {
    setUserFilter({ id: "", label: "" });
    setDateFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setCurrentTypeFilter("");
    setLocationTypeFilter("");
    setLocationFilter({ id: "", label: "" });
    setOperatorFilter({ id: "", label: "" });
  };
  useEffect(() => {
    getWidgetsData(
      userFilter.id,
      locationFilter.id,
      locationTypeFilter,
      currentTypeFilter,

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

    dateFilter,
    startDateFilter,
    endDateFilter,
    operatorFilter,
  ]);

  useEffect(() => {
    getLocationData(locationFilter.id, locationTypeFilter);
  }, [locationFilter.id, locationTypeFilter]);

  const filterByOptns = [
    "Location",
    "Location Type",
    "Current Type",
    "Operator",

    "User",

    "User Group",
  ];
  const [filterByValue, setFilterByValue] = useState("");

  const options = {
    chart: {
      height: 350,
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thus", "Frid", "Sat"],
    },
    title: {
      text: "Charge Sessions Heat Map",
    },

    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 1,
              name: "0 >",
              color: "#e3faf1",
            },
            {
              from: 1,
              to: 10,
              name: "1 >",
              color: "#9cffd8",
            },
            {
              from: 10,
              to: 20,
              name: "10 >",
              color: "#65f7bb",
            },
            {
              from: 20,
              to: 50,
              name: "20 >",
              color: "#1ac47d",
            },
          ],
        },
      },
    },
    colors: ["#1ac47d"],
  };

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
    <div className="energy-container">
      <div className="widgets">
        <Widget type="revenue" data={energyConsumed} />

        <Widget type="avRevenue" data={avEnergy} />

        <Widget type="energy" data={energyCost} />

        <Widget type="land" data={avCostPerKw} />
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
            setDateFilter(newValue);
            setStartDateFilter("");
            setEndDateFilter("");
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
          <p className="title">Total Energy Consumed</p>
          <ResponsiveContainer width="95%" maxHeight={400}>
            <BarChart width={730} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis dataKey="Energy" />
              <Tooltip />

              <Bar dataKey="Energy" fill="#1ac47d" width="30px" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="below-chart">
          <div className="chart-bar">
            <ReactApexChart
              options={options}
              series={series}
              type="heatmap"
              height={350}
            />
          </div>
          <div className="chart-line">
            <p className="title">Consumption Line Graph</p>
            <ResponsiveContainer width="95%" height={400}>
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
                  dataKey="Energy"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />

                <Line
                  type="monotone"
                  dataKey="AverageEnergyConsumed"
                  name="Average Energy Consumed"
                  activeDot={{ r: 8 }}
                  stroke="#976168"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Energy;
