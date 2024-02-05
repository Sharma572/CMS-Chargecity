import { useState, memo } from "react";
import "./PromocodeTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Publish } from "@mui/icons-material";
import { Button } from "@mui/material";
import AddEditModal from "../addEditModal";
interface tableProps {
  dataRow: any;
  refresh: any;
  loading: any;
}

const DatabaseTable = memo((props: tableProps) => {
  const { dataRow } = props;
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [addEditData, setAddEditData] = useState({});
  const columns = [
    {
      field: "sNo",
      headerName: "S.No.",
      width: 150,
    },
    {
      field: "code",
      headerName: "Code",
      width: 180,
      editable: true,
    },
    {
      field: "value",
      headerName: "Value",
      width: 180,
      editable: true,
    },
    {
      field: "start",
      headerName: "Created At",
      width: 180,
      editable: true,
    },
    {
      field: "status",
      width: 200,
      headerName: "Status",
      renderCell: (params: {
        row: { obj: { get: (arg0: string) => any } };
      }) => {
        let currentStatus = params.row.obj.get("isValid");
        return currentStatus === false ? (
          <div className="labelCompleted">
            <span className="labelText">Inactive</span>
          </div>
        ) : (
          <div className="label">
            <span className="labelText">Active</span>
          </div>
        );
      },
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
                code: params.row.code,
                value: params.row.value,
                status: params.row.status,
              });
            }}
          >
            Edit Promocode
          </Button>
        );
      },
    },
  ];

  return (
    <div className="ev-table">
      <div className="title">Promocode</div>
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
