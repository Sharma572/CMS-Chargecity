import "./home.scss";
import Widget from "./widget";
import Chart from "../../components/chart";
import Warnings from "../../components/homePageWarning";
import XChart from "./pieChart";
import moment from "moment";
import DatabaseTable from "./databasetable";
import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { log } from "console";

const Home = () => {
  const [usage, setUsage] = useState({ thisMonth: 0, lastMonth: 0, total: 0 });
  const [customerEnrollment, setCustomerEnrollment] = useState({
    thisMonth: 0,
    lastMonth: 0,
    total: 0,
  });

  const chargeInProcessCount = localStorage.getItem("activateCharge")

  useEffect(() => {
    const parseQuery = new Parse.Query("_User");
    parseQuery.descending("createdAt");
    parseQuery.include("EV");
    parseQuery.notEqualTo("UserType", "Cloud");
    parseQuery.limit(100);
    parseQuery.find().then((result) => {
      let totalCustomer = 0;
      let thisMonthCustomer = 0;
      let lastMonthCustomer = 0;

      result.forEach((item, index) => {
        if (moment(item.get("createdAt")).isAfter(moment().startOf("month"))) {
          thisMonthCustomer = thisMonthCustomer + 1;
        } else if (
          item.get("createdAt") >
          moment().subtract(1, "months").startOf("month")
        ) {
          lastMonthCustomer = lastMonthCustomer + 1;
        } else {
          totalCustomer = totalCustomer + 1;
        }
      });
      setCustomerEnrollment({
        thisMonth: thisMonthCustomer,
        lastMonth: lastMonthCustomer,
        total: totalCustomer,
      });
    });
  }, []);
  const [billedRevenue, setBilledRevenue] = useState({
    thisMonth: 0,
    lastMonth: 0,
    total: 0,
  });
  const [avRvenue, setAvRevenue] = useState({
    thisMonth: 0,
    lastMonth: 0,
    total: 0,
  });

  useEffect(() => {
    loadSessions();
  }, []);
  const [dataRow, setDataRow] = useState<any>([]);
  const [alertData, setAlertData] = useState({
    chargingPointOnline: 0,
    chargingPointOffline: 0,
    chargingSession: 0,
    chargerBooked: 0,
  });
  const currentUser: any = Parse.User.current();

  const [whiteLabeled, setWhiteLabeled] = useState(false);

  const getCpoStatus = () => {
    const Users = Parse.Object.extend("ChargePointOperators");
    const parseQuery = new Parse.Query(Users);

    if (currentUser) {
      parseQuery.equalTo("objectId", currentUser.get("CPO").id);
    }
    parseQuery.limit(1);

    parseQuery.find().then((result: any) => {
      result.forEach((item: any) => {
        setWhiteLabeled(item.get("isWhiteLabel"));
      });
    });
  };
  const allClients = () => {
    fetch(`${process.env.REACT_APP_OCPP_BASE_URL}/clients`);
  };
  useEffect(() => {
    getCpoStatus();
    allClients();
  }, []);
  const loadBookings = () => {
    const parseQuery = new Parse.Query("Bookings");
    parseQuery.include("User");
    parseQuery.include("ChargePoint");
    parseQuery.equalTo("isCancelled", false);
    parseQuery.greaterThan("Date", new Date());
    if (currentUser) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", currentUser.get("CPO"));
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    parseQuery.count().then((result) => {
      setAlertData({
        ...alertData,
        chargerBooked: result,
      });
    });
  };
  useEffect(() => {
    loadBookings();
  }, []);

  const getOcppData = async (id: any, item: any, start: any) => {
    await fetch(`${process.env.REACT_APP_OCPP_BASE_URL}/meter_value/${id}`)
      .then((response: any) => response.json())
      .then((res: any) => {
        setDataRow((oldArray: any) => [
          ...oldArray,

          {
            ...item,
            ocppEnergy: (res.energy_active_import_register / 1000).toFixed(2),
            ocppDuration:
              moment.duration(moment(res.timestamp).diff(start)).hours() +
              "hr" +
              " " +
              moment.duration(moment(res.timestamp).diff(start)).minutes() +
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
  const loadSessions = () => {
    setTableLoading(true);
    const parseQuery = new Parse.Query("ChargeSession");

    parseQuery.include("ChargePoint");
    parseQuery.include("Location");
    parseQuery.include("Vehicle");
    parseQuery.include("User");
    parseQuery.descending("createdAt");
    parseQuery.limit(1000);
    if (currentUser && !JSON.parse(userDetail).isSuperAdmin) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", currentUser.get("CPO"));
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    parseQuery.find().then((result) => {
      let totalEnergy = 0;
      let thisMonthEnergy = 0;
      let lastMonthEnergy = 0;

      let totalMoney = 0;
      let thisMonthMoney = 0;
      let lastMonthMoney = 0;
      let totalSession = 0;
      let thisMonthSession = 0;
      let lastMonthSession = 0;
      let newRow: any[] = [];

      result.forEach((item, index) => {
        if (moment(item.get("createdAt")).isAfter(moment().startOf("month"))) {
          thisMonthEnergy = item.get("TotalEnergyConsumed")
            ? item.get("TotalEnergyConsumed") + thisMonthEnergy
            : 0 + thisMonthEnergy;
          thisMonthMoney = item.get("TotalCost")
            ? item.get("TotalCost") + thisMonthMoney
            : 0 + thisMonthMoney;
          thisMonthSession = thisMonthSession + 1;
        } else if (
          item.get("createdAt") >
            moment().subtract(1, "months").startOf("month") &&
          item.get("createdAt") < moment().startOf("month")
        ) {
          lastMonthEnergy = item.get("TotalEnergyConsumed")
            ? item.get("TotalEnergyConsumed") + lastMonthEnergy
            : 0 + lastMonthEnergy;
          lastMonthMoney = item.get("TotalCost")
            ? item.get("TotalCost") + lastMonthMoney
            : 0 + lastMonthMoney;
          lastMonthSession = lastMonthSession + 1;
        } else {
          totalEnergy = item.get("TotalEnergyConsumed")
            ? item.get("TotalEnergyConsumed") + totalEnergy
            : 0 + totalEnergy;
          totalMoney = item.get("TotalCost")
            ? item.get("TotalCost") + totalMoney
            : 0 + totalMoney;
          totalSession = totalSession + 1;
        }
        let car = "";
        if (`${item.get("Vehicle")}` !== "undefined") {
          car = `${item.get("Vehicle").get("Name")}`;
        }

        let name = "";
        if (`${item.get("User")?.get("FullName")}` !== "undefined") {
          name = `${item.get("User")?.get("FullName")}`;
        }

        var newTime = "";
        if (item.get("TotalTimeConsumed") != null) {
          var timeInSeconds = item.get("TotalTimeConsumed");
          var hours = Math.floor(timeInSeconds / 3600);
          timeInSeconds = timeInSeconds - hours * 3600;
          var minutes = Math.floor(timeInSeconds / 60);
          timeInSeconds = timeInSeconds - minutes * 60;
          if (hours === 0) {
            newTime = `${minutes}` + "m " + `${timeInSeconds}` + "s";
          } else {
            newTime =
              `${hours}` +
              "h " +
              `${minutes}` +
              "m " +
              `${timeInSeconds}` +
              "s";
          }
        }

        var rangeAdded = 0.0;
        rangeAdded = item.get("RangeAdded");

        var unit = "";
        if (item.get("ChargeBy") === "Time") {
          unit = "Hours";
        } else if (item.get("ChargeBy") === "Units") {
          unit = "kWh";
        } else {
          unit = "₹";
        }

        let ab = {
          id: index + 1,
          orderId: `${item.id}`,
          isLive: `${item.get("Live")}`,
          chargeFor: `${item.get("ChargeFor")}` + " " + unit,
          customer: name,
          location: `${item.get("Location")?.get("Name")}`,
          carCharged: car,
          aid: `${item.get("AID")}`,
          startTime: `${moment(item.get("createdAt")).format("lll")}`,
          endTime: `${moment(item.get("updatedAt")).format("lll")}`,
          date: `${moment(item.get("createdAt")).format("DD MMM YYYY")}`,
          cost: "₹" + `${item.get("TotalCost")?.toFixed(2)}`,
          energy: `${item.get("TotalEnergyConsumed")}` + " kWh",
          rangeAdded: rangeAdded?.toFixed(2) + " km",
          time: newTime,
          serialNum: `${item.get("ChargePoint")?.get("Serial")}`,
          power: `${item.get("ChargePoint")?.get("Power")}`,
          connector: `${item.get("ChargePoint")?.get("Connector")}`,
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
          }  `,
          obj: item,
        };

        if (item.get("Live") && item.get("ChargePoint").get("isOCPP")) {
          getOcppData(item.get("TransactionId"), ab, item.get("createdAt"));
        } else {
          newRow.push(ab);
        }
      });
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
      setAvRevenue({
        thisMonth: thisMonthMoney / thisMonthSession,
        lastMonth: lastMonthMoney / lastMonthSession,
        total: totalMoney / totalSession,
      });
      setDataRow(newRow);
      OcppDataCircularChart();
      setTableLoading(false);
    });
  };
  let userDetail: any = localStorage.getItem("user-details");
  const [piChartData, setpiChartData] = useState({
    available: 0,
    charging: 0,
    outOfOrder: 0,
    offline: 0,
    scheduled: 0,
  });

  const OcppDataCircularChart = () => {
    const chargersQuery = new Parse.Query("Chargers");
    if (currentUser && !JSON.parse(userDetail).isSuperAdmin) {
      chargersQuery.equalTo("CPO", currentUser.get("CPO"));
    }

    chargersQuery.find().then((chargeResult) => {
      let chargeCodeArray: any = [];
      let totalChargers: any = 0;
      let chargerType: any = [
        "3.3kW",
        "7.2kW",

        "11kW",
        "22kW",
        "25kW",
        "30kW",
        "60kW",
        "120kW",
        "250kW",
      ];
      let count1: any = 0;
      let count2: any = 0;
      let count3: any = 0;
      let count4: any = 0;
      let count5: any = 0;
      let count6: any = 0;
      let count7: any = 0;
      let count8: any = 0;
      let count9: any = 0;
      let count10: any = 0;
      chargeResult.forEach((chargePoint) => {
        if (chargePoint.get("isOCPP")) {
          switch (String(chargePoint.get("Power"))) {
            case "3.3 kW":
              count1 = count1 + 1;
              break;
            case "7.2 kW":
              count2 = count2 + 1;
              break;

            case "11 kW":
              count4 = count4 + 1;
              break;
            case "22 kW":
              count5 = count5 + 1;
              break;
            case "25 kW":
              count6 = count6 + 1;
              break;
            case "30 kW":
              count7 = count7 + 1;
              break;
            case "60 kW":
              count8 = count8 + 1;
              break;
            case "120 kW":
              count9 = count9 + 1;
              break;
            case "250 kW":
              count10 = count10 + 1;
              break;
            default:
              break;
          }
          chargeCodeArray.push(chargePoint.get("ChargeId"));
          totalChargers = totalChargers + 1;
        }
      });
      let charging = 0;
      let online = 0;
      let offline = 0;
      let available = 0;
      fetch(`${process.env.REACT_APP_OCPP_BASE_URL}/active_clients`)
        .then((response: any) => response.json())
        .then((res: any) => {
          res.forEach((el: any) => {
            console.log("nji", el);
            //Connector number 1 need to check
            if (chargeCodeArray.includes(el.name)) {
              if (el.is_active === true) {
                online = online + 1;
              }
              if (el.connectors[1]?.status === "Charging") {
                charging = charging + 1;
              }
              if (
                el.is_active === true &&
                el.connectors[1]?.status !== "Charging"
              ) {
                available = available + 1;
              }
            } else {
              return;
            }
          });

          setAlertData({
            ...alertData,
            chargingPointOnline: available,
            chargingSession: charging,
            chargingPointOffline: totalChargers - (available + charging),
          });

          setpiChartData({
            ...piChartData,
            available: available,
            charging: charging,
            offline: totalChargers - (available + charging),
          });
          console.log("NOPO", count1, count2, count3, count5);
          setChargerTypeData([
            { name: "AC 3.3kW", value: count1, color: "#6AD3A7" },
            { name: "AC 7.2kW", value: count2, color: "#FFDF8E " },

            { name: "AC 11kW", value: count4, color: "#5185EC" },
            { name: "DC 15kW", value: count4, color: "#5185EC" },
            { name: "AC 22kW", value: count5, color: "#FFA38E" },
            { name: "DC 25kW", value: count6, color: "#9158A5" },
            { name: "DC 30kW", value: count7, color: "#8EB5FF" },
            { name: "DC 60kW", value: count8, color: "#5BFF33" },
            { name: "DC 120kW", value: count9, color: "#33FFF6" },
            { name: "DC 250kW", value: count10, color: "#FF336E" },
          ]);
        });
    });
  };

  const [chargerStatus, setChargerStatus] = useState<any>([
    { name: "Available", value: 0, color: "#5185EC" },
    { name: "Charging", value: 0, color: "#58A55C" },
    { name: "Out of Order", value: 0, color: "#D85140" },
    { name: "Offline", value: 0, color: "#F1BE42" },
    { name: "Scheduled", value: 0, color: "#9158A5" },
  ]);
  useEffect(() => {
    setChargerStatus([
      { name: "Available", value: piChartData.available, color: "#6AD3A7" },
      { name: "Charging", value: piChartData.charging, color: "#8EB5FF" },
      { name: "Out of Order", value: 0, color: "#8EB5FF" },
      { name: "Offline", value: piChartData.offline, color: "#FFDF8E" },
      { name: "Scheduled", value: 0, color: "#9E8EFF" },
    ]);
  }, [piChartData.available, piChartData.charging, piChartData.offline]);
  const [chargerTypeData, setChargerTypeData] = useState<any>([
    { name: "AC 22kW", value: 0, color: "#5185EC" },
  ]);
  
  const charging = alertData?.chargingSession;
  return (
    <>
      <div className="home_main_container">
        <div className="left_container   ">
         <div className="tab_Heading_container left">
            <h1 className="tab_heading">Dashboard</h1>
            <div className="detailed_heading">
            <h1>
            Charger connected on details
              </h1> 
            </div>
         </div>
          <Chart />
          <DatabaseTable data={dataRow} loading={tableLoading} />
        </div>
        <div className="right_container ">
         <div className="right_wrapper">
         <div className="tab_Heading_container right">
            <h1 className="tab_heading">Dashboard</h1>
            <div className="detailed_heading">
            <h1>
            Charger connected on details
              </h1> 
            </div>
         </div>
          <div className="cStatus_container">
          <div className="chargeProcessContainer chargeContainer">
        {/* charge in process */}
        <h2 className="card_heading">Charging in Progress</h2>
        <h1 className="chargeProcessCount">{charging}</h1>
      </div>
      <div className="faultContainer chargeContainer">
        {/* charge in process */}
        <h2 className="card_heading">Faults detected</h2>
        <h1 className="faultCount">{charging}</h1>
      </div>
          </div>
         <div className="widgets widgets_container">
          <div className="card_container_stats">
        <Widget type="usage" data={usage} />

          </div>
          <div className="card_container_stats">
        <Widget type="customers" data={customerEnrollment} />

          </div>
          <div className="card_container_stats mt-2">
        <Widget type="billedRevenue" data={billedRevenue} />

          </div>
          <div className="card_container_stats mt-2">
        <Widget type="avRevenue" data={avRvenue} />

          </div>
         </div>
         <div className="statics_container">
         {/* <Warnings data={alertData} className='hidden' /> */}
<div className="left_stats">
<XChart type="Charger Status and Alerts" data={chargerStatus} />
</div>
<div className="right_stats">
<XChart
  type="Charger Type"
  data={chargerTypeData.filter((item: any) => item.value)}
/>
</div>

         </div>
         </div>
        </div>
      </div>
    </>
    
  );
};

export default Home;
