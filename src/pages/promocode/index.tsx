import { Button } from "@mui/material";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import DatabaseTable from "./databasetable";
import AddEditModal from "./addEditModal";
import AddIcon from "@mui/icons-material/Add";
import "./promocode.scss";
import moment from "moment";

const Promocode = memo(() => {
  //Tabel
  const [tableData, setTableData] = useState<any>([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const getAllPromocodeData = () => {
    setTableLoading(true);
    const parseQuery = new Parse.Query("PromoCodes");
    parseQuery.include("User");
    parseQuery.include("ChargePoint");
    parseQuery.limit(100);
    parseQuery.find().then((result: any[]) => {
      let newRow: any[] = [];
      result.forEach((item, index) => {
        newRow.push({
          sNo: index + 1,
          id: item.id,
          code: `${item.get("Code")}`,
          value: `${item.get("Value")}`,
          start: `${moment(item.get("createdAt")).format("lll")}`,
          status: `${item.get("isValid") ? "true" : "false"}`,
          obj: item,
        });
      });
      setTableData(newRow);
      setTableLoading(false);
    });
  };

  useEffect(() => {
    getAllPromocodeData();
  }, []);
  return (
    <div className="promo-container">
      <div className="add-car">
        <Button
          variant="contained"
          sx={{ width: 200 }}
          onClick={() => setShowAddEditModal(true)}
        >
          <AddIcon /> Add Promocode
        </Button>
      </div>
      <AddEditModal
        show={showAddEditModal}
        handleClose={() => setShowAddEditModal(false)}
        type="add"
        data={{
          id: "",
          code: "",
          value: "",
          start: "",
          status: "false",
          range: "",
        }}
        refresh={() => getAllPromocodeData()}
      />
      <DatabaseTable
        dataRow={tableData}
        refresh={() => getAllPromocodeData()}
        loading={tableLoading}
      />
    </div>
  );
});

export default Promocode;
