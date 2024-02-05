import React, { memo, useState, useEffect } from "react";
import "./widget.scss";

type widgetProps = {
  type: String;

  data: any;
};

const Widget = memo((props: widgetProps) => {
  const { type, data } = props;

  let content;

  // const diff = 20;
  switch (type) {
    case "chargingPoint":
      content = {
        title: "Charge Points",

        total: data,
      };
      break;
    case "chargingStation":
      content = {
        title: "Locations",
        total: data,
      };
      break;

    default:
      break;
  }
  return (
    <div className="csWidget">
      <div className="title">{content?.title}</div>
      <span className="content">{content?.total}</span>
    </div>
  );
});

export default Widget;
