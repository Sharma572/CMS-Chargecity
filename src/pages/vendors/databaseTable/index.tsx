import React, { useEffect, useState, memo } from "react";
import "./Table.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Publish } from "@mui/icons-material";
import { Button } from "@mui/material";
import AddEditModal from "../AddEditModal";
interface tableProps {
  dataRow: any;
  refresh: any;
  loading: boolean;
}

const DatabaseTable = memo((props: tableProps) => {
  const { dataRow, refresh } = props;
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [addEditData, setAddEditData] = useState<any>({});
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      width: 50,
    },

    {
      field: "logo",
      headerName: "Cover Image",
      width: 150,
      renderCell: (params: any) => {
        return (
          <>
            <img
              src={params.row.imageURL}
              alt=""
              width="auto"
              height="90%"
              style={{ padding: "0px", margin: "5px" }}
            />
          </>
        );
      },
    },
    {
      field: "up",
      headerName: "",
      width: 20,
      renderCell: (params: any) => {
        return (
          <>
            <label htmlFor={params.row.id}>
              <Publish color="primary" className="userUpdateIcon"></Publish>
            </label>
            <input
              accept="image/jpg, image/png, image/jpeg"
              type="file"
              id={params.row.id}
              style={{ display: "none" }}
              onChange={(event: any) => {
                let file = event.target.files[0];
                const parseFile = new Parse.File("photo", file);
                parseFile.save().then(
                  function () {
                    params.row.obj.set("Logo", parseFile);
                    params.row.obj.save().then(
                      () => {
                        alert("Image Uploaded");
                        props.refresh();
                      },
                      (error: any) => {
                        alert(
                          "Failed to save new object, with error code: " +
                            error.message
                        );
                        props.refresh();
                      }
                    );
                  },
                  function (error) {
                    alert("Error Faced" + error);
                  }
                );
              }}
            />
          </>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 180,
      editable: true,
    },

    {
      field: "",
      headerName: "",
      width: 220,
      renderCell: (params: {
        row: { id: any; name: any; image: any; enabled: any };
      }) => {
        return (
          <Button
            variant="contained"
            onClick={() => {
              setShowAddEditModal(true);
              setAddEditData({
                id: params.row.id,
                name: params.row.name,
                image: params.row.image,
                enabled: params.row.enabled,
              });
            }}
          >
            Edit Manufaturer
          </Button>
        );
      },
    },
  ];

  return (
    <div className="vendor-table">
      <div className="title">Manufacturers</div>
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
