import { Button } from "@mui/material";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";

import DatabaseTable from "./databaseTable";
import AddIcon from "@mui/icons-material/Add";
import "./vendor.scss";
import AddEditModal from "./AddEditModal";

const Vendors = memo(() => {
  // Widget Data
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [tableLoading, setTableLoading] = useState(false);

  const getAllVehiclesData = () => {
    setTableLoading(true);
    const parseQuery = new Parse.Query("EV_Manufacturer");

    parseQuery.limit(100);
    parseQuery.find().then((result: any[]) => {
      let newRow: {
        sno: number;
        id: number;
        name: string;
        imageURL: any;
        manufacturer: string;
        enabled: string;
        obj: any;
      }[] = [];

      result.forEach((item, index) => {
        let url = "/images/placeholder.png";
        let file = item.get("Logo");
        if (file != null) {
          url = file.url();
        }
        let logoUrl = "/images/placeholder.png";
        let logoFile = item.get("ManufacturerLogo");
        if (logoFile != null) {
          logoUrl = logoFile.url();
        }

        newRow.push({
          sno: index + 1,
          id: item.id,
          name: `${item.get("Name")}`,
          imageURL: url,
          manufacturer: `${item.get("Manufacturer")}`,
          enabled: `${item.get("isEnabled")}`,
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
    <div className="vendor-container">
      <div className="add-location">
        <Button
          variant="contained"
          sx={{ width: 200 }}
          onClick={() => setShowAddEditModal(true)}
        >
          <AddIcon /> Add Manufaturer
        </Button>
      </div>
      <div className="table">
        <DatabaseTable
          dataRow={tableData}
          refresh={() => getAllVehiclesData()}
          loading={tableLoading}
        />
      </div>
      <AddEditModal
        show={showAddEditModal}
        handleClose={() => setShowAddEditModal(false)}
        type="add"
        data={{
          id: "",
          name: "",
          image: "",
          enabled: "",
        }}
        refresh={() => getAllVehiclesData()}
      />
    </div>
  );
});

export default Vendors;
