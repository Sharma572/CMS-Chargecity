import React, { useEffect, useState, memo } from "react";
import "./databaseTable.scss";
import { DataGrid } from "@mui/x-data-grid";

interface tableProps {
  dataRow: any;
  loading: boolean;
}
const DatabaseTable = memo((props: tableProps) => {
  const { dataRow } = props;

  const columns = [
    { field: "id", headerName: "ID", width: 150,cellClassName: 'custom-cell' },
    { field: "createdAt", headerName: "Created At", width: 200,cellClassName: 'custom-cell' },
    { field: "customer", headerName: "Name", width: 200,cellClassName: 'custom_cell_name' },
    { field: "type", headerName: "Type", width: 200,cellClassName: 'custom-cell' },
    { field: "amount", headerName: "Amount", width: 150,cellClassName: 'custom-cell' },

    // { field: "orderId", headerName: "Charge Id", width: 150 },

    { field: "detail", headerName: "Detail", width: 300,cellClassName: 'custom-cell' },

    // { field: "chargeBy", headerName: "Charge By", width: 100 },

    // { field: "date", headerName: "Date", width: 100 },
  ];
  return (
    <div className="databaseTable">
      <DataGrid
        rows={dataRow}
        columns={columns}
        pageSize={30}
        rowsPerPageOptions={[30]}
        checkboxSelection={false}
        disableSelectionOnClick
        autoHeight
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
