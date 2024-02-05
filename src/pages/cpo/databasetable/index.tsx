import React, { useEffect, useState, memo } from "react";
import "./cpoTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import AddEditModal from "../addEditModal";
import Button from "@mui/material/Button/Button";
interface tableProps {
  dataRow: any;
  refresh: any;
  loading: boolean;
}

const DatabaseTable = memo((props: tableProps) => {
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [addEditData, setAddEditData] = useState({});
  const { dataRow } = props;

  const columns = [
    {
      field: "sNo",
      headerName: "S.No.",
      width: 80,
    },
    {
      field: "companyName",
      headerName: "Company Name",
      width: 180,
      editable: true,
    },
    {
      field: "tradeName",
      headerName: "Trade Name",
      width: 180,
      editable: true,
    },

    {
      field: "companyAddress",
      headerName: "Address",
      width: 280,
      editable: true,
    },

    {
      field: "contactName",
      headerName: "Contact Name",
      width: 180,
      editable: true,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      width: 180,
      editable: true,
    },
    {
      field: "contactEmail",
      headerName: "Contact Email",
      width: 250,
      editable: true,
    },
    {
      field: "companyDescription",
      headerName: "Company Description",
      width: 180,
      editable: true,
    },
    {
      field: "",
      headerName: "",
      width: 220,
      renderCell: (params: any) => {
        return (
          <Button
            variant="contained"
            onClick={() => {
              setShowAddEditModal(true);
              setAddEditData({
                id: params.row.id,
                companyName: params.row.companyName,
                tradeName: params.row.tradeName,
                companyAddress: params.row.companyAddress,
                contactName: params.row.contactName,
                contactNumber: params.row.contactNumber,
                contactEmail: params.row.contactEmail,
                companyDescription: params.row.companyDescription,
                isWhiteLabel: params.row.isWhiteLabel,

                accountName: params.row.accountName,
                accountNumber: params.row.accountNumber,
                bankName: params.row.bankName,
                ifsc: params.row.ifsc,
                upi: params.row.upi,
                upiCode: params.row.upiCode,
              });
            }}
          >
            Edit CPO
          </Button>
        );
      },
    },
  ];

  return (
    <div className="booking-table">
      <div className="title">Charge Point Operator</div>

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
      <AddEditModal
        show={showAddEditModal}
        type="edit"
        handleClose={() => setShowAddEditModal(false)}
        refresh={() => props.refresh()}
        data={addEditData}
      />
    </div>
  );
});

export default DatabaseTable;
