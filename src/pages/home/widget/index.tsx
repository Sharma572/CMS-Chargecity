import { memo } from "react";
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
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
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M16 7H17C17.5304 7 18.0391 7.21071 18.4142 7.58579C18.7893 7.96086 19 8.46957 19 9V9.5C19 9.63261 19.0527 9.75979 19.1464 9.85355C19.2402 9.94732 19.3674 10 19.5 10C19.6326 10 19.7598 10.0527 19.8536 10.1464C19.9473 10.2402 20 10.3674 20 10.5V13.5C20 13.6326 19.9473 13.7598 19.8536 13.8536C19.7598 13.9473 19.6326 14 19.5 14C19.3674 14 19.2402 14.0527 19.1464 14.1464C19.0527 14.2402 19 14.3674 19 14.5V15C19 15.5304 18.7893 16.0391 18.4142 16.4142C18.0391 16.7893 17.5304 17 17 17H15M8 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V15C4 15.5304 4.21071 16.0391 4.58579 16.4142C4.96086 16.7893 5.46957 17 6 17H7M12 8L10 12H13L11 16" stroke="#354052" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>,
      };
      break;
    case "customers":
      content = {
        title: "Customer Enrollments",
        thisMonth: data.thisMonth,
        lastMonth: data.lastMonth,
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 22 22" fill="none">
        <path d="M19.2354 11.4913C19.335 9.82122 18.9245 8.16037 18.0584 6.72901C17.1923 5.29765 15.9115 4.16343 14.3859 3.47682C12.8603 2.7902 11.162 2.58364 9.51625 2.88453C7.87053 3.18542 6.35517 3.97954 5.17121 5.16155C3.98724 6.34356 3.19061 7.85759 2.887 9.50281C2.58338 11.148 2.78714 12.8467 3.47122 14.3734C4.15531 15.9002 5.28741 17.1829 6.71733 18.0513C8.14725 18.9198 9.80742 19.333 11.4776 19.2362M17.4167 20.1666V14.6666M17.4167 14.6666L20.1667 17.4166M17.4167 14.6666L14.6667 17.4166M8.25006 9.16659H8.25922M13.7501 9.16659H13.7592M8.70839 13.7499C9.31156 14.3366 10.1384 14.6666 11.0001 14.6666C11.8617 14.6666 12.6886 14.3366 13.2917 13.7499" stroke="#354052" stroke-width="1.83333" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>,
      };
      break;
    case "billedRevenue":
      content = {
        title: "Billed Revenue (₹)",
        thisMonth: data.thisMonth.toFixed(2),
        lastMonth: data.lastMonth.toFixed(2),
        isMoney: false,
        link: "",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M15 8H9H10C10.7956 8 11.5587 8.31607 12.1213 8.87868C12.6839 9.44129 13 10.2044 13 11C13 11.7956 12.6839 12.5587 12.1213 13.1213C11.5587 13.6839 10.7956 14 10 14H9L12 17M9 11H15M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z" stroke="#354052" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>,
      };
      break;
    case "avRevenue":
      content = {
        title: "Avg. Revenue Per Session",
        thisMonth: data.thisMonth.toFixed(2),
        lastMonth: data.lastMonth.toFixed(2),
        isMoney: true,
        link: "",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M11 7C11 8.06087 10.5786 9.07828 9.82843 9.82843C9.07828 10.5786 8.06087 11 7 11C5.93913 11 4.92172 10.5786 4.17157 9.82843C3.42143 9.07828 3 8.06087 3 7C3 5.93913 3.42143 4.92172 4.17157 4.17157C4.92172 3.42143 5.93913 3 7 3M11 7C11 5.93913 10.5786 4.92172 9.82843 4.17157C9.07828 3.42143 8.06087 3 7 3M11 7H7V3M9 17V21M17 14V21M13 13V21M21 12V21" stroke="#354052" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>,
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
        <div className="title_container">
          <span style={{borderRadius:'8px',background:'#E3E8FA',padding:'7px'}} className="icon_bg title">
          {content?.icon}  
          </span> 
          <span className="card_heading">
          {content?.title}
          {Math.sign(
          ((content?.thisMonth - content?.lastMonth) / content?.lastMonth) * 100
        ) !== -1 ? (
          <div className="percentage positive mt-1">
          <FaArrowTrendUp className="mr-2" />
            {(
              ((content?.thisMonth - content?.lastMonth) / content?.lastMonth) *
              100
            ).toFixed(2)}
            %
          </div>
        ) : (
          <div className="percentage negative mt-1">
            <FaArrowTrendDown className="mr-2" />
            {Math.abs(
              ((content?.thisMonth - content?.lastMonth) / content?.lastMonth) *
                100
            ).toFixed(2)}
            %
          </div>
        )}
          </span>
          </div>
          <div className="container_month">
          <div className="left_first">
        <span className="counter start">{content?.thisMonth}</span>
        <span className="item ">This month</span>
      </div>

      <div className="right_last">
        <span className="counter end">{content?.lastMonth}</span>
        <span className="item">Last Month</span>
      </div>
          </div>
      
    </div>
  );
});

export default Widget;
