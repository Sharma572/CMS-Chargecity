import React, { memo, useEffect, useState } from "react";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import EvStationIcon from "@mui/icons-material/EvStation";
import SellIcon from "@mui/icons-material/Sell";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import SummarizeIcon from "@mui/icons-material/Summarize";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PushPinIcon from "@mui/icons-material/PushPin";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Collapse from "@mui/material/Collapse";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import MapIcon from "@mui/icons-material/Map";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import myImg from "../../icons/logo.png";
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
import { motion, AnimatePresence } from 'framer-motion';
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
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    {/* // <div className={isOpen ? "sidebar" : "sideber-short"}> */}
      <div className="top">
        <img src={myImg} className="logo" />

        <FirstPageIcon
          className="upperIcon"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          fontSize="large"
        />
      </div>

      <div className="center">
        <ul>
          {!isOpen ? (
            <li className="list">
              {" "}
              <MenuIcon
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
                    <DashboardIcon className="icon" />
                    <span>Home</span>
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
                    <EvStationIcon className="icon" />
                    <span>Charge Sessions</span>
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
                    <PeopleIcon className="icon" />
                    <span>Users</span>
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
                    <AppRegistrationIcon className="icon" />
                    <span className="sideOption">Transactions</span>
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
                    <SummarizeIcon className="icon" />
                    <span className="sideOption">Reports</span>
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
                    <FileCopyIcon className="icon" />
                    <span className="sideOption">Invoices</span>
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
                    <BorderColorIcon className="icon" />
                    <span className="sideOption">Bookings</span>
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
                    <AddLocationAltIcon className="icon" />
                    <span>List</span>
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
                    <MapIcon className="icon" />
                    <span>Map</span>
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
                    <ElectricCarIcon className="icon" />
                    <span className="sideOption">Vehicles </span>
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
                    <FactoryIcon className="icon" />
                    <span className="sideOption">Manufaturers</span>
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
                    <AnalyticsIcon className="icon" />
                    <span>Revenue</span>
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
                    <ElectricMeterIcon className="icon" />
                    <span>Energy Consumption</span>
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
                    <PushPinIcon className="icon" />
                    <span className="sideOption">Push Notifications</span>
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
                    <LocalOfferIcon className="icon" />
                    <span className="sideOption">Promo Code </span>
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
                    <SupportAgentIcon className="icon" />
                    <span>Create CPO</span>
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
                    <AssignmentIndIcon className="icon" />

                    <span className="sideOption">Assign Roles</span>
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
                  <PublicIcon className="icon" />

                  <span className="sideOption">Roaming</span>
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
                <PersonPinIcon className="icon" />{" "}
                <span className="sideOption">
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
                  className="sideOption"
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




































    