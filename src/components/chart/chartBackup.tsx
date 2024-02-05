import React, { useEffect, memo, useState } from "react";
import "./chart.scss";
import Parse from "parse";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AiFillApi } from "react-icons/ai";
import moment from "moment";
const Chart = memo(() => {
  const [dataArray, setDataArray] = useState<any | null>(null);

  useEffect(() => {
    loadChargeSessions();
  }, []);
  const currentUser: any = Parse.User.current();
  const loadChargeSessions = () => {
    const parseQuery = new Parse.Query("ChargeSession");
    if (currentUser) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", currentUser.get("CPO"));
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }
    parseQuery.greaterThanOrEqualTo(
      "createdAt",
      new Date(String(moment().subtract(1, "year").startOf("month")))
    );
    parseQuery.ascending("createdAt");
    // query.greaterThanOrEqualTo('createdAt', );
    parseQuery.limit(10000);

    parseQuery.find().then((result) => {
      type Person = {
        name: string;
        Total: any;
      };
      var dateArray: any[] = [];
      var tempData: Person[] = [];

      result.forEach((item) => {
        console.log("item", item);
        let date = item.createdAt;

        console.log("No-One", item.createdAt);
        let dateValue = moment(date).format("MMM YY");

        if (!dateArray.includes(dateValue)) {
          dateArray.push(dateValue);
          let newItem = {
            name: dateValue,
            Total: 1,
          };
          console.log("newItem", newItem);
          tempData.push(newItem);
        } else {
          tempData.forEach((item: { name: string; Total: any }) => {
            if (item.name === dateValue) {
              var sessions = item.Total;
              item.Total = sessions + 1;
            }
          });
        }
      });

      setDataArray(tempData.slice(6));
      // setDataArray(tempData);
    });
  };

  interface CustomActiveDotProps {
    cx?: number;
    cy?: number;
    stroke?: string;
    index?: number;
  }

  const CustomActiveDot: React.FC<CustomActiveDotProps> = ({
    cx,
    cy,
    stroke,
    index,
  }) => {
    const borderColor = "#1ac47d";
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6} // Adjust the radius as needed
        fill="#ffffff" // Replace with the desired color
        stroke={borderColor}
        strokeWidth={3}
      />
    );
  };

  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: any[];
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip ">
          <h3
            style={{ fontWeight: "700" }}
          >{`${label} : ${payload[0].value}`}</h3>
          <div className="">
            {/* Add your icon component here, for example: */}
            <span className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 11 11"
                fill="none"
              >
                <g clip-path="url(#clip0_3945_25735)">
                  <path
                    d="M5.5 3.66667L3.66667 5.5M5.5 3.66667V7.33333M5.5 3.66667L7.33333 5.5M1.375 5.5C1.375 6.0417 1.4817 6.5781 1.689 7.07857C1.8963 7.57904 2.20014 8.03377 2.58318 8.41682C2.96623 8.79986 3.42096 9.1037 3.92143 9.311C4.4219 9.5183 4.9583 9.625 5.5 9.625C6.0417 9.625 6.5781 9.5183 7.07857 9.311C7.57904 9.1037 8.03377 8.79986 8.41682 8.41682C8.79986 8.03377 9.1037 7.57904 9.311 7.07857C9.5183 6.5781 9.625 6.0417 9.625 5.5C9.625 4.40598 9.1904 3.35677 8.41682 2.58318C7.64323 1.8096 6.59402 1.375 5.5 1.375C4.40598 1.375 3.35677 1.8096 2.58318 2.58318C1.8096 3.35677 1.375 4.40598 1.375 5.5Z"
                    stroke="#4E4E4E"
                    stroke-width="0.916667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3945_25735">
                    <rect width="11" height="11" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Total
            </span>
          </div>
        </div>
      );
    }

    return null;
  };
  console.log("dataArray", dataArray);

  return (
    <div className="chart">
      <div className="title">Charge Sessions</div>
      <ResponsiveContainer>
        <AreaChart
          width={800}
          height={400}
          data={dataArray}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1ac47d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1ac47d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            className="barChartStats"
            style={{
              fill: "rgba(0, 0, 0, 0.40)",
              fontSize: "14px",
              fontWeight: "400",
              fontFamily: "lexend",
            }}
            height={40} // Adjust the height as needed
            tick={{ dy: 10 }}
            padding={{ right: 10 }}
          />
          <YAxis
            style={{
              fill: "rgba(0, 0, 0, 0.40)",
              fontSize: "14px",
              fontWeight: "400",
              marginRight: "20px",
              fontFamily: "lexend",
            }}
            tick={{ dx: -10 }}
            padding={{ top: 20 }}
          />
          <CartesianGrid stroke="#ccccccc5" strokeDasharray="1 1" />
          {/* <Tooltip /> */}
    
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#1ac47d"
            activeDot={<CustomActiveDot />}
            fillOpacity={6}
            strokeWidth={3}
            fill="rgba(255, 255, 255, 0.1)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export default Chart;
