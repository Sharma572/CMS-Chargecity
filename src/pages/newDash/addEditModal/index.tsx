import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  alpha,
  InputBase,
  styled,
  Stack,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import uuid4 from "uuid4";
interface PropTypes {
  show: boolean;
  handleClose: any;
  type: string;
  data: any;
  refresh: any;
}

const Input = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",

    border: "1px solid #ced4da",
    fontSize: 16,

    padding: "10px 12px",
    marginBottom: "20px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

function AddEditModal(props: PropTypes) {
  const locationInitialValues = {
    countryCode: "IND",
    partyId: "CC",
    id: "",
    publish: true,
    address: "",
    city: "",
    country: "India",
    lat: 0,
    long: 0,
    timeZone: "UTC+05:30",
  };
  const evsesInitialValues = {
    uid: "",
    status: "AVAILABLE",
    evseID: uuid4(),
  };
  const connectorsInitialValues = {
    id: "",
    standard: "",
    format: "",
    powerType: "",
    maxVoltage: "",
    maxAmperage: "",
  };

  const [locationValues, setLocationValues] = useState(locationInitialValues);

  const [evsesValues, setEvsesValues] = useState(evsesInitialValues);

  const [connectorValues, setConnectorValues] = useState(
    connectorsInitialValues
  );

  const [allLocationData, setAllLocationData] = useState<any>([]);
  const getAllLocations = () => {
    const Locations = Parse.Object.extend("Locations");

    const parseQuery = new Parse.Query(Locations);
    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let locationArray: any[] = [];

      result.forEach((item, index) => {
        locationArray.push({
          id: item.id,
          name: `${item.get("Name")}`,
          lat: item.get("GeoLocation")._latitude,
          long: item.get("GeoLocation")._longitude,
          city: item.get("City"),
          country: item.get("Country"),
          address: `${item.get("Address")}`,
        });
      });
      setAllLocationData(locationArray);
    });
  };
  useEffect(() => {
    getAllLocations();
  }, []);

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: 1500,
          height: 1000,
        },
      }}
      maxWidth={"md"}
      open={props.show}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <div className="headItem">
          <span className="head1">
            {" "}
            {props.type == "add" ? "Add " : "Edit"}
          </span>{" "}
          <span className="head2" onClick={props.handleClose}>
            <CloseIcon />
          </span>
        </div>
      </DialogTitle>

      <DialogContent>
        <Stack direction="column" spacing={1}>
          <h5>Location </h5>
          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Address <small>*</small>
            </InputLabel>
            <Select
              inputProps={{ "aria-label": "Without label" }}
              value={locationValues.address}
            >
              <MenuItem value="">
                <em>Type</em>
              </MenuItem>
              {allLocationData.map(
                (
                  item: {
                    long: number;
                    lat: number;
                    city: string;
                    address: string;
                  },
                  idx: React.Key | null | undefined
                ) => (
                  <MenuItem
                    key={idx}
                    value={item.address}
                    onClick={() =>
                      setLocationValues({
                        ...locationValues,
                        address: item.address,
                        city: item.city,
                        lat: item.lat,
                        long: item.long,
                      })
                    }
                  >
                    {item.address}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Country Code
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={locationValues.countryCode}
              onChange={(e) =>
                setLocationValues({
                  ...locationValues,
                  countryCode: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Party Id
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={locationValues.partyId}
              onChange={(e) =>
                setLocationValues({
                  ...locationValues,
                  partyId: e.target.value,
                })
              }
            />
          </FormControl>
          <Stack direction="row" spacing={8}>
            <FormControl variant="standard" sx={{ width: 400 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                City <small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={locationValues.city}
                onChange={(e) =>
                  setLocationValues({
                    ...locationValues,
                    city: e.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl variant="standard" sx={{ width: 400 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Country
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={locationValues.country}
                disabled
              />
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={8}>
            <FormControl variant="standard" sx={{ width: 400 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Latitude <small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={locationValues.lat}
                onChange={(e: any) =>
                  setLocationValues({
                    ...locationValues,
                    lat: e.target.value,
                  })
                }
              />
            </FormControl>

            <FormControl variant="standard" sx={{ width: 400 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Longitude
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={locationValues.long}
                onChange={(e: any) =>
                  setLocationValues({
                    ...locationValues,
                    long: e.target.value,
                  })
                }
              />
            </FormControl>
          </Stack>

          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Timezone
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={locationValues.timeZone}
              disabled
            />
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={locationValues.publish}
                onChange={() =>
                  setLocationValues({
                    ...locationValues,
                    publish: locationValues.publish === true ? false : true,
                  })
                }
                name="antoine"
              />
            }
            label="Enable Location"
          />
          <br />

          <h5>EVSEs</h5>
          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              EVSE Id
            </InputLabel>
            <Input id="bootstrap-input" value={evsesValues.evseID} />
          </FormControl>
          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Status <small>*</small>
            </InputLabel>
            <Select
              inputProps={{ "aria-label": "Without label" }}
              value={evsesValues.status}
            >
              <MenuItem value="">
                <em>Type</em>
              </MenuItem>
              {["AVAILABLE", "UNAVAILABLE"].map((item, idx) => (
                <MenuItem
                  key={idx}
                  value={item}
                  onClick={() =>
                    setEvsesValues({
                      ...evsesValues,
                      status: item,
                    })
                  }
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <h5>Connectors</h5>
          <br />
          <Stack direction="row" spacing={8}>
            <FormControl variant="standard" sx={{ width: 400 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Standard <small>*</small>
              </InputLabel>
              <Select
                inputProps={{ "aria-label": "Without label" }}
                value={connectorValues.standard}
              >
                <MenuItem value="">
                  <em>Type</em>
                </MenuItem>
                {[
                  {
                    value: "GBT_AC",
                    label: "GBT_AC (Guobiao GB/T 20234.2 AC connector)",
                  },
                  {
                    value: "GBT_DC",
                    label: "GBT_DC (Guobiao GB/T 20234.3 DC connector)",
                  },
                  {
                    value: "ICE_62196_T2",
                    label: "ICE_62196_T2 (ICE 62196 T2 Mennekes)",
                  },
                  {
                    value: "ICE_62196_T2_COMBO",
                    label: "ICE_62196_T2_COMBO (Combo Type 2 based, DC)",
                  },
                  {
                    value: "IEC_60309_2_single_16",
                    label:
                      " IEC_60309_2_single_16 (IEC 60309-2 Industrial Connector three phases 16 amperes (usually blue))",
                  },
                  {
                    value: "IEC_60309_2_three_16",
                    label:
                      "IEC_60309_2_three_16 (IEC 60309-2 Industrial Connector three phases 16 amperes (usually red))",
                  },
                ].map((item, idx) => (
                  <MenuItem
                    key={idx}
                    value={item.value}
                    onClick={() => {
                      ["GBT_DC", "ICE_62196_T2_COMBO"].includes(item.value)
                        ? setConnectorValues({
                            ...connectorValues,
                            standard: item.value,
                            powerType: "DC",
                          })
                        : setConnectorValues({
                            ...connectorValues,
                            standard: item.value,
                            powerType: "AC",
                          });
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ width: 400 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Format <small>*</small>
              </InputLabel>
              <Select
                inputProps={{ "aria-label": "Without label" }}
                value={connectorValues.format}
              >
                <MenuItem value="">
                  <em>Type</em>
                </MenuItem>
                {["SOCKET", "CABLE"].map((item, idx) => (
                  <MenuItem
                    key={idx}
                    value={item}
                    onClick={() =>
                      setConnectorValues({
                        ...connectorValues,
                        format: item,
                      })
                    }
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Power Type
            </InputLabel>
            <Input id="bootstrap-input" value={connectorValues.powerType} />
          </FormControl>

          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Max Voltage
            </InputLabel>
            <Input
              id="bootstrap-input"
              type="number"
              value={connectorValues.maxVoltage}
              onChange={(e) =>
                setConnectorValues({
                  ...connectorValues,
                  maxVoltage: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Max Amperage
            </InputLabel>
            <Input
              id="bootstrap-input"
              type="number"
              value={connectorValues.maxAmperage}
              onChange={(e) =>
                setConnectorValues({
                  ...connectorValues,
                  maxAmperage: e.target.value,
                })
              }
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" autoFocus fullWidth>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEditModal;
