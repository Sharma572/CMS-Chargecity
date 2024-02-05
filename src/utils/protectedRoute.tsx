import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./protectedroutes.scss";
const ProtectedRoute = (props: any) => {
  const { Component } = props;

  const navigate = useNavigate();
  useEffect(() => {
    let user = Parse.User.current();
    if (user) {
      Parse.Session.current().then((session) => {
        if (!session.id) {
          Parse.User.logOut().then(() => {
            navigate("/");
          });
        }
      });
    } else {
      navigate("/");
    }
  }, []);
  return (
    <React.Fragment>
      <div className="side-bar">
        <Sidebar />

        <Component />
      </div>
    </React.Fragment>
  );
};
export default ProtectedRoute;
