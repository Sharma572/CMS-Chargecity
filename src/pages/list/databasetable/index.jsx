import React, { useEffect, useState, memo } from "react";
import "./databaseTable.scss";
import { DataGrid } from "@mui/x-data-grid";

import { Parse } from "parse/lib/browser/Parse";
import { TextField } from "@mui/material";
import { Stack } from "@mui/material";
const DatabaseTable = memo(() => {
  const [dataRow, setDataRow] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [filteredRow, setFilteredRow] = useState([]);
  useEffect(() => {
    const parseQuery = new Parse.Query("_User");
    parseQuery.descending("createdAt");
    parseQuery.include("EV");
    parseQuery.limit(5000);
    parseQuery.notEqualTo("UserType", "Cloud");
    parseQuery.find({ userMasterKey: true }).then((result) => {
      setLoading(false);
      let newRow = [];

      result.forEach((user, index) => {
        newRow.push({
          id: index + 1,
          objectId: `${user.id}`,
          name: `${user.get("FullName")}`,
          phone: `${user.get("Phone")}`,
          email: `${user.get("email")}`,
          credit: `${user.get("Credit")}`,
          garage: `${
            user.get("EV")?.length
              ? user
                  .get("EV")
                  .map((item) => item.get("Name"))
                  .join(", ")
              : "-"
          }`,

          date:
            `${user
              .get("createdAt")
              .toLocaleDateString("en-US", { day: "numeric" })}` +
            " - " +
            `${user
              .get("createdAt")
              .toLocaleDateString("en-US", { month: "short" })}` +
            " - " +
            `${user
              .get("createdAt")
              .toLocaleDateString("en-US", { year: "numeric" })}`,
          obj: user,
        });
      });
      setDataRow(newRow);
      setFilteredRow(newRow);
    });
  }, []);

  const userColumns = [
    {
      field: "id",
      headerName: "S.No.",
      width: 50,
    },
    {
      field: "objectId",
      headerName: "Object ID",
      width: 150,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "credit",
      headerName: "Credit",
      width: 150,
      editable: false,
    },
    {
      field: "garage",
      headerName: "Vehicles in Garage",
      width: 200,
      editable: false,
    },

    {
      field: "date",
      headerName: "Created At",
      width: 130,
      editable: false,
    },
  ];

  const userRows = filteredRow;
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: () => (
        <div className="cellAction">
          <div className="viewButton">View</div>
          <div className="deleteButton">Delete</div>
        </div>
      ),
    },
  ];
  const [filter, setFilter] = useState("");
  const [numFilter, setNumFilter] = useState("");
  useEffect(() => {
    if (!filter) setFilteredRow(dataRow);

    setFilteredRow(
      dataRow.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter]);
  useEffect(() => {
    if (!numFilter) setFilteredRow(dataRow);

    setFilteredRow(
      dataRow.filter((item) => item.phone.toLowerCase().includes(numFilter))
    );
  }, [numFilter]);

  return (
    <div className="databaseTable">
      <div className="filters">
        <TextField
          id="outlined-search"
          label="Search by user"
          type="text"
          size="small"
          sx={{ maxWidth: 300, marginBottom: 5 }}
          onChange={(e) => setFilter(e.target.value)}
        />
        <TextField
          id="outlined-search"
          label="Search by  number"
          type="number"
          size="small"
          sx={{ maxWidth: 250, marginBottom: 5 }}
          onChange={(e) => setNumFilter(e.target.value)}
          xs={6}
        />
      </div>

      <DataGrid
        rows={userRows}
        columns={userColumns}
        pageSize={100}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        disableSelectionOnClick
        autoHeight
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#1ac47d",
            color: "rgba(255,255,255,1)",
            fontSize: 14,
          },
        }}
        loading={isLoading}
      />
    </div>
  );
});

export default DatabaseTable;
