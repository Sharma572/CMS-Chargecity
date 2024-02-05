import React, { useEffect, useState, memo } from "react";
import "./BookingsTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Publish } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

interface tableProps {
  dataRow: any;
  refresh: any;
  loading: boolean;
}

const DatabaseTable = memo((props: tableProps) => {
  const { dataRow } = props;
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [addEditData, setAddEditData] = useState({});
  const columns = [
    {
      field: "id",
      headerName: "S.No.",
      width: 50,
    },
    {
      field: "name",
      headerName: "User Name",
      width: 180,
      editable: true,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile",
      width: 180,
      editable: true,
    },

    {
      field: "startTime",
      headerName: "Start time",
      width: 180,
      editable: true,
    },

    {
      field: "endTime",
      headerName: "End time",
      width: 180,
      editable: true,
    },
    {
      field: "serial",
      headerName: "Charger Serial Number",
      width: 180,
      editable: true,
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 180,
      editable: true,
    },
    {
      field: "status",
      width: 200,
      headerName: "Status",
      renderCell: (params: {
        row: {
          id: any;
          cancelled: any;
          expired: any;
          upcoming: any;
          obj: { get: (arg0: string) => any };
        };
      }) => {
        if (params.row.upcoming === "true") {
          return (
            <div className="labelUpcoming">
              <span className="labelText">Upcoming</span>
            </div>
          );
        } else if (params.row.expired === "true") {
          return (
            <div className="labelExpired">
              <span className="labelText">Expired</span>
            </div>
          );
        } else if (params.row.cancelled === "true") {
          return (
            <div className="labelCancelled">
              <span className="labelText">Cancelled</span>
            </div>
          );
        }

        // let currentStatus = params.row.obj.get("isCancelled");
        // return currentStatus === false ? (
        //   <div className="labelCompleted">
        //     <span className="labelText">Cancelled</span>
        //   </div>
        // ) : (
        //   <div className="label">
        //     <span className="labelText">Upcoming</span>
        //   </div>
        // );
      },
    },
  ];

  return (
    <div className="booking-table">
      <div className="title">Booking</div>

      <DataGrid
        rows={dataRow}
        columns={columns}
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
        loading={props.loading}
      />
    </div>
  );
});

export default DatabaseTable;
