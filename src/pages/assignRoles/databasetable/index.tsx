import React, { useEffect, useState, memo } from "react";
import "./RolesTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Publish } from "@mui/icons-material";
import AddEditModal from "../addEditModal";
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
  allCpos: [];
  refreshTabel: any;
  loading: boolean;
}

const DatabaseTable = memo((props: tableProps) => {
  const { dataRow } = props;
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [addEditData, setAddEditData] = useState({});
  const columns = [
    {
      field: "sNo",
      headerName: "S.No.",
      width: 80,
    },
    {
      field: "name",
      headerName: "User Name",
      width: 180,
      editable: true,
    },
    {
      field: "phone",
      headerName: "Mobile",
      width: 180,
      editable: true,
    },

    {
      field: "email",
      headerName: "Email",
      width: 320,
      editable: true,
    },

    {
      field: "operator",
      headerName: "Operator",
      width: 180,
      editable: true,
    },
    {
      field: "access",
      headerName: "Role",
      width: 520,
    },

    {
      field: "",
      headerName: "",
      width: 220,
      renderCell: (params: {
        row: {
          operatorId: any;
          email: any;
          phone: any;
          cpo: any;
          access: any;
          password: any;
          companyName: string;
          rangeAdded: any;
          chargeRate: any;
          id: any;
          name: any;
          image: any;
          enabled: any;
          obj: any;
        };
      }) => {
        return (
          <Button
            variant="contained"
            onClick={() => {
              setShowAddEditModal(true);
              setAddEditData({
                id: params.row.id,
                name: params.row.name,
                email: params.row.email,
                phone: params.row.phone,
                cpo: params.row.operatorId,
                access: params.row.access,
                password: params.row.password,
              });
            }}
          >
            Edit Role
          </Button>
        );
      },
    },
  ];

  return (
    <div className="booking-table">
      <div className="title">Roles</div>

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
        data={addEditData}
        allCpos={props.allCpos}
        refresh={props.refreshTabel}
      />
    </div>
  );
});

export default DatabaseTable;
