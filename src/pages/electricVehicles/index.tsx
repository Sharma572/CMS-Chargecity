import { Button } from "@mui/material";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import AddEditModal from "./addEditModal";
import DatabaseTable from "./databasetable";
import AddIcon from "@mui/icons-material/Add";
import "./electricVehicle.scss";

const Ev = memo(() => {
  //Tabel
  const [tableData, setTableData] = useState<any>([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const getAllVehiclesData = () => {
    setTableLoading(true);
    const parseQuery = new Parse.Query("Cars");

    parseQuery.limit(100);
    parseQuery.find().then((result: any[]) => {
      let newRow: {
        id: number;
        name: string;
        imageURL: any;
        manufacturer: string;
        chargeRate: string;
        rangeAdded: string;
        logoURL: any;
        obj: any;
      }[] = [];

      result.forEach((item, index) => {
        let url = "/images/placeholder.png";
        let file = item.get("Image");
        if (file != null) {
          url = file.url();
        }
        let logoUrl = "/images/placeholder.png";
        let logoFile = item.get("Brand") ? item.get("Brand").get("Logo") : "";
        if (logoFile) {
          logoUrl = logoFile.url();
        }

        newRow.push({
          id: item.id,
          name: `${item.get("Name")}`,
          imageURL: url,
          manufacturer: `${
            item.get("Brand")?.get("Name") ? item.get("Brand").get("Name") : ""
          }`,
          chargeRate: `${item.get("ChargingRate")}`,
          rangeAdded: `${item.get("RangePerKW")}`,
          logoURL: logoUrl,
          obj: item,
        });
      });
      setTableLoading(false);
      setTableData(newRow);
    });
  };

  useEffect(() => {
    getAllVehiclesData();
  }, []);
  return (
    <div className="ev-container">
      <div className="add-car">
        <Button
          variant="contained"
          sx={{ width: 200 }}
          onClick={() => setShowAddEditModal(true)}
        >
          <AddIcon /> Add Car
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
        refresh={() => getAllVehiclesData()}
      />
      <DatabaseTable
        dataRow={tableData}
        refresh={() => getAllVehiclesData()}
        loading={tableLoading}
      />
    </div>
  );
});

export default Ev;
