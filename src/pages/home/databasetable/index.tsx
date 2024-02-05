import React, { useEffect, useState, memo } from "react";
import "./Table.scss";
import { DataGrid } from "@mui/x-data-grid";
import { TiBatteryFull } from "react-icons/ti";
import { LuBatteryCharging } from "react-icons/lu";
interface tableProps {
  data: any;
  loading: boolean;
}
const DatabaseTable = memo((props: tableProps) => {
  const { data } = props;
  const [dataRow, setDataRow] = useState([]);

  useEffect(() => {
    setDataRow(data.sort((a: any, b: any) => a.id - b.id));
  }, [data]);
  console.log("dataRow",dataRow)
  const columns = [
    { field: "id", headerName: "ID", width: 50 ,cellClassName: 'custom-cell'},

    { field: "customer", headerName: "Name", width: 200 , cellClassName: 'custom-cell ' },
    { field: "location", headerName: "Location", width: 200 , cellClassName: 'custom-cell' },
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
            <span className="flex align-middle rounded-full p-1 text-blue-600"> <TiBatteryFull className= " mr-2 text-2xl" /> <p className="mt-1">Completed</p> </span>
        ) : (
          
            <span className="flex rounded-full p-1 text-green-600"> <LuBatteryCharging className= " mr-4 text-2xl" /> Charging</span>
          
        );
      },
      cellClassName: 'custom-cell'
    },
    { field: "carCharged", headerName: "Vehicle", width: 120 ,cellClassName: 'custom-cell' },

    { field: "startTime", headerName: "Start Time", width: 200 ,cellClassName: 'custom-cell' },
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
      cellClassName: 'custom-cell'
    },

    {
      field: "cost",
      headerName: "Cost",
      width: 100,
      renderCell: (params: any) => {
        let currentStatus = params.row.obj.get("Live");
        let charge = params.row.obj.get("ChargePoint")?.get("isOCPP");

        return charge && currentStatus === true ? (
          <div>{params.row.ocppCost}</div>
        ) : (
          <span>{parseFloat(params.row.obj.get("TotalCost")).toFixed(2)}</span>
        );
      },
      cellClassName: 'custom-cell'
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
      cellClassName: 'custom-cell'
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
        let currentStatus = params.row.obj?.get("Live");
        let charge = params.row.obj.get("ChargePoint")?.get("isOCPP");
        return charge && currentStatus === true ? (
          <div>{params.row.ocppDuration}</div>
        ) : (
          <span>{params.row.duration}</span>
        );
      },
      cellClassName: 'custom-cell' 
    },
    { field: "serialNum", headerName: "Serial Number", width: 120 ,cellClassName: 'custom-cell' },
    { field: "power", headerName: "Power", width: 120 ,cellClassName: 'custom-cell' },
    { field: "connector", headerName: "Connector", width: 100 ,cellClassName: 'custom-cell' },
  ];
  console.log("dataRow👆👆",dataRow.slice(0,10))
  return (
    <div className="Table">
     
      <DataGrid
        rows={dataRow.slice(0, 10)}
        rowHeight={39}
        columns={columns}
        rowsPerPageOptions={[6]}
        checkboxSelection={false}
        disableSelectionOnClick
        autoHeight
        hideFooter // for hiding footer of the table
        headerHeight={48}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#ffffff",
            color: "#949597",
            fontSize: 16,
fontFamily: "lexend",
fontWeight:'600',
lineHeight:'110%'
          },
        }}
        loading={props.loading}
      />
    </div>
  );
});

export default DatabaseTable;
