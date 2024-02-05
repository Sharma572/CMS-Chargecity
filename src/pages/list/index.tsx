import React, { memo } from "react";

import "./list.scss";
import DatabaseTable from "./databasetable";
const List = memo(() => {
  return (
    <div className="list-container">
      <DatabaseTable />
    </div>
  );
});

export default List;
