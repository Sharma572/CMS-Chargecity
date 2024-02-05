import React, { memo, useEffect, useState } from "react";
import "./databaseTable.scss";
import { DataGrid } from "@mui/x-data-grid";

import { TiBatteryFull } from "react-icons/ti";
import { LuBatteryCharging } from "react-icons/lu";
interface tableProps {
  data: any;
  loading: boolean;
}
const DatabaseTable = memo((props: tableProps) => {
  const [dataRow, setDataRow] = useState([]);
  const { data } = props;

  useEffect(() => {
    setDataRow(data.sort((a: any, b: any) => a.id - b.id));
  }, [data]);
  const columns = [
    { field: "id", headerName: "ID", width: 50 },

    { field: "customer", headerName: "Name", width: 150 },
    { field: "location", headerName: "Location", width: 180 },
    {
      field: "isLive",
      width: 200,
      headerName: "Status",
      renderCell: (params: {
        row: { obj: { get: (arg0: string) => any } };
      }) => {
        let currentStatus = params.row.obj.get("Live");
        return currentStatus === false ? (
          // <div className="labelCompleted">
          //   {/* <span className="labelText ">Completed</span> */}
          // </div>
            <span className="flex rounded-full p-1 text-blue-600"> <TiBatteryFull className= " mr-4 text-2xl" />  Completed</span>
        ) : (
          
            <span className="flex rounded-full p-1 text-green-600"> <LuBatteryCharging className= " mr-4 text-2xl" /> Charging</span>
          
        );
      },
    },
    { field: "carCharged", headerName: "Vehicle", width: 120 },

    { field: "startTime", headerName: "Start Time", width: 200 },
    {
      field: "endTime",
      headerName: "End Time",
      width: 200,
      renderCell: (params: any) => {
        let currentStatus = params.row.obj.get("Live");

        return currentStatus === true ? (
          <div>-</div>
        ) : (
          <span>{params.row.endTime}</span>
        );
      },
    },

    {
      field: "cost",
      headerName: "Cost",
      width: 100,
      renderCell: (params: any) => {
        let currentStatus = params.row.obj.get("Live");
        let ocppCharging = params.row.obj.get("ChargePoint")?.get("isOCPP");

        return ocppCharging && currentStatus === true ? (
          <div>{params.row.ocppCost}</div>
        ) : (
          <span>{parseFloat(params.row.obj.get("TotalCost")).toFixed(2)}</span>
        );
      },
    },

    {
      field: "energy",
      headerName: "Energy",
      width: 120,
      renderCell: (params: any) => {
        let currentStatus = params.row.obj.get("Live");
        let charge = params.row.obj.get("ChargePoint")?.get("isOCPP");
        return charge && currentStatus === true ? (
          <div>{params.row.ocppEnergy}</div>
        ) : (
          <span>
            {parseFloat(params.row.obj.get("TotalEnergyConsumed")).toFixed(2)}
          </span>
        );
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 120,
      renderCell: (params: {
        row: {
          ocppDuration: any;
          duration: string;
          obj: { get: (arg0: string) => any };
        };
      }) => {
        let currentStatus = params.row.obj.get("Live");
        let charge = params.row.obj.get("ChargePoint")?.get("isOCPP");
        return charge && currentStatus === true ? (
          <div>{params.row.ocppDuration}</div>
        ) : (
          <span>{params.row.duration}</span>
        );
      },
    },
    { field: "serialNum", headerName: "Serial Number", width: 120 },
    { field: "power", headerName: "Power", width: 120 },
    { field: "connector", headerName: "Connector", width: 100 },
  ];

  return (
    <div className="cs-databaseTable">
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
