import { Button } from "@mui/material";
import { memo, useEffect, useState } from "react";
import DatabaseTable from "./databasetable";
import AddEditModal from "./addEditModal";
import AddIcon from "@mui/icons-material/Add";
import "./cpo.scss";

const Cpo = memo(() => {
  //Table
  const [tableData, setTableData] = useState<any>([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const getAllCpoData = () => {
    setTableLoading(true);
    const parseQuery = new Parse.Query("ChargePointOperators");
    parseQuery.include("User");
    parseQuery.include("ChargePoint");
    parseQuery.limit(100);
    parseQuery.find().then((result: any[]) => {
      let newRow: any[] = [];
      result.forEach((item, index) => {
        newRow.push({
          sNo: index + 1,
          id: item.id,
          companyName: item.get("CompanyName"),
          tradeName: item.get("Name"),
          companyAddress: item.get("Address"),
          contactName: item.get("ContactName"),
          contactNumber: item.get("Phone"),
          contactEmail: item.get("Email"),
          companyDescription: item.get("Description"),
          isWhiteLabel: item.get("isWhiteLabel") ? "true" : "false",
          accountName: item.get("AccountName") || "",
          accountNumber: item.get("AccountNumber") || "",
          bankName: item.get("BankName") || "",
          ifsc: item.get("IFSC") || "",
          upi: item.get("UPI") || "",
          upiCode: item.get("UPICode") || "",
          obj: item,
        });
      });
      setTableData(newRow);
      setTableLoading(false);
    });
  };

  useEffect(() => {
    getAllCpoData();
  }, []);
  return (
    <div className="cpo-container">
      <div className="add-car">
        <Button
          variant="contained"
          sx={{ width: 200 }}
          onClick={() => setShowAddEditModal(true)}
        >
          <AddIcon /> Add CPO
        </Button>
      </div>
      <AddEditModal
        show={showAddEditModal}
        handleClose={() => setShowAddEditModal(false)}
        type="add"
        data={{
          id: "",
          companyName: "",
          tradeName: "",
          companyAddress: "",
          contactName: "",
          contactNumber: "",
          contactEmail: "",
          companyDescription: "",
          isWhiteLabel: "false",
          accountName: "",
          accountNumber: "",
          bankName: "",
          ifsc: "",
          upi: "",
        }}
        refresh={() => getAllCpoData()}
      />
      <DatabaseTable
        dataRow={tableData}
        refresh={() => getAllCpoData()}
        loading={tableLoading}
      />
    </div>
  );
});

export default Cpo;
