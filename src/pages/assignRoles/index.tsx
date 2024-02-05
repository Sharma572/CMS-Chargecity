import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import DatabaseTable from "./databasetable";
import AddEditModal from "./addEditModal";
import "./assign.scss";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
const AssignRoles = memo(() => {
  //Tabel
  const [tableData, setTableData] = useState<any>([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const currentUser: any = Parse.User.current();
  let userDetail: any = localStorage.getItem("user-details");
  const [tableLoading, setTableLoading] = useState(false);
  const getAllUsers = () => {
    setTableLoading(true);
    const Users = Parse.Object.extend("_User");

    const parseQuery = new Parse.Query(Users);
    parseQuery.include("ChargePointOperators");
    parseQuery.descending("createdAt");

    parseQuery.equalTo("UserType", "Cloud");
    if (currentUser && !JSON.parse(userDetail).isSuperAdmin) {
      parseQuery.equalTo("CPO", currentUser.get("CPO"));
    }
    parseQuery.find().then((result) => {
      let usersArray: any[] = [];

      result.forEach((item, index) => {
        usersArray.push({
          sNo: index + 1,
          id: item.id,
          name: item.get("FullName"),
          email: item.get("username"),
          // password: item.get("password"),
          phone: item.get("Phone"),
          access: item.get("RoleAssigned"),
          createdAt: `${moment(item.get("createdAt")).format("lll")}`,
          operator: item.get("CPO").get("Name"),
          operatorId: item.get("CPO").id,
        });
      });
      setTableData(usersArray);
      setTableLoading(false);
    });
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  const [allCpos, setAllCpos] = useState<any>([]);
  const getAllCpos = () => {
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
          isWhiteLabel: item.get("isWhiteLabel"),
          obj: item,
        });
      });
      setAllCpos(newRow);
    });
  };
  useEffect(() => {
    getAllCpos();
  }, []);
  return (
    <div className="roles-container">
      <div className="add-car">
        <Button
          variant="contained"
          sx={{ width: 200 }}
          onClick={() => setShowAddEditModal(true)}
        >
          <AddIcon /> Add Roles
        </Button>
      </div>
      <DatabaseTable
        dataRow={tableData}
        allCpos={allCpos}
        refreshTabel={() => getAllUsers()}
        loading={tableLoading}
      />
      <AddEditModal
        show={showAddEditModal}
        handleClose={() => setShowAddEditModal(false)}
        type="add"
        refresh={() => getAllUsers()}
        data={{
          id: "",
          companyName: "",
          tradeName: "",
          companyAddress: "",
          contactName: "",
          contactNumber: "",
          contactEmail: "",
          companyDescription: "",
        }}
        allCpos={allCpos}
      />
    </div>
  );
});

export default AssignRoles;
