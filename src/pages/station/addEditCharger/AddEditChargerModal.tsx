import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  alpha,
  InputBase,
  styled,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
  Switch,
  FormLabel,
  TextareaAutosize,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "../../../store/store";
import "./addEdit.scss";
import Select from "@mui/material/Select";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
interface PropTypes {
  show: boolean;
  handleClose: any;
  type: string;
  data: any;
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
    // Use the system font instead of the default Roboto font.
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

function AddEditChargerModal(props: PropTypes) {
  const initialValues = {
    cpo: { id: "", name: "" },
    loc_id: "",
    id: "",
    serial: "",
    power: "",
    status: "",
    connectionType: "",
    connector: { id: "", name: "" },
    location: "",
    isEnabled: "",
    disabledReason: "",
    user: "",
    duration: "",
    connected: "",
    energyConsumed: "",
    vendor: { id: "", name: "" },
    chargerId: "",
    chargerSerial: "",
    tariff: "",
    taxRate: "",
    inclusiveTax: "",
    currentType: "",
    locationObject: "",
    isOcpp: "true",
    chargingRate: "",
  };
  const [values, setValues] = useState(initialValues);
  let userDetail: any = localStorage.getItem("user-details");
  useEffect(() => {
    if (!props.show) return;
    setValues(props.data);
  }, [props]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const currentUser: any = Parse.User.current();

  const allConnectorType = useAppSelector(
    (state) => state.connectors.connectors
  );
  const allVendorsType = useAppSelector((state) => state.vendors.vendors);

  const allCpos = useAppSelector((state) => state.cpo.cpo);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const submitAddCharger = () => {
    if (
      values.cpo &&
      values.serial &&
      values.power &&
      values.vendor.name &&
      values.connector.name &&
      values.tariff &&
      values.taxRate &&
      (values.chargerId || values.isOcpp === "false")
    ) {
      setUpdateLoading(true);
      let myNewObject: Parse.Object = new Parse.Object("Chargers");
      myNewObject.set("Location", {
        __type: "Pointer",
        className: "Locations",
        objectId: values.loc_id,
      });
      myNewObject.set("isOCPP", values.isOcpp === "true" ? true : false);
      myNewObject.set("Serial", values.serial);
      myNewObject.set("Power", values.power);
      myNewObject.set("Status", values.status);
      myNewObject.set("Connector", values.connector.name);
      myNewObject.set("Brand", values.vendor.name);
      myNewObject.set(
        "ChargingRate",
        parseFloat(values.power.replace("kW", ""))
      );
      if (currentUser && !JSON.parse(userDetail).isSuperAdmin) {
        myNewObject.set("CPO", {
          __type: "Pointer",
          className: "ChargePointOperators",
          objectId: currentUser.get("CPO").id,
        });
      } else {
        myNewObject.set("CPO", {
          __type: "Pointer",
          className: "ChargePointOperators",
          objectId: values.cpo.id,
        });
      }

      myNewObject.set("ConnectorType", {
        __type: "Pointer",
        className: "ConnectorTypes",
        objectId: values.connector.id,
      });
      myNewObject.set("Vendor", {
        __type: "Pointer",
        className: "CP_Vendor",
        objectId: values.vendor.id,
      });
      myNewObject.set("ChargeId", values.chargerId);
      myNewObject.set("Cost", parseInt(values.tariff));
      myNewObject.set("TaxRate", parseInt(values.taxRate));
      myNewObject.set("isEnabled", values.isEnabled === "true" ? true : false);
      myNewObject.set("DisableReason", values.disabledReason);
      myNewObject.set(
        "inclusiveTax",
        values.inclusiveTax === "true" ? true : false
      );

      myNewObject.save().then(() => {
        alert("Charger Added successfully");

        window.location.reload();
        setUpdateLoading(false);
      });
    } else {
      alert("Please Enter All Mandatory Fields");
      setUpdateLoading(false);
    }
  };

  const submitEditCharger = () => {
    if (
      values.serial &&
      values.power &&
      values.vendor.name &&
      values.connector.name &&
      values.tariff &&
      values.taxRate &&
      (values.chargerId || values.isOcpp === "false")
    ) {
      setUpdateLoading(true);
      let myNewObject: Parse.Object = new Parse.Object("Chargers");
      myNewObject.set("objectId", values.id);
      myNewObject.set("Serial", values.serial);
      myNewObject.set("Power", values.power);
      myNewObject.set("isOCPP", values.isOcpp === "true" ? true : false);
      myNewObject.set("Connector", values.connector.name);
      myNewObject.set(
        "ChargingRate",
        parseFloat(values.power.replace("kW", ""))
      );
      myNewObject.set("Brand", values.vendor.name);
      if (currentUser && !JSON.parse(userDetail).isSuperAdmin) {
        myNewObject.set("CPO", {
          __type: "Pointer",
          className: "ChargePointOperators",
          objectId: currentUser.get("CPO").id,
        });
      } else {
        myNewObject.set("CPO", {
          __type: "Pointer",
          className: "ChargePointOperators",
          objectId: values.cpo.id,
        });
      }
      myNewObject.set("ConnectorType", {
        __type: "Pointer",
        className: "ConnectorTypes",
        objectId: values.connector.id,
      });
      myNewObject.set("Vendor", {
        __type: "Pointer",
        className: "CP_Vendor",
        objectId: values.vendor.id,
      });
      myNewObject.set("ChargeId", values.chargerId);
      myNewObject.set("Cost", parseInt(values.tariff));
      myNewObject.set("TaxRate", parseInt(values.taxRate));
      myNewObject.set("isEnabled", values.isEnabled === "true" ? true : false);
      myNewObject.set("DisableReason", values.disabledReason);
      myNewObject.set(
        "inclusiveTax",
        values.inclusiveTax === "true" ? true : false
      );
      myNewObject.save().then((res) => {
        console.log("rty", res);
        alert("Charger Edited successfully");
        window.location.reload();
        setUpdateLoading(false);
        setValues(initialValues);
      });
    } else {
      alert("Please Enter All Mandatory Fields");
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (!props.show) return;
    else if (props.type !== "add" && props.data) {
      setValues({
        ...props.data,
        currentType: allConnectorType.filter(
          (item: any) => item.name === props.data.connector.name
        )[0]?.type,
      });
    }
  }, [props]);
  const handleSubmitCharger = () => {
    if (props.type === "add") {
      submitAddCharger();
    } else {
      submitEditCharger();
    }
  };
  return (
    <Dialog
      PaperProps={{
        sx: {
          maxWidth: 1500,

          height: 1000,
          zIndex: 10000,
        },
      }}
      maxWidth={"xl"}
      fullScreen={fullScreen}
      open={props.show}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <div className="headItem">
          <span className="head1">
            {" "}
            {props.type == "add" ? "Add Charger" : "Edit Charger"}
          </span>{" "}
          <span className="head2" onClick={props.handleClose}>
            <CloseIcon />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={1}>
          <h4>CPO</h4>
          {!JSON.parse(userDetail).isSuperAdmin ? (
            <FormControl variant="standard">
              <Input
                id="bootstrap-input"
                value={currentUser.get("CPO").get("Name")}
                disabled={!JSON.parse(userDetail).isSuperAdmin}
              />
            </FormControl>
          ) : (
            <FormControl variant="standard">
              <Select
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ width: 380, marginBottom: "20px" }}
                value={values.cpo.id}
              >
                <MenuItem disabled value="">
                  <em>CPO</em>
                </MenuItem>

                {allCpos.map((item: any) => (
                  <MenuItem
                    value={item.id}
                    onClick={() =>
                      setValues({
                        ...values,
                        cpo: { id: item.id, name: item.name },
                      })
                    }
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <h4> Basic Info</h4>
          <FormControl variant="standard">
            <InputLabel shrink htmlFor="bootstrap-input">
              Serial Number <small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.serial}
              onChange={(e) =>
                setValues({
                  ...values,
                  serial: e.target.value,
                })
              }
            />
          </FormControl>
          <Stack direction="row" gap={3}>
            <FormControl variant="standard">
              <InputLabel shrink htmlFor="bootstrap-input">
                Vendor <small>*</small>
              </InputLabel>
              <Select
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ width: 380, marginBottom: "20px" }}
                value={values.vendor.id}
              >
                <MenuItem disabled value="">
                  <em>Vendor</em>
                </MenuItem>

                {allVendorsType.map((item: any) => (
                  <MenuItem
                    value={item.id}
                    onClick={() =>
                      setValues({
                        ...values,
                        vendor: { id: item.id, name: item.name },
                      })
                    }
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="standard">
              <InputLabel shrink htmlFor="bootstrap-input">
                Max Power <small>*</small>
              </InputLabel>
              <Select
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ width: 380, marginBottom: "20px" }}
                value={values.power}
              >
                <MenuItem disabled value="">
                  <em>Max Power</em>
                </MenuItem>

                <MenuItem
                  value="3.3 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "3.3 kW",
                    })
                  }
                >
                  3.3kW
                </MenuItem>
                <MenuItem
                  value="7.2 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "7.2 kW",
                    })
                  }
                >
                  7.2kW
                </MenuItem>
                <MenuItem
                  value="7.4 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "7.4 kW",
                    })
                  }
                >
                  7.4kW
                </MenuItem>
                <MenuItem
                  value="11 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "11 kW",
                    })
                  }
                >
                  11kW
                </MenuItem>
                <MenuItem
                  value="15 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "15 kW",
                    })
                  }
                >
                  15kW
                </MenuItem>
                <MenuItem
                  value="22 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "22 kW",
                    })
                  }
                >
                  22kW
                </MenuItem>
                <MenuItem
                  value="25 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "25 kW",
                    })
                  }
                >
                  25kW
                </MenuItem>
                <MenuItem
                  value="30 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "30 kW",
                    })
                  }
                >
                  30kW
                </MenuItem>
                <MenuItem
                  value="60 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "60 kW",
                    })
                  }
                >
                  60kW
                </MenuItem>
                <MenuItem
                  value="120 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "120 kW",
                    })
                  }
                >
                  120kW
                </MenuItem>
                <MenuItem
                  value="250 kW"
                  onClick={() =>
                    setValues({
                      ...values,
                      power: "250 kW",
                    })
                  }
                >
                  250kW
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" gap={3}>
            <FormControl variant="standard">
              <InputLabel shrink htmlFor="bootstrap-input">
                Connector <small>*</small>
              </InputLabel>
              <Select
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ width: 380 }}
                value={values.connector.id}
              >
                <MenuItem disabled value="">
                  <em>Connector</em>
                </MenuItem>
                {allConnectorType.map(
                  (item: { id: string; name: string; type: string }) => (
                    <MenuItem
                      value={item.id}
                      onClick={() =>
                        setValues({
                          ...values,
                          connector: { id: item.id, name: item.name },
                          currentType: item.type,
                        })
                      }
                    >
                      {item.name}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <FormControl variant="standard">
              <Stack direction="row" spacing={8}>
                {" "}
                <FormControlLabel
                  control={
                    <Checkbox checked={values.currentType === "AC"} disabled />
                  }
                  label="AC"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={values.currentType === "DC"} disabled />
                  }
                  label="DC"
                />
              </Stack>
            </FormControl>
          </Stack>
          <br />
          <h4>Cost</h4>
          <Stack direction="row" gap={3}>
            <FormControl variant="standard" sx={{ width: 380 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Charging Tariff <small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                defaultValue="₹"
                type="number"
                value={values.tariff}
                onChange={(e) =>
                  setValues({
                    ...values,
                    tariff: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl variant="standard" sx={{ width: 380 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Tax Rate <small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                defaultValue="₹"
                type="number"
                value={values.taxRate}
                onChange={(e) =>
                  setValues({
                    ...values,
                    taxRate: e.target.value,
                  })
                }
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
              />
            </FormControl>
            <FormControl variant="standard" sx={{ width: 380 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Charging Rate <small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                defaultValue="₹"
                type="number"
                value={values.chargingRate}
                onChange={(e) =>
                  setValues({
                    ...values,
                    chargingRate: e.target.value,
                  })
                }
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
              />
            </FormControl>
          </Stack>
          <FormControl variant="standard">
            <FormLabel component="legend">Inclusive Tax</FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.inclusiveTax === "true"}
                  onClick={() =>
                    setValues({
                      ...values,
                      inclusiveTax: "true",
                    })
                  }
                />
              }
              label="True"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="False"
              checked={values.inclusiveTax === "false"}
              onClick={() =>
                setValues({
                  ...values,
                  inclusiveTax: "false",
                })
              }
            />
          </FormControl>
          <br />
          <Stack gap={2} direction="column">
            <FormControlLabel
              control={
                <Switch
                  checked={values.isOcpp === "true"}
                  onChange={() =>
                    setValues({
                      ...values,
                      isOcpp: values.isOcpp === "true" ? "false" : "true",
                    })
                  }
                  name="antoine"
                />
              }
              label="is OCPP"
            />
            {values.isOcpp === "true" ? <h4>OCPP Setup</h4> : ""}
          </Stack>
          <br />
          {values.isOcpp === "true" ? (
            <FormControl variant="standard">
              <InputLabel shrink htmlFor="bootstrap-input">
                Connection Type<small>*</small>
              </InputLabel>
              <Select
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ width: 380, marginBottom: "20px" }}
                value={values.connectionType}
              >
                <MenuItem disabled value="">
                  <em>Connection Type</em>
                </MenuItem>

                <MenuItem
                  value="ws://"
                  onClick={() =>
                    setValues({
                      ...values,
                      connectionType: "ws://",
                    })
                  }
                >
                  ws://
                </MenuItem>
                <MenuItem
                  value="wss://"
                  onClick={() =>
                    setValues({
                      ...values,
                      connectionType: "wss://",
                    })
                  }
                >
                  wss://
                </MenuItem>
              </Select>
            </FormControl>
          ) : (
            ""
          )}
          {values.isOcpp === "true" ? (
            <Stack direction="row" gap={3}>
              <FormControl variant="standard" sx={{ width: 380 }}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Charger Id <small>*</small>
                </InputLabel>
                <Input
                  id="bootstrap-input"
                  value={values.chargerId}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      chargerId: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl variant="standard" sx={{ width: 380 }}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Charger Serial (Optional)
                </InputLabel>
                <Input
                  id="bootstrap-input"
                  value={values.chargerSerial}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      chargerSerial: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Stack>
          ) : (
            ""
          )}

          <Stack gap={2} direction="row">
            {" "}
            <FormControlLabel
              control={
                <Switch
                  checked={values.isEnabled === "true"}
                  onChange={() =>
                    setValues({
                      ...values,
                      isEnabled: values.isEnabled === "true" ? "false" : "true",
                    })
                  }
                  name="antoine"
                />
              }
              label="Enable Charger"
            />{" "}
            {values.isEnabled === "false" ? (
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                value={values.disabledReason}
                placeholder="Enter Reason for Disable"
                onChange={(e) =>
                  setValues({
                    ...values,
                    disabledReason: e.target.value,
                  })
                }
                style={{ width: 500 }}
              />
            ) : (
              ""
            )}
          </Stack>

          {values.connectionType && values.chargerId ? (
            <Stack direction="row" gap={1}>
              <Input
                id="bootstrap-input"
                sx={{ width: 380 }}
                value={`${values.connectionType}ocpp.chargecity.co.in/${values.chargerId}/${values.chargerSerial}`}
              />{" "}
              <ContentCopyIcon
                className="copy-icon"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${values.connectionType}ocpp.chargecity.co.in/${values.chargerId}/${values.chargerSerial}`
                  )
                }
              />
            </Stack>
          ) : (
            ""
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          autoFocus
          fullWidth
          disabled={updateLoading}
          onClick={() => {
            handleSubmitCharger();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEditChargerModal;
