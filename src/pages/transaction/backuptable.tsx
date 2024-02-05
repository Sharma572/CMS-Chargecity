


import { Autocomplete, TextField } from "@mui/material";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';


import DatabaseTable from "./databasetable";
import Widget from "./widget";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import "./transaction.scss";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
interface optionObj {
  id: string;
  label: string;
}
const Transaction = memo(() => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Function to handle filter button click
  const handleFilterButtonClick = () => {
    // Toggle filter visibility
    setIsFilterVisible((prev) => !prev);
  };

  // Widget Data
  const [walletBalance, setWalletBalance] = useState({
    total: 0,
  });
  const [billedRevenue, setBilledRevenue] = useState<any>({
    total: null,
  });
  const [transaction, setTransaction] = useState({
    total: 0,
  });
  const getRevenueData = (
    userId: string,
    date: string,
    startDate: string | Date,
    endDate: string | Date,
    type: any
  ) => {
    const ChargeSession = Parse.Object.extend("ChargeSession");
    const parseQuery = new Parse.Query(ChargeSession);
    if (userId) {
      let User = Parse.User;
      let userObj = User.createWithoutData(userId);
      parseQuery.equalTo("User", userObj);
    }
    if (date) {
      if (date === "Today") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("day").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().add(1, "day").startOf("day").toString())
        );
      } else if (date === "This Month") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("month").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("month").toString())
        );
      } else if (date === "This Week") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("week").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("week").toString())
        );
      } else if (date === "This Year") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("year").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("year").toString())
        );
      }
    }

    if (startDate) {
      parseQuery.greaterThanOrEqualTo("createdAt", new Date(startDate));
    }
    if (endDate) {
      parseQuery.lessThanOrEqualTo("createdAt", new Date(endDate));
    }
    parseQuery.limit(5000);
    parseQuery.find().then((result) => {
      let totalEnergy = 0;

      let totalMoney = 0;

      let totalSession = 0;

      result.forEach((item, index) => {
        totalEnergy = item.get("TotalEnergyConsumed")
          ? item.get("TotalEnergyConsumed") + totalEnergy
          : 0 + totalEnergy;
        totalMoney = item.get("TotalCost")
          ? item.get("TotalCost") + totalMoney
          : 0 + totalMoney;
        totalSession = totalSession + 1;
      });
      if (type === "Credit") {
        setBilledRevenue({
          total: null,
        });
      } else {
        setBilledRevenue({
          total: totalMoney,
        });
      }
    });
  };
  const [tableLoading, setTableLoading] = useState(false);
  const getWidgetsData = (
    userId: string,
    type: string,
    date: string,
    startDate: string | Date,
    endDate: string | Date
  ) => {
    setTableLoading(true);
    const Transactions = Parse.Object.extend("Transactions");
    const parseQuery = new Parse.Query(Transactions);
    if (userId) {
      let User = Parse.User;
      let userObj = User.createWithoutData(userId);
      parseQuery.equalTo("User", userObj);
    }
    if (type) {
      parseQuery.equalTo("Type", type);
    }
    if (date) {
      if (date === "Today") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("day").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().add(1, "day").startOf("day").toString())
        );
      } else if (date === "This Month") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("month").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("month").toString())
        );
      } else if (date === "This Week") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("week").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("week").toString())
        );
      } else if (date === "This Year") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("year").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("year").toString())
        );
      }
    }

    if (startDate) {
      parseQuery.greaterThanOrEqualTo("createdAt", new Date(startDate));
    }
    if (endDate) {
      parseQuery.lessThanOrEqualTo("createdAt", new Date(endDate));
    }
    parseQuery.descending("createdAt");
    parseQuery.limit(5000);
    parseQuery.find().then((result) => {
      let newRow: {
        id: any;
        customer: string;
        type: string;
        amount: string;
        detail: string;
        createdAt: string;
      }[] = [];
      let totalCredited = 0;
      let totalDebited = 0;
      let totalTransaction = 0;
      result.forEach((item, index) => {
        totalCredited =
          item.get("Type") === "Credit"
            ? item.get("Amount") + totalCredited
            : 0 + totalCredited;
        totalDebited =
          item.get("Type") === "Debit"
            ? item.get("Amount") + totalDebited
            : 0 + totalDebited;
        totalTransaction = totalTransaction + 1;
        newRow.push({
          id: item.id,
          customer: `${item.get("User").get("FullName")}`,
          type: `${item.get("Type")}`,
          amount: `₹${item.get("Amount")?.toFixed(2)}`,
          detail: `${item.get("Detail")}`,
          createdAt: `${
            moment(item.get("createdAt")).format("lll")
              ? moment(item.get("createdAt")).format("lll")
              : "-"
          }`,
        });
      });
      setTableData(newRow);
      setTableLoading(false);
      setTransaction({
        total: totalTransaction,
      });
    });
  };

  // Filters Data

  const [allUsers, setAllUsers] = useState<any | null>([]);

  const allTypes = ["Credit", "Debit"];
  //Tabel
  const [tableData, setTableData] = useState<any>([]);

  const getAllTransactionData = (
    userId: string,
    type: string,
    date: string,
    startDate: string | Date,
    endDate: string | Date
  ) => {
    const parseQuery = new Parse.Query("Transactions");
    if (userId) {
      let User = Parse.User;
      let userObj = User.createWithoutData(userId);
      parseQuery.equalTo("User", userObj);
    }
    if (type) {
      parseQuery.equalTo("Type", type);
    }
    if (date) {
      if (date === "Today") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("day").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().add(1, "day").startOf("day").toString())
        );
      } else if (date === "This Week") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("week").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("week").toString())
        );
      } else if (date === "This Month") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("month").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("month").toString())
        );
      } else if (date === "This Year") {
        parseQuery.greaterThanOrEqualTo(
          "createdAt",
          new Date(moment().startOf("year").toString())
        );
        parseQuery.lessThanOrEqualTo(
          "createdAt",
          new Date(moment().endOf("year").toString())
        );
      }
    }

    if (startDate) {
      parseQuery.greaterThanOrEqualTo("createdAt", new Date(startDate));
    }
    if (endDate) {
      parseQuery.lessThanOrEqualTo("createdAt", new Date(endDate));
    }

    parseQuery.include("User");
    parseQuery.include("Type");
    parseQuery.include("Amount");
    parseQuery.include("Detail");

    parseQuery.descending("createdAt");
    parseQuery.limit(1000);
    parseQuery.find().then((result: any[]) => {
      let newRow: {
        id: number;
        customer: string;
        type: string;
        amount: string;
        detail: string;
        createdAt: string;
      }[] = [];
      result.forEach((item) => {
        let car = "";
        if (`${item.get("Vehicle")}` !== "undefined") {
          car = `${item.get("Vehicle").get("Name")}`;
        }

        newRow.push({
          id: item.id,
          customer: `${item.get("User").get("FullName")}`,
          type: `${item.get("Type")}`,
          amount: `₹${item.get("Amount")?.toFixed(2)}`,
          detail: `${item.get("Detail")}`,
          createdAt: `${
            moment(item.get("createdAt")).format("lll")
              ? moment(item.get("createdAt")).format("lll")
              : "-"
          }`,
        });
      });
    });
  };

  // Filters
  const getAllUsers = () => {
    const User = Parse.Object.extend("User");
    const parseQuery = new Parse.Query(User);
    parseQuery.notEqualTo("UserType", "Cloud");
    parseQuery.limit(1000);
    parseQuery.find().then((result) => {
      let usersArray: optionObj[] = [];
      result.forEach((item) => {
        usersArray.push({
          id: item.id,
          label: item.get("FullName"),
        });
      });

      setAllUsers(usersArray);
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const allDateValues = [
    "Today",
    "This Week",
    "This Month",
    "This Year",
    "Custom",
  ];
  // const [userFilter, setUserFilter] = useState({ id: "", label: "" });
  const [userFilter, setUserFilter] = useState<optionObj[]>([]);
  // const [userFilter, setUserFilter] = useState([{ id: "", label: "" }]);
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState<any>("");
  const [endDateFilter, setEndDateFilter] = useState<any>("");
  useEffect(() => {
    getWidgetsData(
      userFilter[0]?.id,
      typeFilter,
      dateFilter,
      startDateFilter,
      endDateFilter
    );
    getAllTransactionData(
      userFilter[0]?.id,
      typeFilter,
      dateFilter,
      startDateFilter,
      endDateFilter
    );
  }, [userFilter[0]?.id, typeFilter, dateFilter, startDateFilter, endDateFilter]);

  const userWalletData = (userId: string) => {
    const parseQuery = new Parse.Query("_User");
    parseQuery.notEqualTo("UserType", "Cloud");
    parseQuery.limit(5000);
    if (userId) {
      parseQuery.equalTo("objectId", userId);
    }
    let totalCredited = 0;

    parseQuery.find().then((result: any[]) => {
      result.forEach((item) => {
        totalCredited = item.get("Credit")
          ? totalCredited + item.get("Credit")
          : totalCredited + 0;
      });
      setWalletBalance({
        total: totalCredited,
      });
    });
  };
  useEffect(() => {
    userWalletData(userFilter[0]?.id);
  }, [userFilter[0]?.id]);
  useEffect(() => {
    getRevenueData(
      userFilter[0]?.id,
      dateFilter,
      startDateFilter,
      endDateFilter,
      typeFilter
    );
  }, [userFilter[0]?.id, dateFilter, startDateFilter, endDateFilter, typeFilter]);

  const filterOptions = (options: optionObj[], { inputValue }: { inputValue: string }) => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
      
    );
  };

  console.log("Filterd allUsers",tableData)

  return (
    <div className="transaction-container">
      <div className="topRow">
        <div className="dwidgets">
          <Widget type="wallet" data={walletBalance} />
          <Widget type="revenue" data={billedRevenue} />
          <Widget type="transaction" data={transaction} />
        </div>
       
      </div>
      <div className="transaction_table_container flex">
        <div style={{width:'100%'}}>
        <button onClick={handleFilterButtonClick}>
          Filter
        </button>
      <DatabaseTable dataRow={tableData} loading={tableLoading} />
        </div>
        {isFilterVisible && (
           <div className="filters">
           {/* <Autocomplete
           multiple
             sx={{ width: 200 }}
             options={allUsers}
             autoHighlight
             size="small"
             onChange={(event: any, newValue: any) => {
              {console.log('newValue',newValue)}
               newValue
                 ? setUserFilter(newValue)
                 : setUserFilter({ id: "", label: "" });
             }}
             filterOptions={filterOptions}
             renderInput={(params) => <TextField {...params} label="Users" />}
           /> */}
         <Autocomplete
  multiple
  sx={{ width: 200 }}
  // options={allUsers}
  options={allUsers || []}
  autoHighlight
  size="small"
  value={userFilter}
  onChange={(event: any, newValue: any) => {
    console.log('newValue', newValue);
    newValue && setUserFilter(newValue) 
    // : setUserFilter({ id: "", label: "" });
  }}
  isOptionEqualToValue={(option: optionObj, value: optionObj) => option.id === value.id}
  getOptionLabel={(option: optionObj) => option.label}
  filterOptions={(options, { inputValue }) =>
    options.filter(
      (option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  }
  renderInput={(params) => <TextField {...params} label="Users" />}
/>
 
           <Autocomplete
             sx={{ width: 250 }}
             options={allTypes}
             autoHighlight
             size="small"
             onChange={(event: any, newValue: any) => {
               newValue ? setTypeFilter(newValue) : setTypeFilter("");
             }}
             renderInput={(params) => <TextField {...params} label="Type" />}
           />
 
           <Autocomplete
             sx={{ width: 200 }}
             options={allDateValues}
             autoHighlight
             size="small"
             onChange={(event: any, newValue: any) => {
               newValue ? setDateFilter(newValue) : setDateFilter("");
             }}
             renderInput={(params) => <TextField {...params} label="Date" />}
           />
           {dateFilter === "Custom" ? (
             <div className="dateSec">
               <LocalizationProvider dateAdapter={AdapterMoment}>
                 <DatePicker
                   label="Start Date"
                   value={startDateFilter}
                   onChange={(item) => setStartDateFilter(item || "")}
                   renderInput={(params) => (
                     <TextField {...params} error={false} />
                   )}
                   inputFormat="DD-MM-YYYY"
                 />
               </LocalizationProvider>
               <LocalizationProvider dateAdapter={AdapterMoment}>
                 <DatePicker
                   label="End Date"
                   value={endDateFilter}
                   onChange={(item) => setEndDateFilter(item || "")}
                   renderInput={(params) => (
                     <TextField {...params} error={false} />
                   )}
                   inputFormat="DD-MM-YYYY"
                 />
               </LocalizationProvider>
             </div>
           ) : (
             ""
           )}
         </div>
        )
        }
     
      </div>
    </div>
  );
});

export default Transaction;
   {/* <Autocomplete
      multiple
      sx={{ width: 200 }}
      options={allUsers}
      autoHighlight
      size="small"
      onChange={(event: any, newValue: any) => {
        newValue
          ? setUserFilter(newValue)
          : setUserFilter({ id: "", label: "" });
      }}
      getOptionLabel={(option) => option.title}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
           {/* <TextField label="Users" /> */}
          {/* /* {option.label} */}
          {/* {console.log("options",option)} */}
        {/* </li> */}
        // )}
        // style={{ width: 500 }}
        // renderInput={(params) => (
        //   <TextField {...params} label="Checkboxes" placeholder="Users" />
        // )}
      // /> */











      // Working code till filter chip delete and filter
//       import { Autocomplete, Chip, TextField } from "@mui/material";
// import moment from "moment";
// import { memo, useEffect, useState } from "react";
// import Sidebar from "../../components/sidebar";
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import Checkbox from '@mui/material/Checkbox';


// import DatabaseTable from "./databasetable";
// import Widget from "./widget";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import "./transaction.scss";
// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;
// interface optionObj {
//   id: string;
//   label: string;
// }
// const Transaction = memo(() => {
//   const [isFilterVisible, setIsFilterVisible] = useState(false);
//   const [userFilterOn, setUserFilterOn] = useState(false);
//   const [userFilter, setUserFilter] = useState({ id: "", label: "" });
//   const [filterData,setFilterData] = useState<any>([]);
//   const [tableData, setTableData] = useState<any>([]);
//   const [filterChips, setFilterChips] = useState<any[]>([]);

//   // Function to handle filter button click
//   const handleFilterButtonClick = () => {
//     // Toggle filter visibility
//     setIsFilterVisible((prev) => !prev);
//   };

//   // Widget Data
//   const [walletBalance, setWalletBalance] = useState({
//     total: 0,
//   });
//   const [billedRevenue, setBilledRevenue] = useState<any>({
//     total: null,
//   });
//   const [transaction, setTransaction] = useState({
//     total: 0,
//   });
//   const getRevenueData = (
//     userId: string,
//     date: string,
//     startDate: string | Date,
//     endDate: string | Date,
//     type: any
//   ) => {
//     const ChargeSession = Parse.Object.extend("ChargeSession");
//     const parseQuery = new Parse.Query(ChargeSession);
//     if (userId) {
//       let User = Parse.User;
//       let userObj = User.createWithoutData(userId);
//       parseQuery.equalTo("User", userObj);
//     }
//     if (date) {
//       if (date === "Today") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("day").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().add(1, "day").startOf("day").toString())
//         );
//       } else if (date === "This Month") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("month").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().endOf("month").toString())
//         );
//       } else if (date === "This Week") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("week").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().endOf("week").toString())
//         );
//       } else if (date === "This Year") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("year").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().endOf("year").toString())
//         );
//       }
//     }

//     if (startDate) {
//       parseQuery.greaterThanOrEqualTo("createdAt", new Date(startDate));
//     }
//     if (endDate) {
//       parseQuery.lessThanOrEqualTo("createdAt", new Date(endDate));
//     }
//     parseQuery.limit(5000);
//     parseQuery.find().then((result) => {
//       let totalEnergy = 0;

//       let totalMoney = 0;

//       let totalSession = 0;

//       result.forEach((item, index) => {
//         totalEnergy = item.get("TotalEnergyConsumed")
//           ? item.get("TotalEnergyConsumed") + totalEnergy
//           : 0 + totalEnergy;
//         totalMoney = item.get("TotalCost")
//           ? item.get("TotalCost") + totalMoney
//           : 0 + totalMoney;
//         totalSession = totalSession + 1;
//       });
//       if (type === "Credit") {
//         setBilledRevenue({
//           total: null,
//         });
//       } else {
//         setBilledRevenue({
//           total: totalMoney,
//         });
//       }
//     });
//   };
//   const [tableLoading, setTableLoading] = useState(false);
//   const getWidgetsData = (
//     userId: string,
//     type: string,
//     date: string,
//     startDate: string | Date,
//     endDate: string | Date
//   ) => {
//     setTableLoading(true);
//     const Transactions = Parse.Object.extend("Transactions");
//     const parseQuery = new Parse.Query(Transactions);
//     if (userId) {
//       let User = Parse.User;
//       let userObj = User.createWithoutData(userId);
//       parseQuery.equalTo("User", userObj);
//     }
//     if (type) {
//       parseQuery.equalTo("Type", type);
//     }
//     if (date) {
//       if (date === "Today") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("day").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().add(1, "day").startOf("day").toString())
//         );
//       } else if (date === "This Month") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("month").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().endOf("month").toString())
//         );
//       } else if (date === "This Week") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("week").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().endOf("week").toString())
//         );
//       } else if (date === "This Year") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("year").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().endOf("year").toString())
//         );
//       }
//     }

//     if (startDate) {
//       parseQuery.greaterThanOrEqualTo("createdAt", new Date(startDate));
//     }
//     if (endDate) {
//       parseQuery.lessThanOrEqualTo("createdAt", new Date(endDate));
//     }
//     parseQuery.descending("createdAt");
//     parseQuery.limit(5000);
//     parseQuery.find().then((result) => {
//       let newRow: {
//         id: any;
//         customer: string;
//         type: string;
//         amount: string;
//         detail: string;
//         createdAt: string;
//       }[] = [];
//       let totalCredited = 0;
//       let totalDebited = 0;
//       let totalTransaction = 0;
//       result.forEach((item, index) => {
//         totalCredited =
//           item.get("Type") === "Credit"
//             ? item.get("Amount") + totalCredited
//             : 0 + totalCredited;
//         totalDebited =
//           item.get("Type") === "Debit"
//             ? item.get("Amount") + totalDebited
//             : 0 + totalDebited;
//         totalTransaction = totalTransaction + 1;
//         newRow.push({
//           id: item.id,
//           customer: `${item.get("User").get("FullName")}`,
//           type: `${item.get("Type")}`,
//           amount: `₹${item.get("Amount")?.toFixed(2)}`,
//           detail: `${item.get("Detail")}`,
//           createdAt: `${
//             moment(item.get("createdAt")).format("lll")
//               ? moment(item.get("createdAt")).format("lll")
//               : "-"
//           }`,
//         });
//       });
//       console.log("new Row",newRow)
//       setTableData(newRow);
//       setTableLoading(false);
//       setTransaction({
//         total: totalTransaction,
//       });
//     });
//   };

//   // Filters Data

//   const [allUsers, setAllUsers] = useState<any | null>([]);

//   const allTypes = ["Credit", "Debit"];
//   //Tabel
  

//   const getAllTransactionData = (
//     userId: string[],
//     type: string,
//     date: string,
//     startDate: string | Date,
//     endDate: string | Date
//   ) => {
//     setFilterData([])
//     const parseQuery = new Parse.Query("Transactions");
//     if (userId) {
//       const userObjects = userId.map((userID) => {
//         let User = Parse.User;
//         return User.createWithoutData(userID);
//       });
//     parseQuery.containedIn("User", userObjects);
//     parseQuery.find().then((result) => {
//       console.log("filter result: " , result);
      
//       let newRow: {
//         id: any;
//         customer: string;
//         type: string;
//         amount: string;
//         detail: string;
//         createdAt: string;
//       }[] = [];
//       let totalCredited = 0;
//       let totalDebited = 0;
//       let totalTransaction = 0;
//       result.forEach((item, index) => {
//         totalCredited =
//           item.get("Type") === "Credit"
//             ? item.get("Amount") + totalCredited
//             : 0 + totalCredited;
//         totalDebited =
//           item.get("Type") === "Debit"
//             ? item.get("Amount") + totalDebited
//             : 0 + totalDebited;
//         totalTransaction = totalTransaction + 1;
//         newRow.push({
//           id: item.id,
//           customer: `${item.get("User").get("FullName")}`,
//           type: `${item.get("Type")}`,
//           amount: `₹${item.get("Amount")?.toFixed(2)}`,
//           detail: `${item.get("Detail")}`,
//           createdAt: `${
//             moment(item.get("createdAt")).format("lll")
//               ? moment(item.get("createdAt")).format("lll")
//               : "-"
//           }`,
//         });
//       });
//       console.log("Filter new Row",newRow)
//       setFilterData(newRow);
//       setTableLoading(false);
//       setTransaction({
//         total: totalTransaction,
//       });
//     });
//     }
//     if (type) {
//       parseQuery.equalTo("Type", type);
//     }
//     if (date) {
//       if (date === "Today") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("day").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().add(1, "day").startOf("day").toString())
//         );
//       } else if (date === "This Week") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("week").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().endOf("week").toString())
//         );
//       } else if (date === "This Month") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("month").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().endOf("month").toString())
//         );
//       } else if (date === "This Year") {
//         parseQuery.greaterThanOrEqualTo(
//           "createdAt",
//           new Date(moment().startOf("year").toString())
//         );
//         parseQuery.lessThanOrEqualTo(
//           "createdAt",
//           new Date(moment().endOf("year").toString())
//         );
//       }
//     }

//     if (startDate) {
//       parseQuery.greaterThanOrEqualTo("createdAt", new Date(startDate));
//     }
//     if (endDate) {
//       parseQuery.lessThanOrEqualTo("createdAt", new Date(endDate));
//     }

//     parseQuery.include("User");
//     parseQuery.include("Type");
//     parseQuery.include("Amount");
//     parseQuery.include("Detail");

//     parseQuery.descending("createdAt");
//     parseQuery.limit(1000);
//     parseQuery.find().then((result: any[]) => {
//       console.log("filter result:", result);
  
//       // Process the result
//       let newRow: {
//         id: any;
//         customer: string;
//         type: string;
//         amount: string;
//         detail: string;
//         createdAt: string;
//       }[] = [];
//       let totalCredited = 0;
//       let totalDebited = 0;
//       let totalTransaction = 0;
  
//       result.forEach((item, index) => {
//         // ... (your processing logic)
  
//         newRow.push({
//           id: item.id,
//           customer: `${item.get("User").get("FullName")}`,
//           type: `${item.get("Type")}`,
//           amount: `₹${item.get("Amount")?.toFixed(2)}`,
//           detail: `${item.get("Detail")}`,
//           createdAt: `${
//             moment(item.get("createdAt")).format("lll")
//               ? moment(item.get("createdAt")).format("lll")
//               : "-"
//           }`,
//         });
//       });
  
//       console.log("Filter new Row", newRow);
//       setFilterData(newRow);
//       setTableLoading(false);
//       setTransaction({
//         total: totalTransaction,
//       });
//     });
//   };

//   // Filters
//   const getAllUsers = () => {
//     const User = Parse.Object.extend("User");
//     const parseQuery = new Parse.Query(User);
//     parseQuery.notEqualTo("UserType", "Cloud");
//     parseQuery.limit(1000);
//     parseQuery.find().then((result) => {
//       let usersArray: optionObj[] = [];
//       result.forEach((item) => {
//         usersArray.push({
//           id: item.id,
//           label: item.get("FullName"),
//         });
//       });

//       setAllUsers(usersArray);
//     });
//   };

//   useEffect(() => {
//     getAllUsers();
//   }, []);

//   const allDateValues = [
//     "Today",
//     "This Week",
//     "This Month",
//     "This Year",
//     "Custom",
//   ];
//   // const [userFilter, setUserFilter] = useState([{ id: "", label: "" }]);
//   const [typeFilter, setTypeFilter] = useState("");
//   const [dateFilter, setDateFilter] = useState("");
//   const [startDateFilter, setStartDateFilter] = useState<any>("");
//   const [endDateFilter, setEndDateFilter] = useState<any>("");

//   useEffect(() => {
//     console.log("userFilter",userFilter)
//     const userIds = Array.isArray(userFilter)
//       ? userFilter.map(user => user.id)
//       : [userFilter?.id].filter(Boolean) as string[];
//      console.log("users Id",userIds)
//     if (userIds.length > 0) {
//       getAllTransactionData(
//         userIds,
//         typeFilter,
//         dateFilter,
//         startDateFilter,
//         endDateFilter
//       );
//     }

//     getWidgetsData(
//           userFilter.id,
//           typeFilter,
//           dateFilter,
//           startDateFilter,
//           endDateFilter
//         );

//   }, [userFilter, typeFilter, dateFilter, startDateFilter, endDateFilter]);
  

//   const userWalletData = (userId: string) => {
//     const parseQuery = new Parse.Query("_User");
//     parseQuery.notEqualTo("UserType", "Cloud");
//     parseQuery.limit(5000);
//     if (userId) {
//       parseQuery.equalTo("objectId", userId);
//     }
//     let totalCredited = 0;

//     parseQuery.find().then((result: any[]) => {
//       result.forEach((item) => {
//         totalCredited = item.get("Credit")
//           ? totalCredited + item.get("Credit")
//           : totalCredited + 0;
//       });
//       setWalletBalance({
//         total: totalCredited,
//       });
//     });
//   };
//   useEffect(() => {
//     userWalletData(userFilter.id);
//   }, [userFilter.id]);
//   useEffect(() => {
//     getRevenueData(
//       userFilter.id,
//       dateFilter,
//       startDateFilter,
//       endDateFilter,
//       typeFilter
//     );
//   }, [userFilter.id, dateFilter, startDateFilter, endDateFilter, typeFilter]);

//   const filterOptions = (options: optionObj[], { inputValue }: { inputValue: string }) => {
//     return options.filter((option) =>
//       option.label.toLowerCase().includes(inputValue.toLowerCase())
      
//     );
//   };

//   console.log("tableData",tableData)
//   console.log("condition userFilter",userFilter)

//   // const handleDeleteChip = (chipId: string) => {
//   //   // Remove the corresponding chip from the state
//   //   setFilterChips((prevChips) => prevChips.filter((chip) => chip.id !== chipId));
  
//   //   // Handle clearing the specific filter based on the chipId
//   //   switch (chipId) {
//   //     case "user":
//   //       setUserFilter({ id: "", label: "" });
//   //       setUserFilterOn(false);
//   //       break;
//   //     // Handle other filter types as needed
//   //     default:
//   //       break;
//   //   }
//   // };
//   // const handleDeleteChip = (chipId: { id: string; label: string }) => {
//   //   // Remove the corresponding chip from the state
//   //   setFilterChips((prevChips) => prevChips.filter((chip) => chip.id !== chipId.id));
//   //   console.log("chipId",chipId)
//   //   setUserFilter({ id: "", label: "" });
  
//   //   // Handle clearing the specific filter based on the chipId
//   //   switch (chipId.id) {
//   //     case "user":
//   //       setUserFilterOn(false);
//   //       break;
//   //     // Handle other filter types as needed
//   //     default:
//   //       break;
//   //   }
//   // };
//   const handleDeleteChip = (chipId: string) => {
//     // Remove the corresponding chip from the state
//     setFilterChips((prevChips) => prevChips.filter((chip) => chip.id !== chipId));
  
//     // Handle clearing the specific filter based on the chipId
//     switch (chipId) {
//       case "user":
//         setUserFilter({ id: "", label: "" });
//         setUserFilterOn(false);
        
//         break;
//       // Handle other filter types as needed
//       // ...
  
//       default:
//         break;
//     }

//   };
  
  
  

//   return (
//     <div className="transaction-container">
      
//       <div className="transaction_table_container flex">
//         <div style={{width:'100%'}}>
//           <div className="flex justify-between mx-6 mt-8">
//             <h2>Transaction</h2>
//           <button className="rounded-full p-3 border-2 border-black-600" onClick={handleFilterButtonClick}>
//           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
//   <path d="M3 3H15V4.629C14.9999 5.02679 14.8418 5.40826 14.5605 5.6895L11.25 9V14.25L6.75 15.75V9.375L3.39 5.679C3.13909 5.40294 3.00004 5.0433 3 4.67025V3Z" stroke="#111111" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
// </svg>
//         </button>

//           </div>
//           <div className="filter-chips-container">
//   {/* {filterChips.map((chip) => (
//     <Chip
//       key={chip.id}
//       label={chip.label}
//       onDelete={() => handleDeleteChip(chip.id)}
//       color="primary"
//       variant="outlined"
//     />
//   ))}
//    */}
//    {filterChips.map((chip) => (
//   <Chip
//     key={chip.id}
//     label={chip.label}
//    onDelete={() => handleDeleteChip(chip.id)} 

//     color="primary"
//     variant="outlined"
//   />
// ))}

// </div>

        
//         <div className="topRow">
//         <div className="dwidgets">
//           <Widget type="wallet" data={walletBalance} />
//           <Widget type="revenue" data={billedRevenue} />
//           <Widget type="transaction" data={transaction} />
//         </div>
       
//       </div>
        
//       {/* <DatabaseTable dataRow={tableData} loading={tableLoading} /> */}
//       {/* <DatabaseTable dataRow={userFilterOn == true ? filterData  :tableData} loading={tableLoading} /> */}
//       <DatabaseTable dataRow={userFilter?.id == ""  ? tableData  :filterData} loading={tableLoading} />
//         </div>
//         {isFilterVisible && (
//            <div className="filters mt-6">
//            <Autocomplete
//            multiple
//            limitTags={-1}
//              sx={{ width: 200 }}
//              options={allUsers}
//              autoHighlight
//              size="small"
//              onChange={(event: any, newValue: any) => {
            
//               if (newValue) {
//                 setUserFilter(newValue);
//                 setUserFilterOn(true);
//                 // setFilterChips((prevChips: any[]) => [
//                 //   ...prevChips,
//                 //   { id: "user", label: "Users: " + (newValue as any[]).map((user) => user.label).join(", ") },
//                 // ]);
//                 // setFilterChips((prevChips: any[]) => [
//                 //   ...prevChips,
//                 //   ...newValue.map((user :any) => ({ id: user.id, label: `User: ${user.label}` })),
//                 // ]);

//                 const newChips = newValue.map((user :any) => ({ id: user.id, label: `User: ${user.label}` }));
//                 const filteredChips = newChips.filter((chip:any) => !filterChips.some((prevChip) => prevChip.id === chip.id));
          
//                 setFilterChips((prevChips: any[]) => [...prevChips, ...filteredChips]);
//               }
//             }}
//             //  filterOptions={filterOptions}
//              renderInput={(params) => <TextField {...params} label="Users" />}
//            />
         
 
//            <Autocomplete
//              sx={{ width: 250 }}
//              options={allTypes}
//              autoHighlight
//              size="small"
//              onChange={(event: any, newValue: any) => {
//                newValue ? setTypeFilter(newValue) : setTypeFilter("");
//              }}
//              renderInput={(params) => <TextField {...params} label="Type" />}
//            />
 
//            <Autocomplete
//              sx={{ width: 200 }}
//              options={allDateValues}
//              autoHighlight
//              size="small"
//              onChange={(event: any, newValue: any) => {
//                newValue ? setDateFilter(newValue) : setDateFilter("");
//              }}
//              renderInput={(params) => <TextField {...params} label="Date" />}
//            />
//            {dateFilter === "Custom" ? (
//              <div className="dateSec">
//                <LocalizationProvider dateAdapter={AdapterMoment}>
//                  <DatePicker
//                    label="Start Date"
//                    value={startDateFilter}
//                    onChange={(item) => setStartDateFilter(item || "")}
//                    renderInput={(params) => (
//                      <TextField {...params} error={false} />
//                    )}
//                    inputFormat="DD-MM-YYYY"
//                  />
//                </LocalizationProvider>
//                <LocalizationProvider dateAdapter={AdapterMoment}>
//                  <DatePicker
//                    label="End Date"
//                    value={endDateFilter}
//                    onChange={(item) => setEndDateFilter(item || "")}
//                    renderInput={(params) => (
//                      <TextField {...params} error={false} />
//                    )}
//                    inputFormat="DD-MM-YYYY"
//                  />
//                </LocalizationProvider>
//              </div>
//            ) : (
//              ""
//            )}
//          </div>
//         )
//         }
     
//       </div>
//     </div>
//   );
// });

// export default Transaction;



