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
  Slide,
  ToggleButton,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Select from "@mui/material/Select";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
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
    name: "",
    manufacturer: { id: "", name: "" },
    chargeRate: "",
    range: "",
  };

  const [values, setValues] = useState(initialValues);
  useEffect(() => {
    if (!props.show) return;
    setValues(props.data);
  }, [props.show]);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const submitAddManufaturer = () => {
    let myNewObject: Parse.Object = new Parse.Object("Cars");

    myNewObject.set("Name", values.name);
    myNewObject.set("Manufacturer", values.manufacturer.name);
    myNewObject.set("ChargingRate", parseFloat(values.chargeRate));
    myNewObject.set("RangePerKW", parseFloat(values.range));
    myNewObject.set("Brand", {
      __type: "Pointer",
      className: "EV_Manufacturer",
      objectId: values.manufacturer.id,
    });

    myNewObject.save().then((res) => {
      alert("Car added successfully");
      props.refresh();
      props.handleClose();
    });
  };

  const submitEditManufaturer = () => {
    let myNewObject: Parse.Object = new Parse.Object("Cars");
    myNewObject.set("objectId", values.id);
    myNewObject.set("Name", values.name);
    myNewObject.set("Manufacturer", values.manufacturer.name);
    myNewObject.set("Brand", {
      __type: "Pointer",
      className: "EV_Manufacturer",
      objectId: values.manufacturer.id,
    });
    myNewObject.set("ChargingRate", parseFloat(values.chargeRate));
    myNewObject.set("RangePerKW", parseFloat(values.range));
    myNewObject.save().then((res) => {
      alert("Car Edited successfully");
      props.refresh();
      props.handleClose();
    });
  };

  const [allManufacturer, setAllManufaturer] = useState<any>([]);
  const getAllVehiclesData = () => {
    const parseQuery = new Parse.Query("EV_Manufacturer");

    parseQuery.limit(100);
    parseQuery.find().then((result: any[]) => {
      let newRow: {
        id: number;
        name: string;
      }[] = [];

      result.forEach((item, index) => {
        let url = "/images/placeholder.png";
        let file = item.get("Logo");
        if (file != null) {
          url = file.url();
        }
        let logoUrl = "/images/placeholder.png";
        let logoFile = item.get("ManufacturerLogo");
        if (logoFile != null) {
          logoUrl = logoFile.url();
        }

        newRow.push({
          id: item.id,
          name: item.get("Name"),
        });
      });
      setAllManufaturer(newRow);
    });
  };
  useEffect(() => {
    getAllVehiclesData();
  }, []);
  return (
    <Dialog
      PaperProps={{
        sx: {
          width: 700,
          height: 500,
        },
      }}
      maxWidth={"md"}
      fullScreen={fullScreen}
      open={props.show}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <div className="headItem">
          <span className="head1">
            {" "}
            {props.type == "add" ? "Add Car" : "Edit Car"}
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
              Name
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
          <FormControl variant="standard">
            <InputLabel shrink htmlFor="bootstrap-input">
              Manufacturer
            </InputLabel>
            <Select
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ width: 650 }}
              value={values.manufacturer.id}
            >
              <MenuItem disabled value="">
                <em> Manufacturer</em>
              </MenuItem>
              {allManufacturer.map((item: any) => (
                <MenuItem
                  value={item.id}
                  onClick={() =>
                    setValues({
                      ...values,
                      manufacturer: item,
                    })
                  }
                >
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <Stack direction="row" spacing={1}>
            <FormControl variant="standard" sx={{ width: 400 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Charging Rate
              </InputLabel>
              <Input
                id="bootstrap-input"
                type="number"
                value={values.chargeRate}
                onChange={(e) =>
                  setValues({
                    ...values,
                    chargeRate: e.target.value,
                  })
                }
                endAdornment={
                  <InputAdornment position="end">/kWh</InputAdornment>
                }
              />
            </FormControl>
            <FormControl variant="standard" sx={{ width: 400 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Range
              </InputLabel>
              <Input
                id="bootstrap-input"
                type="number"
                value={values.range}
                onChange={(e) =>
                  setValues({
                    ...values,
                    range: e.target.value,
                  })
                }
                endAdornment={
                  <InputAdornment position="end">km</InputAdornment>
                }
              />
            </FormControl>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          autoFocus
          fullWidth
          onClick={() => {
            props.type === "add"
              ? submitAddManufaturer()
              : submitEditManufaturer();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEditModal;
