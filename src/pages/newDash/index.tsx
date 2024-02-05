import { Button } from "@mui/material";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import AddEditModal from "./addEditModal";
import DatabaseTable from "./databasetable";
import AddIcon from "@mui/icons-material/Add";
import "./electricVehicle.scss";
import uuid4 from "uuid4";

const NewDash = memo(() => {
  //Tabel
  const [tableData, setTableData] = useState<any>([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  // Generate a new UUID
  var lid = uuid4();
  const newOne = () => {
    fetch(
      `ocpp.chargecity.co.in/api/v1/ocpi/emsp/2.2.1/locations/IND/CC/${lid}`
    ).then((response: any) => response.json());
  };
  useEffect(() => {
    newOne();
  }, []);
  return (
    <div className="ev-container">
      <div className="add-car">
        <Button
          variant="contained"
          sx={{ width: 200 }}
          onClick={() => setShowAddEditModal(true)}
        >
          <AddIcon /> Add
        </Button>
      </div>

      <AddEditModal
        show={showAddEditModal}
        handleClose={() => setShowAddEditModal(false)}
        type="add"
        data={{
          id: "",
          name: "",
          manufacturer: { id: "", name: "" },
          chargeRate: "",
          range: "",
        }}
        refresh={() => console.log("No One is here")}
      />
      {/* <DatabaseTable
        dataRow={tableData}
        refresh={() => getAllVehiclesData()}
        loading={tableLoading}
      /> */}
    </div>
  );
});

export default NewDash;
