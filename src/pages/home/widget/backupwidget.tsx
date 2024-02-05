import { memo } from "react";
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type widgetProps = {
  type: String;

  data: any;
};

const Widget = memo((props: widgetProps) => {
  const { data, type } = props;
  let content;

  // const diff = 20;
  switch (props.type) {
    case "usage":
      content = {
        title: "Energy Consumed (kWh)",
        thisMonth: data.thisMonth.toFixed(2),
        lastMonth: data.lastMonth.toFixed(2),
        isMoney: false,
        link: "",
        icon: <ElectricalServicesIcon className="icon" />,
      };
      break;
    case "customers":
      content = {
        title: "Customer Enrollments",
        thisMonth: data.thisMonth,
        lastMonth: data.lastMonth,
        icon: <EmojiPeopleIcon className="icon" />,
      };
      break;
    case "billedRevenue":
      content = {
        title: "Billed Revenue (₹)",
        thisMonth: data.thisMonth.toFixed(2),
        lastMonth: data.lastMonth.toFixed(2),
        isMoney: false,
        link: "",
        icon: <AttachMoneyIcon className="icon" />,
      };
      break;
    case "avRevenue":
      content = {
        title: "Average Revenue Per Session (₹)",
        thisMonth: data.thisMonth.toFixed(2),
        lastMonth: data.lastMonth.toFixed(2),
        isMoney: true,
        link: "",
        icon: <PriceChangeIcon className="icon" />,
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{content?.title}</span>
        <span className="counter start">{content?.thisMonth}</span>
        <span className="item ">This month</span>
      </div>

      <div className="right">
        {Math.sign(
          ((content?.thisMonth - content?.lastMonth) / content?.lastMonth) * 100
        ) !== -1 ? (
          <div className="percentage positive">
            <KeyboardArrowUpIcon />
            {(
              ((content?.thisMonth - content?.lastMonth) / content?.lastMonth) *
              100
            ).toFixed(2)}
            %
          </div>
        ) : (
          <div className="percentage negative">
            <KeyboardArrowDownIcon />
            {Math.abs(
              ((content?.thisMonth - content?.lastMonth) / content?.lastMonth) *
                100
            ).toFixed(2)}
            %
          </div>
        )}

        <span className="counter end">{content?.lastMonth}</span>
        <span className="item">Last Month</span>
      </div>
    </div>
  );
});

export default Widget;
