import React, { useEffect, useState } from "react";
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
  Stack,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
  ListSubheader,
  MenuItem,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

interface PropTypes {
  show: boolean;
  handleClose: any;
  type: string;
  data: any;
  refresh: any;
  allCpos: [];
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
const allDashboard = [
  "Home",
  "Charge Sessions",
  "Users",
  "Transactions",
  "Reports",
  "Bookings",
  "Station Map",
  "Station List",
  "Vehicles",
  "Manufacturers",
  "Revenue",
  "Energy Consumption",
  "Push Notifications",
  "Promocodes",
  "Assign Roles",
  "Create CPO",
];
function AddEditModal(props: PropTypes) {
  const initialValues = {
    id: "",
    name: "",
    email: "",
    phone: "",
    cpo: "",
    access: [],
    password: "",
  };

  const [values, setValues] = useState<any>(initialValues);
  useEffect(() => {
    if (props.show && props.type == "edit") {
      setValues(props.data);
    }
  }, [props.show]);
  useEffect(() => {
    if (props.show && props.type == "add") {
      setValues(initialValues);
    }
  }, [props.show]);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const submitAddUser = () => {
    if (
      values.name &&
      values.email &&
      values.phone &&
      values.password &&
      values.access.length &&
      !error.phone &&
      !error.email
    ) {
      let myNewObject: Parse.Object = new Parse.Object("_User");
      myNewObject.set("CPO", {
        __type: "Pointer",
        className: "ChargePointOperators",
        objectId: values.cpo,
      });
      myNewObject.set("FullName", values.name);
      myNewObject.set("email", values.email);
      myNewObject.set("password", values.password);
      myNewObject.set("Phone", values.phone);
      myNewObject.set("UserType", "Cloud");
      myNewObject.set("RoleAssigned", values.access);
      myNewObject.set("username", values.email);
      myNewObject.set("allowDashboard", true);

      myNewObject
        .save()
        .then(() => {
          alert("Role Added successfully");
          props.handleClose();
          props.refresh();
        })
        .catch((error) => alert(error));
    } else {
      alert("Please Enter All Mandatory Fields");
    }
  };

  const submitEditUser = () => {
    try {
      const params = {
        userId: values.id,
        roles: values.access,
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      Parse.Cloud.run("updateUserRole", params).then(
        (status) => {
          alert("User Updated");
          props.handleClose();
          props.refresh();
        },
        (error: any) => {
          alert("Failed to add the user: " + error.message);
          props.handleClose();
          props.refresh();
        }
      );
    } catch (error: any) {
      alert("Failed to add the user " + error.message);
    }
  };

  const [error, setError] = useState({ phone: false, email: false });

  function isEmail(emailAdress: any) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (emailAdress.match(regex)) {
      setError({ ...error, email: false });
    } else {
      setError({ ...error, email: true });
    }
  }

  useEffect(() => {
    if (values.email) isEmail(values.email);
  }, [values.email]);

  function phonenumber(inputtxt: any) {
    var phoneno = /^\d{10}$/;
    if (inputtxt.match(phoneno)) {
      setError({ ...error, phone: false });
    } else {
      setError({ ...error, phone: true });
    }
  }
  useEffect(() => {
    if (values.phone) phonenumber(values.phone);
  }, [values.phone]);

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: 900,
          height: 700,
        },
      }}
      maxWidth={"lg"}
      fullScreen={fullScreen}
      open={props.show}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <div className="headItem">
          <span className="head1">
            {" "}
            {props.type == "add" ? "Add New Role" : "Edit Role"}
          </span>{" "}
          <span className="head2" onClick={props.handleClose}>
            <CloseIcon />
          </span>
        </div>
      </DialogTitle>

      <DialogContent>
        <Stack direction="column" spacing={1}>
          <FormControl variant="standard">
            <InputLabel shrink htmlFor="bootstrap-input">
              Name<small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.name}
              onChange={(e) =>
                setValues({
                  ...values,
                  name: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl variant="standard" sx={{ width: 400 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              CPO <small>*</small>
            </InputLabel>
            <Select
              inputProps={{ "aria-label": "Without label" }}
              value={values.cpo}
            >
              {props.allCpos.map((item: any, idx) => (
                <MenuItem
                  key={idx}
                  value={item.id}
                  onClick={() =>
                    item.isWhiteLabel
                      ? setValues({
                          ...values,
                          access: [
                            "Home",
                            "Charge Sessions",
                            "Users",
                            "Transactions",
                            "Reports",
                            "Bookings",
                            "Station List",
                            "Revenue",
                            "Energy Consumption",
                            "Push Notifications",
                            "Promocodes",
                            "Assign Roles",
                          ],
                          cpo: item.id,
                        })
                      : setValues({
                          ...values,
                          access: [
                            "Home",
                            "Charge Sessions",
                            "Reports",
                            "Bookings",
                            "Station List",
                            "Revenue",
                            "Energy Consumption",
                            "Assign Roles",
                          ],
                          cpo: item.id,
                        })
                  }
                >
                  {item.companyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          {props.type == "add" ? (
            <FormControl variant="standard">
              <InputLabel shrink htmlFor="bootstrap-input">
                Password<small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={values.password}
                type="password"
                onChange={(e) =>
                  setValues({
                    ...values,
                    password: e.target.value,
                  })
                }
              />
            </FormControl>
          ) : (
            ""
          )}

          <Stack direction="row" gap={2} justifyContent="space-between">
            <FormControl variant="standard" sx={{ width: 380 }}>
              <TextField
                id="outlined-error"
                label="Email"
                value={values.email}
                onChange={(e) =>
                  setValues({
                    ...values,
                    email: e.target.value,
                  })
                }
                error={error.email}
              />
            </FormControl>
            <FormControl variant="standard" sx={{ width: 380 }}>
              <TextField
                id="outlined-error"
                label="Phone"
                value={values.phone}
                onChange={(e) =>
                  setValues({
                    ...values,
                    phone: e.target.value,
                  })
                }
                error={error.phone}
              />
            </FormControl>
            {/* <small> {error.phone ? error.phone : ""}</small> */}
          </Stack>
          <br />
          <FormControl sx={{ m: 1, width: 840 }}>
            <InputLabel id="demo-multiple-checkbox-label">Access</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              variant="outlined"
              value={values.access}
              onChange={(event: any) => {
                const {
                  target: { value },
                } = event;
                setValues({
                  ...values,
                  access: typeof value === "string" ? value.split(",") : value,
                });
              }}
              input={<OutlinedInput label="Access" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={{
                PaperProps: { sx: { maxHeight: 400, maxWidth: 300 } },
              }}
            >
              <ListSubheader>Dashboard</ListSubheader>
              <MenuItem key={1} value={"Home"}>
                <Checkbox checked={values.access.indexOf("Home") > -1} />
                <ListItemText primary={"Home"} />
              </MenuItem>
              <MenuItem key={2} value={"Charge Sessions"}>
                <Checkbox
                  checked={values.access.indexOf("Charge Sessions") > -1}
                />
                <ListItemText primary={"Charge Sessions"} />
              </MenuItem>
              <ListSubheader>Quick Menu</ListSubheader>
              <MenuItem key={3} value={"Users"}>
                <Checkbox checked={values.access.indexOf("Users") > -1} />
                <ListItemText primary={"Users"} />
              </MenuItem>
              <MenuItem key={4} value={"Transactions"}>
                <Checkbox
                  checked={values.access.indexOf("Transactions") > -1}
                />
                <ListItemText primary={"Transactions"} />
              </MenuItem>
              <MenuItem key={5} value={"Reports"}>
                <Checkbox checked={values.access.indexOf("Reports") > -1} />
                <ListItemText primary={"Reports"} />
              </MenuItem>
              <MenuItem key={5} value={"Invoices"}>
                <Checkbox checked={values.access.indexOf("Invoices") > -1} />
                <ListItemText primary={"Invoices"} />
              </MenuItem>
              <MenuItem key={6} value={"Bookings"}>
                <Checkbox checked={values.access.indexOf("Bookings") > -1} />
                <ListItemText primary={"Bookings"} />
              </MenuItem>
              <ListSubheader>Stations</ListSubheader>
              <MenuItem key={7} value={"Station Map"}>
                <Checkbox checked={values.access.indexOf("Station Map") > -1} />
                <ListItemText primary={"Station Map"} />
              </MenuItem>
              <MenuItem key={8} value={"Station List"}>
                <Checkbox
                  checked={values.access.indexOf("Station List") > -1}
                />
                <ListItemText primary={"Station List"} />
              </MenuItem>
              <ListSubheader>Electric Vehicles</ListSubheader>
              <MenuItem key={8} value={"Vehicles"}>
                <Checkbox checked={values.access.indexOf("Vehicles") > -1} />
                <ListItemText primary={"Vehicles"} />
              </MenuItem>
              <MenuItem key={8} value={"Manufacturers"}>
                <Checkbox
                  checked={values.access.indexOf("Manufacturers") > -1}
                />
                <ListItemText primary={"Manufacturers"} />
              </MenuItem>
              <ListSubheader>Analytics</ListSubheader>
              <MenuItem key={8} value={"Revenue"}>
                <Checkbox checked={values.access.indexOf("Revenue") > -1} />
                <ListItemText primary={"Revenue"} />
              </MenuItem>
              <MenuItem key={8} value={"Energy Consumption"}>
                <Checkbox
                  checked={values.access.indexOf("Energy Consumption") > -1}
                />
                <ListItemText primary={"Energy Consumption"} />
              </MenuItem>
              <ListSubheader>CRM Tools</ListSubheader>
              <MenuItem key={8} value={"Push Notifications"}>
                <Checkbox
                  checked={values.access.indexOf("Push Notifications") > -1}
                />
                <ListItemText primary={"Push Notifications"} />
              </MenuItem>
              <MenuItem key={8} value={"Promocodes"}>
                <Checkbox checked={values.access.indexOf("Promocodes") > -1} />
                <ListItemText primary={"Promocodes"} />
              </MenuItem>
              <ListSubheader>Admin Tools</ListSubheader>
              <MenuItem key={8} value={"Assign Roles"}>
                <Checkbox
                  checked={values.access.indexOf("Assign Roles") > -1}
                />
                <ListItemText primary={"Assign Roles"} />
              </MenuItem>
              <MenuItem key={8} value={"Create CPO"}>
                <Checkbox checked={values.access.indexOf("Create CPO") > -1} />
                <ListItemText primary={"Create CPO"} />
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          autoFocus
          fullWidth
          onClick={() => {
            props.type === "add" ? submitAddUser() : submitEditUser();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEditModal;
