import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AddEditChargerModal from "../addEditCharger/AddEditChargerModal";
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
  TextField,
  alpha,
  InputBase,
  styled,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
  FormLabel,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  DialogContentText,
  Autocomplete,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import "./addEdit.scss";
import Select from "@mui/material/Select";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import { current } from "@reduxjs/toolkit";
import { useAppSelector } from "../../../store/store";
interface PropTypes {
  show: boolean;
  handleClose: any;
  type: string;
  data: any;
  refreshLocation: any;
  allChargePointData: any;
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

function AddEditModal(props: PropTypes) {
  const initialValues = {
    id: "",
    stationName: "",
    address: "",
    description: "",
    amenities: [],
    connectorType: [],
    city: "",
    state: "",
    country: "",
    type: "",
    lat: "",
    long: "",
    openingTime: "",
    closingTime: "",
    daysOpen: "",
    chargingTariff: "",
    electricityTariff: "",
    currency: "₹",
    tax: "",
    access: "",
    authType: "",
    paymentReq: "",
    modelType: "",
    isEnabled: "",
    revenueAmount: "",
    revenuePercent: "",
    rentalAmount: "",
  };
  const [addEditChargerData, setAddEditChargerData] = useState({
    loc_id: "",
    id: "",
    serial: "",
    power: "",
    status: "",
    connector: {
      id: "",
      name: "",
    },
    location: "",
    isEnabled: "true",
    disabledReason: "",
    user: "",
    duration: "",
    connected: "",
    energyConsumed: "",
    vendor: {
      id: "",
      name: "",
    },
    chargerId: "",
    tariff: "",
    taxRate: "",
    inclusiveTax: "",
    currentType: "",
    cpo: {
      id: "",
      name: "",
    },
    isOcpp: "true",
    chargingRate: "",
  });
  const [values, setValues] = useState(initialValues);
  useEffect(() => {
    if (!props.show) return;
    setValues(props.data);
  }, [props.show]);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [showAddEditChargerModal, setShowAddEditChargerModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const submitAddLocation = () => {
    if (
      values.stationName &&
      values.address &&
      values.description &&
      values.amenities?.length &&
      values.city &&
      values.state &&
      values.lat &&
      values.long &&
      values.openingTime &&
      values.closingTime &&
      values.electricityTariff
    ) {
      setUpdateLoading(true);
      let myNewObject: Parse.Object = new Parse.Object("Locations");
      myNewObject.set("Name", values.stationName);
      myNewObject.set("Address", values.address);
      myNewObject.set("City", values.city);
      myNewObject.set("State", values.state);
      myNewObject.set("LocationType", values.type);
      myNewObject.set("Description", values.description);
      myNewObject.set("Amenities", values.amenities);
      myNewObject.set(
        "GeoLocation",
        new Parse.GeoPoint({
          latitude: Number(values.lat),
          longitude: Number(values.long),
        })
      );
      myNewObject.set(
        "OpenTime",
        String(moment(values.openingTime).format("hh:mm A"))
      );
      myNewObject.set(
        "CloseTime",
        String(moment(values.closingTime).format("hh:mm A"))
      );
      myNewObject.set("ElectricityTariff", parseInt(values.electricityTariff));
      myNewObject.set("isEnabled", values.isEnabled === "true" ? true : false);
      myNewObject.set("RevenueModel", values.modelType);
      myNewObject.set("RevenueSharingType", values.revenuePercent);
      myNewObject.set("RevenueAmount", Number(values.revenueAmount));
      myNewObject.set("RentalAmount", Number(values.rentalAmount));
      myNewObject.set("Description", values.description);
      myNewObject.set("Amenities", values.amenities);
      myNewObject.set(
        "ConnectorType",
        values.connectorType.length ? values.connectorType : []
      );
      myNewObject.set("CurrentType", []);
      myNewObject.set("Client", "Charge City");
      myNewObject.set("Currency", "INR");
      myNewObject.set(
        "hasRestrictedAccess",
        values.access === "Private" ? true : false
      );
      myNewObject.save().then((res) => {
        setConfirmationDialog(true);
        alert("Location added successfully");
        props.refreshLocation();

        setAddEditChargerData({ ...addEditChargerData, location: res.id });
        setUpdateLoading(false);
      });
    } else {
      window.alert("Please fill all mandatory fileds");
      setUpdateLoading(false);
    }
  };

  const submitEditLocation = () => {
    if (
      values.stationName &&
      values.address &&
      values.description &&
      values.amenities?.length &&
      values.city &&
      values.state &&
      values.lat &&
      values.long &&
      values.openingTime &&
      values.closingTime &&
      values.electricityTariff
    ) {
      setUpdateLoading(true);
      let myNewObject: Parse.Object = new Parse.Object("Locations");
      myNewObject.set("objectId", values.id);
      myNewObject.set("Name", values.stationName);
      myNewObject.set("Address", values.address);
      myNewObject.set("City", values.city);
      myNewObject.set("Description", values.description);
      myNewObject.set("Amenities", values.amenities);
      myNewObject.set("State", values.state);
      myNewObject.set("LocationType", values.type);
      myNewObject.set("ConnectorType", values.connectorType);
      myNewObject.set("OpenTime", moment(values.openingTime).format("hh:mm A"));
      myNewObject.set(
        "CloseTime",
        moment(values.closingTime).format("hh:mm A")
      );
      myNewObject.set("ElectricityTariff", parseInt(values.electricityTariff));
      myNewObject.set("isEnabled", values.isEnabled === "true" ? true : false);
      myNewObject.set("RevenueModel", values.modelType);
      myNewObject.set("RevenueSharingType", values.revenuePercent);
      myNewObject.set("RevenueAmount", Number(values.revenueAmount));
      myNewObject.set("RentalAmount", Number(values.rentalAmount));
      myNewObject.set(
        "GeoLocation",
        new Parse.GeoPoint({
          latitude: Number(values.lat),
          longitude: Number(values.long),
        })
      );

      myNewObject.set(
        "hasRestrictedAccess",
        values.access === "Private" ? true : false
      );
      myNewObject.save().then(() => {
        alert(`${values.stationName} Edited successfully`);
        setUpdateLoading(false);
        window.location.reload();
      });
    } else {
      window.alert("Please fill all mandatory fileds");
      setUpdateLoading(false);
    }
  };

  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [revenueModelType, setRevenueModelType] = useState("%");
  const allIndianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry",
  ];

  const allConnectorType = useAppSelector(
    (state) => state.connectors.connectors
  );
  console.log("no-one", values.connectorType);

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: 1500,
          height: 1000,
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
            {props.type == "add" ? "Add Locaton" : "Edit Location"}
          </span>{" "}
          <span className="head2" onClick={props.handleClose}>
            <CloseIcon />
          </span>
        </div>
      </DialogTitle>

      <DialogContent>
        <Stack direction="column" spacing={1}>
          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Station Name <small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.stationName}
              onChange={(e) =>
                setValues({
                  ...values,
                  stationName: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Address <small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.address}
              onChange={(e) =>
                setValues({
                  ...values,
                  address: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Description <small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.description}
              onChange={(e) =>
                setValues({
                  ...values,
                  description: e.target.value,
                })
              }
            />
          </FormControl>

          <Autocomplete
            multiple
            id="tags-standard"
            sx={{ maxWidth: 800 }}
            options={[
              "Parking",
              "Vallet",
              "Restaurants",
              "Washrooms",
              "Wheelchair Accessible",
            ]}
            value={values.amenities?.length ? values.amenities : []}
            getOptionLabel={(option) => option}
            onChange={(event, newValue: any) => {
              setValues({
                ...values,
                amenities: newValue,
              });
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Amenities" />
            )}
          />
          <Autocomplete
            multiple
            id="tags-standard"
            sx={{ maxWidth: 800 }}
            options={allConnectorType.map((item: any) => item.name)}
            value={values.connectorType?.length ? values.connectorType : []}
            onChange={(event, newValue: any) => {
              setValues({
                ...values,
                connectorType: newValue,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Connector Types"
              />
            )}
          />
        </Stack>
        <br />
        <Stack direction="row" spacing={8}>
          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              City <small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.city}
              onChange={(e) =>
                setValues({
                  ...values,
                  city: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              State <small>*</small>
            </InputLabel>
            <Select
              inputProps={{ "aria-label": "Without label" }}
              value={values.state}
            >
              <MenuItem value="">
                <em>State</em>
              </MenuItem>
              {allIndianStates.map((item, idx) => (
                <MenuItem
                  key={idx}
                  value={item}
                  onClick={() =>
                    setValues({
                      ...values,
                      state: item,
                    })
                  }
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Country
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={"India"}
              onChange={(e) =>
                setValues({
                  ...values,
                  country: e.target.value,
                })
              }
            />
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={8}>
          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Type <small>*</small>
            </InputLabel>
            <Select
              inputProps={{ "aria-label": "Without label" }}
              value={values.type}
            >
              <MenuItem value="">
                <em>Type</em>
              </MenuItem>
              {[
                "Public Parking",
                "Mall",
                "Office Building",
                "Residential",
                "Hotel",
              ].map((item, idx) => (
                <MenuItem
                  key={idx}
                  value={item}
                  onClick={() =>
                    setValues({
                      ...values,
                      type: item,
                    })
                  }
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Latitude <small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              type="number"
              value={values.lat}
              onChange={(e) =>
                setValues({
                  ...values,
                  lat: e.target.value,
                })
              }
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Longitude <small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              type="number"
              value={values.long}
              onChange={(e) =>
                setValues({
                  ...values,
                  long: e.target.value,
                })
              }
            />
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={8}>
          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Electricity Tariff <small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              defaultValue="₹"
              type="number"
              value={values.electricityTariff}
              onChange={(e) =>
                setValues({
                  ...values,
                  electricityTariff: e.target.value,
                })
              }
              endAdornment={
                <InputAdornment position="end">/kWh</InputAdornment>
              }
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Currency
            </InputLabel>
            <Select
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              value={values.currency}
            >
              <MenuItem
                value=""
                onClick={() =>
                  setValues({
                    ...values,
                    currency: "",
                  })
                }
                disabled
              >
                <em>Currency</em>
              </MenuItem>

              <MenuItem
                value={"$"}
                onClick={() =>
                  setValues({
                    ...values,
                    currency: "$",
                  })
                }
              >
                US Dollars($)
              </MenuItem>
              <MenuItem
                value={"₹"}
                onClick={() =>
                  setValues({
                    ...values,
                    currency: "₹",
                  })
                }
              >
                Indian Rupee(₹)
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={8}>
          <FormControl variant="standard" sx={{ width: 400 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                label="Opening Time "
                value={values.openingTime}
                onChange={(e) =>
                  setValues({
                    ...values,
                    openingTime: e ? e : "",
                  })
                }
                renderInput={(params) => <TextField {...params} />}
              />{" "}
            </LocalizationProvider>{" "}
          </FormControl>
          <FormControl variant="standard" sx={{ width: 400 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                label="Closing Time"
                value={values.closingTime}
                onChange={(e) =>
                  setValues({
                    ...values,
                    closingTime: e ? e : "",
                  })
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </Stack>
        <br />
        <Stack direction="row" spacing={8}>
          <FormControl variant="standard">
            <FormLabel component="legend"> Access</FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.access === "Public"}
                  onClick={() =>
                    setValues({
                      ...values,
                      access: "Public",
                    })
                  }
                />
              }
              label="Public"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Restricted"
              checked={values.access === "Restricted"}
              onClick={() =>
                setValues({
                  ...values,
                  access: "Restricted",
                })
              }
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: 300 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Revenue Model
            </InputLabel>
            <Select
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              value={values.modelType}
            >
              <MenuItem
                value=""
                disabled
                onClick={() =>
                  setValues({
                    ...values,
                    modelType: "",
                  })
                }
              >
                <em>Model Type</em>
              </MenuItem>

              <MenuItem
                value={"Shared"}
                onClick={() =>
                  setValues({
                    ...values,
                    modelType: "Shared",
                  })
                }
              >
                Shared
              </MenuItem>
              <MenuItem
                value={"Rental"}
                onClick={() =>
                  setValues({
                    ...values,
                    modelType: "Rental",
                  })
                }
              >
                Rental
              </MenuItem>
            </Select>
          </FormControl>
          {values.modelType === "Shared" ? (
            <Stack direction="row" spacing={0}>
              <Input
                sx={{ height: 30, marginTop: 5 }}
                id="bootstrap-input"
                type="number"
                value={
                  revenueModelType === "%"
                    ? values.revenuePercent
                    : values.revenueAmount
                }
                onChange={(e) => {
                  revenueModelType === "%"
                    ? setValues({
                        ...values,
                        revenuePercent: e.target.value,
                      })
                    : setValues({
                        ...values,
                        revenueAmount: e.target.value,
                      });
                }}
              />

              <Select
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                value={revenueModelType}
                sx={{ height: 40, marginTop: 3 }}
              >
                <MenuItem value="" disabled>
                  <em>Revenue Type</em>
                </MenuItem>

                <MenuItem
                  value={"%"}
                  onClick={() => {
                    setRevenueModelType("%");
                  }}
                >
                  %
                </MenuItem>
                <MenuItem
                  value={"kWh"}
                  onClick={() => {
                    setRevenueModelType("kWh");
                  }}
                >
                  kWh
                </MenuItem>
              </Select>
            </Stack>
          ) : (
            ""
          )}
          {values.modelType === "Rental" ? (
            <Stack direction="row" spacing={0}>
              <Input
                sx={{ height: 30, marginTop: 5 }}
                id="bootstrap-input"
                type="number"
                startAdornment={
                  <InputAdornment position="start">₹</InputAdornment>
                }
                value={values.rentalAmount}
                onChange={(e) => {
                  setValues({
                    ...values,
                    rentalAmount: e.target.value,
                  });
                }}
              />
            </Stack>
          ) : (
            ""
          )}

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
            label="Enable Location"
          />
        </Stack>

        {props.type !== "add" && (
          <Table size="small" aria-label="purchases">
            <TableHead className="innerTableHead">
              <TableRow>
                <TableCell className="innerTable">Serial Number</TableCell>
                <TableCell className="innerTable">Max Power</TableCell>
                <TableCell className="innerTable">Status</TableCell>
                <TableCell className="innerTable">Duration</TableCell>
                <TableCell className="innerTable">Connected</TableCell>
                <TableCell className="innerTable">Energy Consumed</TableCell>
                <TableCell className="innerTable">User</TableCell>

                {/* {actionOpen ? (
                  <TableCell className="innerTable" align="left">
                    Action
                  </TableCell>
                ) : (
                  <TableCell className="innerTable" align="center">
                    Action
                  </TableCell>
                )} */}

                <TableCell className="innerTable" align="center"></TableCell>
              </TableRow>
            </TableHead>

            {props.allChargePointData
              .filter((item: { location: any }) => item.location === values.id)
              .map((item: any) => (
                <TableBody>
                  <TableCell>{item.serial}</TableCell>
                  <TableCell>{item.power}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell>{item.connected}</TableCell>
                  <TableCell>{item.energyConsumed}</TableCell>
                  <TableCell>{item.user}</TableCell>
                  {/* {item.vendor !== "EO" ? (
                    <TableCell align="center">
                      {actionOpen === item.serial ? (
                        <Stack direction="row" spacing={3}>
                          <Button
                            variant="text"
                            onClick={() => setActionOpen(false)}
                          >
                            Close
                          </Button>
                          <Stack spacing={1}>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                            >
                              Stop Charging
                            </Button>
                            <Button variant="contained" size="small">
                              Reboot
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Button
                          variant="text"
                          onClick={() => setActionOpen(item.serial)}
                        >
                          Open
                        </Button>
                      )}
                    </TableCell>
                  ) : (
                    <TableCell align="center">-</TableCell>
                  )} */}

                  {/* <TableCell>
                    <Button
                      variant="contained"
                      sx={{ width: 150 }}
                      onClick={() => {
                        // setEditChargerData(item);
                        // setShowAddEditChargerModal(true);
                      }}
                    >
                      Edit Charger
                    </Button>
                  </TableCell> */}
                </TableBody>
              ))}
          </Table>
        )}
        <br />
        {props.type !== "add" && values.id ? (
          <Button
            variant="contained"
            autoFocus
            onClick={async () => {
              setShowAddEditChargerModal(true);
              await setAddEditChargerData({
                ...addEditChargerData,
                loc_id: values.id,
              });
            }}
          >
            Add Charger
          </Button>
        ) : (
          ""
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          autoFocus
          fullWidth
          onClick={() => {
            props.type === "add" ? submitAddLocation() : submitEditLocation();
          }}
          disabled={updateLoading}
        >
          Submit
        </Button>
      </DialogActions>
      <AddEditChargerModal
        show={showAddEditChargerModal}
        handleClose={() => {
          setShowAddEditChargerModal(false);
          props.handleClose();
          setAddEditChargerData({
            loc_id: "",
            id: "",
            serial: "",
            power: "",
            status: "",
            connector: {
              id: "",
              name: "",
            },
            location: "",
            isEnabled: "true",
            disabledReason: "",
            user: "",
            duration: "",
            connected: "",
            energyConsumed: "",
            vendor: {
              id: "",
              name: "",
            },
            chargerId: "",
            tariff: "",
            taxRate: "",
            inclusiveTax: "",
            currentType: "",
            chargingRate: "",
            cpo: {
              id: "",
              name: "",
            },
            isOcpp: "true",
          });
        }}
        data={addEditChargerData}
        type="add"
      />

      <Dialog
        open={confirmationDialog}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {" "}
          Add Charger for the location? {values.stationName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              props.handleClose();
              setConfirmationDialog(false);
            }}
            autoFocus
            fullWidth
          >
            Close
          </Button>
          <Button
            variant="contained"
            autoFocus
            fullWidth
            onClick={() => {
              setConfirmationDialog(false);
              setShowAddEditChargerModal(true);
            }}
          >
            Add Charger
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

export default AddEditModal;
