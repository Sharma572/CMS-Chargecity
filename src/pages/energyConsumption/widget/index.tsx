import React, { memo, useState, useEffect } from "react";
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { now } from "moment";
import moment from "moment";
import { parse } from "node:path/win32";
type widgetProps = {
  type: String;

  data: any;
};

const Widget = memo((props: widgetProps) => {
  const { type, data } = props;

  let content;

  // const diff = 20;
  switch (props.type) {
    case "revenue":
      content = {
        title: "Total Consumption",
        thisMonth: data.thisMonth.toFixed(2),
        lastMonth: data.lastMonth.toFixed(2),
        total: data.total.toFixed(2) + " " + "kW",
        isMoney: false,
        link: "",
        icon: <AttachMoneyIcon className="icon" />,
      };
      break;
    case "avRevenue":
      content = {
        title: "Average Energy Consumed per Session",
        thisMonth: 0,
        lastMonth: 0,
        total: data.toFixed(2) + " " + "kW",
        isMoney: false,
        link: "",
        icon: <AttachMoneyIcon className="icon" />,
      };
      break;
    case "energy":
      content = {
        title: "Total Cost",
        thisMonth: 0,
        lastMonth: 0,
        total: "₹" + " " + data.toFixed(2),
        isMoney: false,
        link: "",
        icon: <ElectricalServicesIcon className="icon" />,
      };
      break;
    case "land":
      content = {
        title: "Average Cost per kW",
        thisMonth: (50.0345).toFixed(2),
        lastMonth: (20.0345).toFixed(2),
        total: "₹" + " " + data.toFixed(2),
        icon: <EmojiPeopleIcon className="icon" />,
      };
      break;

    case "margin":
      content = {
        title: "Gross Margin",

        total: "₹" + " " + data.toFixed(2),
        isMoney: true,
        link: "",
        icon: <PriceChangeIcon className="icon" />,
      };
      break;
    case "average":
      content = {
        title: "Avg Revenue per Session",
        thisMonth: data.thisMonth,
        lastMonth: data.lastMonth,
        total: data.total,
        isMoney: true,
        link: "",
        icon: <PriceChangeIcon className="icon" />,
      };
      break;
    default:
      break;
  }
  return (
    <div className="revenue-widget-container">
      <div className="title">{content?.title}</div>
      <span className="content">{content?.total}</span>
    </div>
  );
});

export default Widget;
