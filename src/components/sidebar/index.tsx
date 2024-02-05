import React, { memo, useEffect, useState } from "react";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { AnimatePresence, motion } from "framer-motion";
import { IoEarthOutline } from "react-icons/io5";
import { GrUserWorker } from "react-icons/gr";
import { FaAngleDown } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import PushPinIcon from "@mui/icons-material/PushPin";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import ElectricMeterOutlinedIcon from "@mui/icons-material/ElectricMeterOutlined";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import "./sidebar.scss";
import Collapse from "@mui/material/Collapse";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import MapIcon from "@mui/icons-material/Map";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import myImg from "../../icons/logo.png";
import mainLogo from "../../icons/main.png";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MenuIcon from "@mui/icons-material/Menu";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import FactoryIcon from "@mui/icons-material/Factory";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { useAppSelector } from "../../store/store";
import Tooltip from "@mui/material/Tooltip";
import { useLocation } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import DriveEtaOutlinedIcon from "@mui/icons-material/DriveEtaOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
const Sidebar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [sideBarCollapse, setSideBarCollapse] = useState({
    dashboard: true,
    stations: true,
    electricVehicles: true,
    quickMenu: true,
    crmTools: true,
    adminTools: true,
    analytics: true,
  });
  let userDetail: any = localStorage.getItem("user-details");
  let allRoles = localStorage.getItem("roles");
  const location = useLocation();
  useEffect(() => {
    if (isOpen) {
      setSideBarCollapse({
        dashboard: true,
        stations: true,
        electricVehicles: true,
        quickMenu: true,
        crmTools: true,
        adminTools: true,
        analytics: true,
      });
    }
  }, [isOpen]);

  return (
    <motion.div
      className={isOpen ? "sidebar" : "sideber-short"}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* // <div className={isOpen ? "sidebar" : "sideber-short"}> */}
      <div className="top">
        <img src={myImg} className="logo" />

        <CloseOutlinedIcon
          className="upperIcon"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          sx={{
            background: "rgba(26, 196, 125, 0.10)",
            borderRadius: "7px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "8px",
          }}
          fontSize="large"
        />
      </div>

      <div className="center">
        <ul>
          {!isOpen ? (
            <>
              <li
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "13px",
                  cursor:'pointer'
                }}
              >
                {" "}
                <MenuIcon
                  style={{
                    color: `${
                      location.pathname === "/cpo" ? "#1ac47d" : "#111"
                    }`,
                  }}
                  className="menuIcon"
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setSideBarCollapse({
                      dashboard: false,
                      stations: false,
                      electricVehicles: false,
                      quickMenu: false,
                      crmTools: false,
                      adminTools: false,
                      analytics: false,
                    });
                  }}
                />
              </li>
              <li style={{display:'flex',justifyContent:'center'}}>
                <img style={{maxWidth:'54%'}} src={mainLogo} alt="main logo" />
              </li>{" "}
            </>
          ) : (
            ""
          )}
          {(allRoles?.includes("Home") ||
            allRoles?.includes("Charge Sessions")) && (
            <p
              className="title"
              onClick={() => {
                setSideBarCollapse({
                  ...sideBarCollapse,
                  dashboard: !sideBarCollapse.dashboard,
                });
              }}
            >
              Dashboard{" "}
            </p>
          )}
          <Collapse in={sideBarCollapse.dashboard} timeout="auto" unmountOnExit>
            {allRoles?.includes("Home") && (
              <li
                className={
                  location.pathname === "/home" ? "list-selected" : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Home</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/home"
                    style={{
                      textDecoration: "none",
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    {/* <DashboardIcon className="icon" /> */}

                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M9 9L4.125 13.125M9 9V2.25M9 9H15.75M9 2.25C9.88642 2.25 10.7642 2.42459 11.5831 2.76381C12.4021 3.10303 13.1462 3.60023 13.773 4.22703C14.3998 4.85382 14.897 5.59794 15.2362 6.41689C15.5754 7.23583 15.75 8.11358 15.75 9M9 2.25C8.11358 2.25 7.23583 2.42459 6.41689 2.76381C5.59794 3.10303 4.85382 3.60023 4.22703 4.22703C3.60023 4.85382 3.10303 5.59794 2.76381 6.41689C2.42459 7.23583 2.25 8.11358 2.25 9C2.25 9.88642 2.42459 10.7642 2.76381 11.5831C3.10303 12.4021 3.60023 13.1462 4.22703 13.773C4.85382 14.3998 5.59794 14.897 6.41689 15.2362C7.23583 15.5754 8.11358 15.75 9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9"
                        stroke={
                          location.pathname === "/home" ? "#1AC47D" : "#111"
                        }
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="ml-2">Home</span>
                  </Link>
                </Tooltip>
              </li>
            )}
            {allRoles?.includes("Charge Sessions") && (
              <li
                className={
                  location.pathname === "/charge-session"
                    ? "list-selected"
                    : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Charge Sessions</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/charge-session"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    {/* <EvStationIcon className="icon" /> */}

                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M3 6.75C3 6.35218 3.15804 5.97064 3.43934 5.68934C3.72064 5.40804 4.10218 5.25 4.5 5.25H12.75C13.1478 5.25 13.5294 5.40804 13.8107 5.68934C14.092 5.97064 14.25 6.35218 14.25 6.75V7.125C14.25 7.22446 14.2895 7.31984 14.3598 7.39017C14.4302 7.46049 14.5255 7.5 14.625 7.5C14.7245 7.5 14.8198 7.53951 14.8902 7.60983C14.9605 7.68016 15 7.77554 15 7.875V10.125C15 10.2245 14.9605 10.3198 14.8902 10.3902C14.8198 10.4605 14.7245 10.5 14.625 10.5C14.5255 10.5 14.4302 10.5395 14.3598 10.6098C14.2895 10.6802 14.25 10.7755 14.25 10.875V11.25C14.25 11.6478 14.092 12.0294 13.8107 12.3107C13.5294 12.592 13.1478 12.75 12.75 12.75H9.375M4.5 16.5V14.25M3 11.25V9.375M6 11.25V9.375M2.25 11.25H6.75V12.75C6.75 13.1478 6.59196 13.5294 6.31066 13.8107C6.02936 14.092 5.64782 14.25 5.25 14.25H3.75C3.35218 14.25 2.97064 14.092 2.68934 13.8107C2.40804 13.5294 2.25 13.1478 2.25 12.75V11.25Z"
                        stroke={
                          location.pathname === "/charge-session"
                            ? "#1AC47D"
                            : "#111"
                        }
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="ml-2">Charge Sessions</span>
                  </Link>
                </Tooltip>
              </li>
            )}
          </Collapse>
        </ul>
        <ul>
          {(allRoles?.includes("Users") ||
            allRoles?.includes("Transactions") ||
            allRoles?.includes("Reports") ||
            allRoles?.includes("Bookings") ||
            allRoles?.includes("Invoices")) && (
            <p
              className="title"
              onClick={() => {
                setSideBarCollapse({
                  ...sideBarCollapse,
                  quickMenu: !sideBarCollapse.quickMenu,
                });
              }}
            >
              Quick Menu
            </p>
          )}
          <Collapse in={sideBarCollapse.quickMenu} timeout="auto" unmountOnExit>
            {allRoles?.includes("Users") && (
              <li
                className={
                  location.pathname === "/users" ? "list-selected" : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Users</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/users"
                    style={{
                      textDecoration: "none",
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    {/* <PeopleIcon className="icon" /> */}
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.7067 9.76351C15.8614 8.40465 15.5997 7.03086 14.9562 5.82407C14.3127 4.61728 13.3178 3.63442 12.1033 3.00566C10.8888 2.3769 9.51188 2.1319 8.15501 2.3031C6.79814 2.47431 5.52528 3.05365 4.505 3.96439C3.48472 4.87513 2.76516 6.07431 2.44161 7.40312C2.11807 8.73192 2.20579 10.1277 2.69318 11.4055C3.18056 12.6833 4.04461 13.783 5.17089 14.5588C6.29717 15.3346 7.63255 15.75 9.00018 15.75M6.75018 7.50001H6.75768M11.2502 7.50001H11.2577M7.12518 11.25C7.61868 11.754 8.29518 12 9.00018 12C9.15993 12 9.31818 11.9873 9.47268 11.9625M12.0002 16.5L15.7502 12.75M15.7502 12.75V16.125M15.7502 12.75H12.3752"
                        stroke={
                          location.pathname === "/users" ? "#1AC47D" : "#111"
                        }
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="ml-2">Users</span>
                  </Link>
                </Tooltip>
              </li>
            )}

            {allRoles?.includes("Transactions") && (
              <li
                className={
                  location.pathname === "/transaction"
                    ? "list-selected"
                    : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Transactions</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/transaction"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    {" "}
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M2.25 6L5.25 3M5.25 3L8.25 6M5.25 3V9.75M9.75 12L12.75 15M12.75 15L15.75 12M12.75 15V7.5"
                        stroke={
                          location.pathname === "/transaction"
                            ? "#1AC47D"
                            : "#111"
                        }
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="sideOption ml-2">Transactions</span>
                  </Link>
                </Tooltip>
              </li>
            )}

            {allRoles?.includes("Reports") && (
              <li
                className={
                  location.pathname === "/report" ? "list-selected" : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Reports</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/report"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M6.75 3.75H5.25C4.85218 3.75 4.47064 3.90804 4.18934 4.18934C3.90804 4.47064 3.75 4.85218 3.75 5.25V14.25C3.75 14.6478 3.90804 15.0294 4.18934 15.3107C4.47064 15.592 4.85218 15.75 5.25 15.75H12.75C13.1478 15.75 13.5294 15.592 13.8107 15.3107C14.092 15.0294 14.25 14.6478 14.25 14.25V5.25C14.25 4.85218 14.092 4.47064 13.8107 4.18934C13.5294 3.90804 13.1478 3.75 12.75 3.75H11.25M6.75 3.75C6.75 3.35218 6.90804 2.97064 7.18934 2.68934C7.47064 2.40804 7.85218 2.25 8.25 2.25H9.75C10.1478 2.25 10.5294 2.40804 10.8107 2.68934C11.092 2.97064 11.25 3.35218 11.25 3.75M6.75 3.75C6.75 4.14782 6.90804 4.52936 7.18934 4.81066C7.47064 5.09196 7.85218 5.25 8.25 5.25H9.75C10.1478 5.25 10.5294 5.09196 10.8107 4.81066C11.092 4.52936 11.25 4.14782 11.25 3.75M6.75 9H6.7575M9.75 9H11.25M6.75 12H6.7575M9.75 12H11.25"
                        stroke={
                          location.pathname === "/report" ? "#1AC47D" : "#111"
                        }
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="sideOption ml-2">Reports</span>
                  </Link>
                </Tooltip>
              </li>
            )}
            {allRoles?.includes("Invoices") && (
              <li
                className={
                  location.pathname === "/invoice" ? "list-selected" : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Invoices</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/invoice"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <InsertDriveFileOutlinedIcon
                      style={{
                        color: `${
                          location.pathname === "/invoice" ? "#1ac47d" : "#111"
                        }`,
                      }}
                      className={`icon `}
                    />
                    <span className="sideOption ml-2">Invoices</span>
                  </Link>
                </Tooltip>
              </li>
            )}
            {allRoles?.includes("Bookings") && (
              <li
                className={
                  location.pathname === "/bookings" ? "list-selected" : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Bookings</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/bookings"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M6.375 7.125C6.78921 7.125 7.125 6.78921 7.125 6.375C7.125 5.96079 6.78921 5.625 6.375 5.625C5.96079 5.625 5.625 5.96079 5.625 6.375C5.625 6.78921 5.96079 7.125 6.375 7.125Z"
                        fill="black"
                      />
                      <path
                        d="M6.375 7.125C6.78921 7.125 7.125 6.78921 7.125 6.375C7.125 5.96079 6.78921 5.625 6.375 5.625C5.96079 5.625 5.625 5.96079 5.625 6.375C5.625 6.78921 5.96079 7.125 6.375 7.125Z"
                        stroke={
                          location.pathname === "/bookings" ? "#1AC47D" : "#111"
                        }
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 5.25V8.14425C3 8.547 3.15975 8.93325 3.44475 9.21825L9.53175 15.3052C9.67278 15.4463 9.84022 15.5582 10.0245 15.6345C10.2088 15.7109 10.4063 15.7502 10.6057 15.7502C10.8052 15.7502 11.0027 15.7109 11.187 15.6345C11.3713 15.5582 11.5387 15.4463 11.6797 15.3052L15.3052 11.6797C15.4463 11.5387 15.5582 11.3713 15.6345 11.187C15.7109 11.0027 15.7502 10.8052 15.7502 10.6057C15.7502 10.4063 15.7109 10.2088 15.6345 10.0245C15.5582 9.84022 15.4463 9.67278 15.3052 9.53175L9.2175 3.44475C8.93283 3.16012 8.5468 3.00016 8.14425 3H5.25C4.65326 3 4.08097 3.23705 3.65901 3.65901C3.23705 4.08097 3 4.65326 3 5.25Z"
                        stroke={
                          location.pathname === "/bookings" ? "#1AC47D" : "#111"
                        }
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="sideOption ml-2">Bookings</span>
                  </Link>
                </Tooltip>
              </li>
            )}
          </Collapse>
        </ul>
        <ul>
          {(allRoles?.includes("Station List") ||
            allRoles?.includes("Station Map")) && (
            <p
              className="title"
              onClick={() => {
                setSideBarCollapse({
                  ...sideBarCollapse,
                  stations: !sideBarCollapse.stations,
                });
              }}
            >
              Stations
            </p>
          )}
          <Collapse in={sideBarCollapse.stations} timeout="auto" unmountOnExit>
            {allRoles?.includes("Station List") && (
              <li
                className={
                  location.pathname === "/station-list"
                    ? "list-selected"
                    : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Lists</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/station-list"
                    style={{
                      textDecoration: "none",
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M10.0603 15.6751C9.77905 15.9561 9.39775 16.1139 9.00018 16.1139C8.60262 16.1139 8.22132 15.9561 7.94006 15.6751L4.75706 12.4928C4.03629 11.772 3.51107 10.8793 3.23096 9.89919C2.95085 8.91904 2.92508 7.88368 3.15609 6.89081C3.3871 5.89794 3.86726 4.98029 4.55128 4.22446C5.2353 3.46863 6.10061 2.89954 7.06556 2.57088C8.03052 2.24222 9.06331 2.16484 10.0665 2.34603C11.0696 2.52722 12.0101 2.96101 12.7991 3.60647C13.5881 4.25193 14.1997 5.08777 14.576 6.03513C14.9524 6.98249 15.0812 8.01013 14.9503 9.02108M14.2498 12.0001L12.7498 14.2501H15.7498L14.2498 16.5001M6.74982 8.25008C6.74982 8.84682 6.98687 9.41911 7.40883 9.84107C7.83078 10.263 8.40308 10.5001 8.99982 10.5001C9.59655 10.5001 10.1689 10.263 10.5908 9.84107C11.0128 9.41911 11.2498 8.84682 11.2498 8.25008C11.2498 7.65334 11.0128 7.08105 10.5908 6.65909C10.1689 6.23713 9.59655 6.00008 8.99982 6.00008C8.40308 6.00008 7.83078 6.23713 7.40883 6.65909C6.98687 7.08105 6.74982 7.65334 6.74982 8.25008Z"
                        stroke="#354052"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="ml-2">List</span>
                  </Link>
                </Tooltip>
              </li>
            )}
            {allRoles?.includes("Station Map") && (
              <li
                className={
                  location.pathname === "/station-map"
                    ? "list-selected"
                    : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Map</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/station-map"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <MapOutlinedIcon
                      style={{
                        color: `${
                          location.pathname === "/station-map"
                            ? "#1ac47d"
                            : "#111"
                        }`,
                        background: `${
                          location.pathname === "/station-map" ? "red" : "white"
                        }`,
                      }}
                      className="icon"
                    />
                    <span className="ml-2">Map</span>
                  </Link>
                </Tooltip>
              </li>
            )}
          </Collapse>
        </ul>

        <ul>
          {(allRoles?.includes("Vehicles") ||
            allRoles?.includes("Manufacturers")) && (
            <p
              className="title"
              onClick={() => {
                setSideBarCollapse({
                  ...sideBarCollapse,
                  electricVehicles: !sideBarCollapse.electricVehicles,
                });
              }}
            >
              Electric Vehicles
            </p>
          )}
          <Collapse
            in={sideBarCollapse.electricVehicles}
            timeout="auto"
            unmountOnExit
          >
            {allRoles?.includes("Vehicles") && (
              <li
                className={
                  location.pathname === "/Ev's" ? "list-selected" : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Vehicles</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/Ev's"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <DriveEtaOutlinedIcon
                      style={{
                        color: `${
                          location.pathname === "/Ev's" ? "#1ac47d" : "#111"
                        }`,
                      }}
                      className="icon"
                    />
                    <span className="sideOption ml-2">Vehicles </span>
                  </Link>
                </Tooltip>
              </li>
            )}
            {allRoles?.includes("Manufacturers") && (
              <li
                className={
                  location.pathname === "/Vendors" ? "list-selected" : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Manufaturers</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/Vendors"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <FactoryOutlinedIcon
                      style={{
                        color: `${
                          location.pathname === "/Vendors" ? "#1ac47d" : "#111"
                        }`,
                      }}
                      className="icon"
                    />
                    <span className="sideOption ml-2">Manufaturers</span>
                  </Link>
                </Tooltip>
              </li>
            )}
          </Collapse>
        </ul>

        <ul>
          {(allRoles?.includes("Revenue") ||
            allRoles?.includes("Energy Consumption")) && (
            <p
              className="title"
              onClick={() => {
                setSideBarCollapse({
                  ...sideBarCollapse,
                  analytics: !sideBarCollapse.analytics,
                });
              }}
            >
              Analytics
            </p>
          )}
          <Collapse in={sideBarCollapse.analytics} timeout="auto" unmountOnExit>
            {allRoles?.includes("Revenue") && (
              <li
                className={
                  location.pathname === "/revenue" ? "list-selected" : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Revenue</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/revenue"
                    style={{
                      textDecoration: "none",
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    {/* <AnalyticsOutlinedIcon
                      style={{
                        color: `${
                          location.pathname === "/revenue" ? "#1ac47d" : "#111"
                        }`,
                      }}
                      className="icon "
                    /> */}
                    <svg
                      className="icon "
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M13.5 3.75H5.25H7.5C8.29565 3.75 9.05871 4.06607 9.62132 4.62868C10.1839 5.19129 10.5 5.95435 10.5 6.75C10.5 7.54565 10.1839 8.30871 9.62132 8.87132C9.05871 9.43393 8.29565 9.75 7.5 9.75H5.25L9.75 14.25M5.25 6.75H13.5"
                        stroke="#354052"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="ml-2">Revenue</span>
                  </Link>
                </Tooltip>
              </li>
            )}
            {allRoles?.includes("Energy Consumption") && (
              <li
                className={
                  location.pathname === "/energy-consumption"
                    ? "list-selected"
                    : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Energy Consumption</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/energy-consumption"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    {/* <ElectricMeterOutlinedIcon
                      style={{
                        color: `${
                          location.pathname === "/energy-consumption"
                            ? "#1ac47d"
                            : "#111"
                        }`,
                      }}
                      className="icon "
                    /> */}
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M3 6.75C3 6.35218 3.15804 5.97064 3.43934 5.68934C3.72064 5.40804 4.10218 5.25 4.5 5.25H12.75C13.1478 5.25 13.5294 5.40804 13.8107 5.68934C14.092 5.97064 14.25 6.35218 14.25 6.75V7.125C14.25 7.22446 14.2895 7.31984 14.3598 7.39017C14.4302 7.46049 14.5255 7.5 14.625 7.5C14.7245 7.5 14.8198 7.53951 14.8902 7.60983C14.9605 7.68016 15 7.77554 15 7.875V10.125C15 10.2245 14.9605 10.3198 14.8902 10.3902C14.8198 10.4605 14.7245 10.5 14.625 10.5C14.5255 10.5 14.4302 10.5395 14.3598 10.6098C14.2895 10.6802 14.25 10.7755 14.25 10.875V11.25C14.25 11.6478 14.092 12.0294 13.8107 12.3107C13.5294 12.592 13.1478 12.75 12.75 12.75H8.625M2.25 12.75H3.99975C5.9325 12.75 7.5 11.0228 7.5 8.89275V8.25H5.75025C3.8175 8.25 2.25 9.97725 2.25 12.1072V12.75ZM2.25 12.75V15"
                        stroke="#354052"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="ml-2">Energy Consumption</span>
                  </Link>
                </Tooltip>
              </li>
            )}
          </Collapse>
        </ul>

        <ul>
          {(allRoles?.includes("Push Notifications") ||
            allRoles?.includes("Promocodes")) && (
            <p
              className="title"
              onClick={() => {
                setSideBarCollapse({
                  ...sideBarCollapse,
                  crmTools: !sideBarCollapse.crmTools,
                });
              }}
            >
              CRM Tools
            </p>
          )}
          <Collapse in={sideBarCollapse.crmTools} timeout="auto" unmountOnExit>
            {allRoles?.includes("Push Notifications") && (
              <li
                className={
                  location.pathname === "/push-notification"
                    ? "list-selected"
                    : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Push Notifications</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/push-notification"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="23"
                      viewBox="0 0 24 23"
                      fill="none"
                    >
                      <path
                        d="M9.20988 16.1299V17.0599C9.20988 17.7998 9.50383 18.5095 10.0271 19.0327C10.5503 19.5559 11.2599 19.8499 11.9999 19.8499C12.7398 19.8499 13.4495 19.5559 13.9727 19.0327C14.4959 18.5095 14.7899 17.7998 14.7899 17.0599V16.1299M20.3699 6.57597C19.7599 5.2491 18.874 4.06748 17.7715 3.10986M3.62988 6.57597C4.23936 5.24927 5.12453 4.06767 6.22644 3.10986M10.1399 4.96986C10.1399 4.47656 10.3358 4.00346 10.6847 3.65464C11.0335 3.30583 11.5066 3.10986 11.9999 3.10986C12.4932 3.10986 12.9663 3.30583 13.3151 3.65464C13.6639 4.00346 13.8599 4.47656 13.8599 4.96986C14.9279 5.47488 15.8384 6.26101 16.4937 7.24399C17.149 8.22698 17.5245 9.36976 17.5799 10.5499V13.3399C17.6499 13.9181 17.8546 14.4717 18.1777 14.9563C18.5008 15.4409 18.9331 15.8429 19.4399 16.1299H4.55988C5.06668 15.8429 5.49901 15.4409 5.82207 14.9563C6.14513 14.4717 6.3499 13.9181 6.41988 13.3399V10.5499C6.47527 9.36976 6.85075 8.22698 7.50608 7.24399C8.1614 6.26101 9.07186 5.47488 10.1399 4.96986Z"
                        stroke="#111111"
                        stroke-width="1.488"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="sideOption ml-2">Push Notifications</span>
                  </Link>
                </Tooltip>
              </li>
            )}
            {allRoles?.includes("Promocodes") && (
              <li
                className={
                  location.pathname === "/promocode" ? "list-selected" : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Promo Code</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/promocode"
                    style={{
                      textDecoration: "none",
                      margin: 0,
                      padding: 0,
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="23"
                      viewBox="0 0 24 23"
                      fill="none"
                    >
                      <path
                        d="M9.21018 14.3898L14.7902 8.80976M10.1402 9.27476C10.1402 9.53158 9.93199 9.73976 9.67518 9.73976C9.41837 9.73976 9.21018 9.53158 9.21018 9.27476C9.21018 9.01795 9.41837 8.80976 9.67518 8.80976C9.93199 8.80976 10.1402 9.01795 10.1402 9.27476ZM14.7902 13.9248C14.7902 14.1816 14.582 14.3898 14.3252 14.3898C14.0684 14.3898 13.8602 14.1816 13.8602 13.9248C13.8602 13.668 14.0684 13.4598 14.3252 13.4598C14.582 13.4598 14.7902 13.668 14.7902 13.9248ZM5.49016 7.13576C5.49016 6.59313 5.70572 6.07272 6.08941 5.68902C6.47311 5.30532 6.99352 5.08976 7.53615 5.08976H8.46615C9.00639 5.08946 9.52458 4.87549 9.90766 4.49456L10.5587 3.84356C10.7488 3.65236 10.9748 3.50062 11.2238 3.39708C11.4728 3.29354 11.7398 3.24023 12.0095 3.24023C12.2791 3.24023 12.5461 3.29354 12.7951 3.39708C13.0441 3.50062 13.2701 3.65236 13.4603 3.84356L14.1113 4.49456C14.4943 4.87549 15.0125 5.08946 15.5528 5.08976H16.4828C17.0254 5.08976 17.5458 5.30532 17.9295 5.68902C18.3132 6.07272 18.5288 6.59313 18.5288 7.13576V8.06576C18.5291 8.606 18.743 9.12419 19.124 9.50726L19.775 10.1583C19.9662 10.3484 20.1179 10.5745 20.2214 10.8234C20.325 11.0724 20.3783 11.3394 20.3783 11.6091C20.3783 11.8787 20.325 12.1457 20.2214 12.3947C20.1179 12.6437 19.9662 12.8697 19.775 13.0599L19.124 13.7109C18.743 14.0939 18.5291 14.6121 18.5288 15.1524V16.0824C18.5288 16.625 18.3132 17.1454 17.9295 17.5291C17.5458 17.9128 17.0254 18.1284 16.4828 18.1284H15.5528C15.0125 18.1287 14.4943 18.3426 14.1113 18.7236L13.4603 19.3746C13.2701 19.5658 13.0441 19.7175 12.7951 19.821C12.5461 19.9246 12.2791 19.9779 12.0095 19.9779C11.7398 19.9779 11.4728 19.9246 11.2238 19.821C10.9748 19.7175 10.7488 19.5658 10.5587 19.3746L9.90766 18.7236C9.52458 18.3426 9.00639 18.1287 8.46615 18.1284H7.53615C6.99352 18.1284 6.47311 17.9128 6.08941 17.5291C5.70572 17.1454 5.49016 16.625 5.49016 16.0824V15.1524C5.48985 14.6121 5.27589 14.0939 4.89496 13.7109L4.24396 13.0599C4.05275 12.8697 3.90101 12.6437 3.79747 12.3947C3.69393 12.1457 3.64062 11.8787 3.64062 11.6091C3.64063 11.3394 3.69393 11.0724 3.79747 10.8234C3.90101 10.5745 4.05275 10.3484 4.24396 10.1583L4.89496 9.50726C5.27589 9.12419 5.48985 8.606 5.49016 8.06576V7.13576Z"
                        stroke="#111111"
                        stroke-width="1.488"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="sideOption ml-2">Promo Code </span>
                  </Link>
                </Tooltip>
              </li>
            )}
          </Collapse>
        </ul>
        <ul>
          {(allRoles?.includes("Create CPO") ||
            allRoles?.includes("Assign Roles")) && (
            <p
              className="title"
              onClick={() => {
                setSideBarCollapse({
                  ...sideBarCollapse,
                  adminTools: !sideBarCollapse.adminTools,
                });
              }}
            >
              Admin Tools
            </p>
          )}
          <Collapse
            in={sideBarCollapse.adminTools}
            timeout="auto"
            unmountOnExit
          >
            {allRoles?.includes("Create CPO") && (
              <li
                className={
                  location.pathname === "/cpo" ? "list-selected" : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>cpo</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/cpo"
                    style={{
                      textDecoration: "none",
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <GrUserWorker
                      className="icon"
                      style={{
                        color: `${
                          location.pathname === "/cpo" ? "#1ac47d" : "#111"
                        }`,
                      }}
                    />
                    <span className="ml-2">Create CPO</span>
                  </Link>
                </Tooltip>
              </li>
            )}
            {allRoles?.includes("Assign Roles") && (
              <li
                className={
                  location.pathname === "/assign-roles"
                    ? "list-selected"
                    : "list"
                }
              >
                <Tooltip
                  title={<h2 style={{ color: "white" }}>Assign Roles</h2>}
                  placement="right-end"
                >
                  <Link
                    to="/assign-roles"
                    style={{
                      textDecoration: "none",
                      width: isOpen ? "200px" : "",
                    }}
                    className="sideOption"
                  >
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M4.5 15.75V14.25C4.5 13.4544 4.81607 12.6913 5.37868 12.1287C5.94129 11.5661 6.70435 11.25 7.5 11.25H10.5M11.25 14.25L12.75 15.75L15.75 12.75M6 5.25C6 6.04565 6.31607 6.80871 6.87868 7.37132C7.44129 7.93393 8.20435 8.25 9 8.25C9.79565 8.25 10.5587 7.93393 11.1213 7.37132C11.6839 6.80871 12 6.04565 12 5.25C12 4.45435 11.6839 3.69129 11.1213 3.12868C10.5587 2.56607 9.79565 2.25 9 2.25C8.20435 2.25 7.44129 2.56607 6.87868 3.12868C6.31607 3.69129 6 4.45435 6 5.25Z"
                        stroke="#354052"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span className="sideOption ml-2">Assign Roles</span>
                  </Link>
                </Tooltip>
              </li>
            )}
            <li
              className={
                location.pathname === "/new-dash" ? "list-selected" : "list"
              }
            >
              <Tooltip
                title={<h2 style={{ color: "white" }}>Roaming</h2>}
                placement="right-end"
              >
                <Link
                  to="/new-dash"
                  style={{
                    textDecoration: "none",
                    width: isOpen ? "200px" : "",
                  }}
                  className="sideOption"
                >
                  <IoEarthOutline
                    style={{
                      color: `${
                        location.pathname === "/new-dash" ? "#1ac47d" : "#111"
                      }`,
                    }}
                    className="icon"
                  />

                  <span className="sideOption ml-2">Roaming</span>
                </Link>
              </Tooltip>
            </li>
          </Collapse>
        </ul>
        <br />
        <br />
      <ul>
          <li className="list">
            <Tooltip
              title={
                <h2 style={{ color: "white" }}>
                  {" "}
                  {JSON.parse(userDetail)?.userName}
                </h2>
              }
              placement="right-end"
            >
              <p className="sideOption">
                <svg
                className="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M4.626 14.1368C4.81163 13.5189 5.19148 12.9774 5.70918 12.5925C6.22689 12.2076 6.85488 11.9998 7.5 12H10.5C11.1459 11.9998 11.7747 12.208 12.2928 12.5938C12.8109 12.9796 13.1906 13.5223 13.3755 14.1412M2.25 9C2.25 9.88642 2.42459 10.7642 2.76381 11.5831C3.10303 12.4021 3.60023 13.1462 4.22703 13.773C4.85382 14.3998 5.59794 14.897 6.41689 15.2362C7.23583 15.5754 8.11358 15.75 9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 8.11358 15.5754 7.23583 15.2362 6.41689C14.897 5.59794 14.3998 4.85382 13.773 4.22703C13.1462 3.60023 12.4021 3.10303 11.5831 2.76381C10.7642 2.42459 9.88642 2.25 9 2.25C8.11358 2.25 7.23583 2.42459 6.41689 2.76381C5.59794 3.10303 4.85382 3.60023 4.22703 4.22703C3.60023 4.85382 3.10303 5.59794 2.76381 6.41689C2.42459 7.23583 2.25 8.11358 2.25 9ZM6.75 7.5C6.75 8.09674 6.98705 8.66903 7.40901 9.09099C7.83097 9.51295 8.40326 9.75 9 9.75C9.59674 9.75 10.169 9.51295 10.591 9.09099C11.0129 8.66903 11.25 8.09674 11.25 7.5C11.25 6.90326 11.0129 6.33097 10.591 5.90901C10.169 5.48705 9.59674 5.25 9 5.25C8.40326 5.25 7.83097 5.48705 7.40901 5.90901C6.98705 6.33097 6.75 6.90326 6.75 7.5Z"
                    stroke="#354052"
                    stroke-width="1.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>{" "}
                <span className="sideOption ml-2">
                  {" "}
                  {JSON.parse(userDetail)?.userName}
                </span>
              </p>
            </Tooltip>
          </li>

          <li className="list">
            <Tooltip
              title={<h2 style={{ color: "white" }}> Logout</h2>}
              placement="right-end"
            >
              <p className="sideOption">
                <LogoutIcon
                  className="icon"
                  onClick={() => {
                    Parse.User.logOut();
                    localStorage.setItem("session-id", "");
                    navigate("/");
                  }}
                />{" "}
                <span
                  className="sideOption ml-2"
                  onClick={() => {
                    Parse.User.logOut();
                    localStorage.setItem("session-id", "");
                    navigate("/");
                  }}
                >
                  Logout
                </span>
              </p>
            </Tooltip>
          </li>
        </ul>
      </div>
    </motion.div>
  );
});

export default Sidebar;
