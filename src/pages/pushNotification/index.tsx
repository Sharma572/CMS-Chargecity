import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";

import AddIcon from "@mui/icons-material/Add";
import "./pushNotification.scss";
import moment from "moment";
import { Form } from "react-router-dom";

const Pushnotification = memo(() => {
  //Table

  const [deviceType, setDeviceType] = useState<string | null>("");
  const [message, setMessage] = useState<string>("");

  const getAllDevicesData = (device: any) => {
    const parseQuery = new Parse.Query("_Installation");
    if (device) {
      parseQuery.equalTo("deviceType", device);
    }
    parseQuery.include("User");

    parseQuery.limit(100);
    parseQuery.find().then((result: any[]) => {
      let newRow: any[] = [];
      result.forEach((item, index) => {
        let ab = item.get("User");
        newRow.push({
          ab,
        });
      });
    });
  };
  const handleSendPushNotificataion = () => {
    try {
      const params = {
        message: message,
        deviceType: deviceType ? deviceType : "all",
      };

      Parse.Cloud.run("sendPushMessage", params).then(
        (status) => {
          alert("Push Sent");
        },
        (error: any) => {
          alert("Failed to send message, with error code: " + error.message);
        }
      );
    } catch (error: any) {
      alert("Failed to send message, with error code: " + error.message);
    }
  };

  return (
    <div className="notification-container">
      <div className="notifications">
        <div className="top">
          <h1>Push Notifications</h1>
          {/* <Button onClick={() => setOpenInvoice(true)}>
            {" "}
            Generate Invoice
          </Button> */}
        </div>
        <div className="mid">
          <h4 style={{ color: "white" }}> Devices</h4>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="all"
                control={
                  <Radio
                    onChange={() => {
                      getAllDevicesData(null);

                      setDeviceType(null);
                    }}
                  />
                }
                label="All"
                sx={{ color: "white" }}
              />
              <FormControlLabel
                value="android"
                control={
                  <Radio
                    onChange={() => {
                      getAllDevicesData("android");
                      setDeviceType("android");
                    }}
                  />
                }
                label="Android"
                sx={{ color: "white" }}
              />
              <FormControlLabel
                value="ios"
                control={
                  <Radio
                    onChange={() => {
                      getAllDevicesData("ios");
                      setDeviceType("ios");
                    }}
                  />
                }
                label="iOS"
                sx={{ color: "white" }}
              />
            </RadioGroup>
          </FormControl>

          {/* <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            User Type
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="all"
              control={<Radio onChange={() => getAllDevicesData(null)} />}
              label="All"
            />
            <FormControlLabel
              value="charged"
              control={<Radio onChange={() => getAllDevicesData("android")} />}
              label="Charged"
            />
            <FormControlLabel
              value="notCharged"
              control={<Radio onChange={() => getAllDevicesData("ios")} />}
              label="Never Charged"
            />
          </RadioGroup>
        </FormControl> */}
          <br />
          <br />
          <h4 style={{ color: "white" }}> Message</h4>
          <FormControl>
            <TextField
              sx={{ width: 1000, backgroundColor: "white" }}
              variant="outlined"
              fullWidth
              multiline
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minRows={5}
              size="small"
            />
          </FormControl>
          <br />
          <br />
          <Button
            variant="contained"
            autoFocus
            fullWidth
            sx={{ width: 200 }}
            onClick={() => handleSendPushNotificataion()}
          >
            {" "}
            Send
          </Button>
        </div>
        <div></div>
      </div>
    </div>
  );
});

export default Pushnotification;
