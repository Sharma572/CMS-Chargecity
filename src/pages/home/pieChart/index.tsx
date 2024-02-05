import React, { memo, useState } from "react";
import "./pieChart.scss";
import {
  Tooltip,
  Label,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FaCarrot } from "react-icons/fa";
import { Grid, Stack } from "@mui/material";
interface chartProps {
  type: string;
  data: any[];
}
const XChart = memo((props: chartProps) => {
  const [dataArray, setDataArray] = useState<any | null>(null);
  console.log("total🤞  ", props.type);
  
  const CustomLabel = ({ viewBox, labelText, value }: any) => {
    const { cx, cy } = viewBox;
    
    return (
      <g style={{display:'flex'}}>
      {/* Render the icon */}
      <g transform={`translate(${cx-33},${cy-8})`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 18 18" fill="none">
  <path d="M16.5 9H12.75M12.75 9C12.75 6.375 11.25 3.75 6.75 3.75H5.25V14.25H6.75C11.25 14.25 12.75 11.625 12.75 9ZM1.5 6.75H5.25M1.5 11.25H5.25" stroke="#111111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      </g>
      {/* Render the value */}
      <text
        x={cx+5}
        y={cy+5}
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
       
      >
        {value}
      </text>
    </g>
    );
  };

  const CustomLabelCharger = ({ viewBox, labelText, value }: any) => {
    const { cx, cy } = viewBox;
    
    return (
      <g style={{display:'flex'}}>
      {/* Render the icon */}
      <g transform={`translate(${cx-30},${cy-5})`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 10 10" fill="none">
  <circle cx="5" cy="5" r="5" fill="#FFA38E"/>
  <circle cx="5" cy="5" r="2" fill="#F6F8FA"/>
</svg>
      </g>
      {/* Render the value */}
      <text
        x={cx+5}
        y={cy+5}
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
        alignmentBaseline="middle"
       
      >
        {value}
      </text>
    </g>
    );
  };

  return (
    <div className="pChart">
      <div className="title">{props.type}</div>
      <div className="total_count_container">
        <div className="icon_total">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M9 6L6 9M9 6V12M9 6L12 9M2.25 9C2.25 9.88642 2.42459 10.7642 2.76381 11.5831C3.10303 12.4021 3.60023 13.1462 4.22703 13.773C4.85382 14.3998 5.59794 14.897 6.41689 15.2362C7.23583 15.5754 8.11358 15.75 9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 7.20979 15.0388 5.4929 13.773 4.22703C12.5071 2.96116 10.7902 2.25 9 2.25C7.20979 2.25 5.4929 2.96116 4.22703 4.22703C2.96116 5.4929 2.25 7.20979 2.25 9Z"
              stroke="#111111"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <h2>Total</h2>
        </div>
        <div className="total_count">
          <h1>{props.data.reduce((total, obj) => obj.value + total, 0)}</h1>
        </div>
      </div>

      <div
        className={`newContent ${
          props.type == "Charger Type" && "stats_container_style"
        }`}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={props.data}
              dataKey="value"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
            >
              {props.data.map((item, index) => {
                return <Cell key={`cell-${index}`} fill={item.color} />;
              })}
              <Label
    content={
      props.type !== "Charger Type" ?
      <CustomLabel
        value={props.data.reduce((total, obj) => obj.value + total, 0)}
      />
      :
      <CustomLabelCharger
      value={props.data.reduce((total, obj) => obj.value + total, 0)}
      />
    }
    position="insideBottom"
  />
     
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div
        className={`chartInfo ${
          props.type == "Charger Type" ? "chartTypeStyle" : ""
        }`}
      >
        <Stack direction="column">
          {props.data.map((item, idx) => (
            <li
              className={`flex justify-between ${
                props.type == "Charger Type" && "c_type"
              }`}
              key={idx}
            >
              <div className="ind_container">
                {item.name == "Available" ? (
                  <div className="icon_container">
                    <span className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle cx="5" cy="5" r="5" fill="#6AD3A7" />
                      </svg>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M16.5 9H12.75M12.75 9C12.75 6.375 11.25 3.75 6.75 3.75H5.25V14.25H6.75C11.25 14.25 12.75 11.625 12.75 9ZM1.5 6.75H5.25M1.5 11.25H5.25"
                        stroke="#111111"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  ""
                )}
                {item.name == "Charging" ? (
                  <div className="icon_container">
                    <span className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle cx="5" cy="5" r="5" fill="#8EB5FF" />
                      </svg>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M9.75 2.25V7.5H14.25L8.25 15.75V10.5H3.75L9.75 2.25Z"
                        stroke="#111111"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  ""
                )}
                {item.name == "Out of Order" ? (
                  <div className="icon_container">
                    <span className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle cx="5" cy="5" r="5" fill="#FFA38E" />
                      </svg>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M2.25 2.25L15.75 15.75M11.409 11.4075L8.25 15.75V10.5H3.75L6.5925 6.5925M7.85625 4.8525L9.75 2.25V6.75M10.5 7.5H14.25L12.672 9.66975"
                        stroke="#111111"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  ""
                )}
                {item.name == "Offline" ? (
                  <div className="icon_container">
                    <span className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle cx="5" cy="5" r="5" fill="#FFDF8E" />
                      </svg>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M6.75 9H11.25M2.25 9C2.25 9.88642 2.42459 10.7642 2.76381 11.5831C3.10303 12.4021 3.60023 13.1462 4.22703 13.773C4.85382 14.3998 5.59794 14.897 6.41689 15.2362C7.23583 15.5754 8.11358 15.75 9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 8.11358 15.5754 7.23583 15.2362 6.41689C14.897 5.59794 14.3998 4.85382 13.773 4.22703C13.1462 3.60023 12.4021 3.10303 11.5831 2.76381C10.7642 2.42459 9.88642 2.25 9 2.25C8.11358 2.25 7.23583 2.42459 6.41689 2.76381C5.59794 3.10303 4.85382 3.60023 4.22703 4.22703C3.60023 4.85382 3.10303 5.59794 2.76381 6.41689C2.42459 7.23583 2.25 8.11358 2.25 9Z"
                        stroke="#111111"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  ""
                )}
                {item.name == "Scheduled" ? (
                  <div className="icon_container">
                    <span className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle cx="5" cy="5" r="5" fill="#9E8EFF" />
                      </svg>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M8.625 12.75H3C3.4087 12.5186 3.75736 12.1944 4.01789 11.8036C4.27842 11.4128 4.44356 10.9663 4.5 10.5V8.25C4.54467 7.29831 4.84748 6.3767 5.37596 5.58397C5.90445 4.79124 6.63869 4.15727 7.5 3.75C7.5 3.35218 7.65804 2.97064 7.93934 2.68934C8.22064 2.40804 8.60218 2.25 9 2.25C9.39782 2.25 9.77936 2.40804 10.0607 2.68934C10.342 2.97064 10.5 3.35218 10.5 3.75C11.3613 4.15727 12.0956 4.79124 12.624 5.58397C13.1525 6.3767 13.4553 7.29831 13.5 8.25V10.5C13.512 10.5967 13.5278 10.692 13.5488 10.7865M6.75 12.75V13.5C6.74989 14.0321 6.93833 14.5469 7.28187 14.9532C7.62541 15.3595 8.10182 15.6309 8.6265 15.7192M11.25 14.25L12.75 15.75L15.75 12.75"
                        stroke="#111111"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  ""
                )}
                {/* charge type */}
                {item.name == "AC 3.3kW" ? (
                  <div className="icon_container">
                    <span className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle cx="5" cy="5" r="5" fill="#6AD3A7" />
                      </svg>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {item.name == "AC 7.2kW" ? (
                  <div className="icon_container">
                    <span className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle cx="5" cy="5" r="5" fill="#FFDF8E" />
                      </svg>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {item.name == "AC 22kW" ? (
                  <div className="icon_container">
                    <span className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle cx="5" cy="5" r="5" fill="#FFA38E" />
                      </svg>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {item.name == "DC 30kW" ? (
                  <div className="icon_container">
                    <span className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <circle cx="5" cy="5" r="5" fill="#8EB5FF" />
                      </svg>
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {props.type == "Charger Type" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M3 15L5.625 12.375M11.25 3L8.625 5.625M15 6.75L12.375 9.375M7.33877 4.5L13.5 10.6613L11.9595 12.2017C11.5579 12.6194 11.077 12.9528 10.545 13.1824C10.013 13.412 9.44059 13.5332 8.86119 13.5389C8.28179 13.5445 7.70708 13.4346 7.17067 13.2155C6.63427 12.9964 6.14695 12.6725 5.73724 12.2628C5.32752 11.8531 5.00363 11.3657 4.78452 10.8293C4.56541 10.2929 4.45548 9.71822 4.46116 9.13882C4.46685 8.55942 4.58803 7.98698 4.81762 7.45497C5.0472 6.92297 5.38059 6.4421 5.79827 6.0405L7.33877 4.5Z"
                      stroke="#111111"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
                <div className="flex">
                  <h4 className="mx-2">{item.name}</h4>
                </div>
              </div>
              <h1 className="value_stats">{item.value}</h1>
            </li>
          ))}
        </Stack>
      </div>
    </div>
  );
});

export default XChart;
