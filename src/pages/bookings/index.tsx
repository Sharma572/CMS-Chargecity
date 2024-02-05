import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import DatabaseTable from "./databasetable";
import AddIcon from "@mui/icons-material/Add";
import "./bookings.scss";
import moment from "moment";

const Bookings = memo(() => {
  //Tabel
  const [tableData, setTableData] = useState<any>([]);
  const [immutatedTableData, setImmutedTableData] = useState<any>([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);

  const currentUser: any = Parse.User.current();
  const [tableLoading, setTableLoading] = useState(false);
  const getAllBookingsData = () => {
    setTableLoading(true);
    const parseQuery = new Parse.Query("Bookings");

    parseQuery.include("User");
    parseQuery.include("ChargePoint");
    parseQuery.limit(100);
    if (currentUser) {
      var innerQuery = new Parse.Query("Chargers");

      innerQuery.equalTo("CPO", currentUser.get("CPO"));
      parseQuery.matchesQuery("ChargePoint", innerQuery);
    }

    parseQuery.find().then((result: any[]) => {
      let newRow: any[] = [];
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
          id: index + 1,
          name: `${item.get("User")?.get("FullName")}`,
          mobileNumber: `${
            item.get("User")?.get("Phone")
              ? item.get("User")?.get("Phone")
              : "-"
          }  `,
          startTime: `${moment(item.get("createdAt")).format("lll")}`,
          endTime: `${moment(item.get("updatedAt")).format("lll")}`,
          serial: `${item.get("ChargePoint")?.get("Serial")}`,
          duration: `${item.get("Duration")}`,
          status: `${
            moment().isAfter(item.get("createdAt")) && !item.get("isCancelled")
          }`,
          upcoming: `${
            moment().isBefore(item.get("createdAt")) && !item.get("isCancelled")
          }`,
          expired: `${
            moment().isAfter(item.get("createdAt")) && !item.get("isCancelled")
          }`,
          cancelled: `${item.get("isCancelled")}`,
          obj: item,
        });
      });
      setTableData(newRow);
      setTableLoading(false);
      setImmutedTableData(newRow);
    });
  };

  useEffect(() => {
    getAllBookingsData();
  }, []);
  return (
    <div className="booking-container">
      <div className="filter">
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            Booking Status
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="female"
              control={
                <Radio
                  onChange={() =>
                    setTableData(
                      immutatedTableData.filter(
                        (item: any) => item.upcoming === "true"
                      )
                    )
                  }
                />
              }
              label="Upcoming"
            />
            <FormControlLabel
              value="male"
              control={
                <Radio
                  onChange={() =>
                    setTableData(
                      immutatedTableData.filter(
                        (item: any) => item.expired === "true"
                      )
                    )
                  }
                />
              }
              label="Expired"
            />
            <FormControlLabel
              value="other"
              control={
                <Radio
                  onChange={() =>
                    setTableData(
                      immutatedTableData.filter(
                        (item: any) => item.cancelled === "true"
                      )
                    )
                  }
                />
              }
              label="Cancelled"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <DatabaseTable
        dataRow={tableData}
        refresh={() => getAllBookingsData()}
        loading={tableLoading}
      />
    </div>
  );
});

export default Bookings;
