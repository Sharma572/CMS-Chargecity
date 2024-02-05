import React, { memo } from "react";
import "./widget.scss";

import PriceChangeIcon from "@mui/icons-material/PriceChange";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

type widgetProps = {
  type: String;

  data: any;
};

const Widget = memo((props: widgetProps) => {
  const { type, data } = props;

  let content;

  // const diff = 20;
  switch (type) {
    case "wallet":
      content = {
        title: "Wallet Balance",

        total: `₹ ${String(data.total.toFixed(2))}`,
        isMoney: false,
        link: "",
        icon: <ElectricalServicesIcon className="icon" />,
      };
      break;
    case "revenue":
      content = {
        title: "Revenue",
        total: data.total === null ? "-" : `₹ ${String(data.total.toFixed(2))}`,
        icon: <EmojiPeopleIcon className="icon" />,
      };
      break;
    case "transaction":
      content = {
        title: "Transaction",

        total: data.total,
        isMoney: false,
        link: "",
        icon: <AttachMoneyIcon className="icon" />,
      };
      break;
    case "avRevenue":
      content = {
        title: "Average Revenue Per Customer(₹)",
        thisMonth: data.thisMonth.toFixed(2),
        lastMonth: data.lastMonth.toFixed(2),
        total: data.total,
        isMoney: true,
        link: "",
        icon: <PriceChangeIcon className="icon" />,
      };
      break;
    case "uniqueUsers":
      content = {
        title: "Unique Users",
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
    <div className="csWidget">
      <div className="title">{content?.title}</div>

      <span className="content"> {content?.total}</span>
    </div>
  );
});

export default Widget;
