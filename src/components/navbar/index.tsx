import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import React, { memo } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import "./navbar.scss";
const Navbar = memo(() => {
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search"></div>
        <div className="items">
          <div className="item">
            <LanguageIcon className="icon" />
            English
          </div>
          <div className="item">
            <img alt="" src="https://picsum.photos/200" className="avtar" />
          </div>
          <LogoutIcon />
        </div>
      </div>
    </div>
  );
});

export default Navbar;
