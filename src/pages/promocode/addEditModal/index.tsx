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
  MenuItem,
  Stack,
  Switch,
  FormControlLabel,
  FormLabel,
  TextField,
} from "@mui/material";

import Select from "@mui/material/Select";

import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
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
    code: "",
    value: "",
    title: "",
    status: "",
  };

  const [values, setValues] = useState(initialValues);
  useEffect(() => {
    if (!props.show) return;
    setValues(props.data);
  }, [props.show]);

  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const submitAddManufaturer = () => {
    if (values.code && values.value) {
      let myNewObject: Parse.Object = new Parse.Object("PromoCodes");
      myNewObject.set("Code", values.code);
      myNewObject.set("Value", Number(values.value));
      myNewObject.set("isValid", values.status === "true" ? true : false);

      myNewObject.save().then((res) => {
        alert("Promocode added successfully");
        props.refresh();
        props.handleClose();
      });
    } else {
      alert("Please Enter All Mandatory Details");
    }
  };

  const submitEditManufaturer = () => {
    if (values.code && values.value) {
      let myNewObject: Parse.Object = new Parse.Object("PromoCodes");
      myNewObject.set("objectId", values.id);
      myNewObject.set("Code", values.code);
      myNewObject.set("Value", Number(values.value));
      myNewObject.set("isValid", values.status === "true" ? true : false);
      myNewObject.save().then((res) => {
        alert("Promocode Edited successfully");
        props.refresh();
        props.handleClose();
      });
    } else {
      alert("Please Enter All Mandatory Details");
    }
  };

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
            {props.type == "add" ? "Add Promocode" : "Edit Promocode"}
          </span>{" "}
          <span className="head2" onClick={props.handleClose}>
            <CloseIcon />
          </span>
        </div>
      </DialogTitle>

      <DialogContent>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={2}>
            <FormControl variant="standard" sx={{ width: 500 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Title <small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={values.title}
                onChange={(e) =>
                  setValues({
                    ...values,
                    title: e.target.value.toLowerCase(),
                  })
                }
              />
            </FormControl>
            <FormControl variant="standard" sx={{ width: 500 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Promo Code <small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={values.code}
                onChange={(e) =>
                  setValues({
                    ...values,
                    code: e.target.value.toLowerCase(),
                  })
                }
              />
            </FormControl>
          </Stack>
          <Stack direction="row">
            <FormControl variant="standard" sx={{ maxWidth: 800 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Discount Value <small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                type="number"
                value={values.value}
                onChange={(e) =>
                  setValues({
                    ...values,
                    value: e.target.value,
                  })
                }
              />
            </FormControl>{" "}
            <Select
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              // value={revenueModelType}
              sx={{ height: 40, marginTop: 3 }}
            >
              <MenuItem value="" disabled>
                <em>Revenue Type</em>
              </MenuItem>

              <MenuItem
              // value={"%"}
              // onClick={() => {
              //   setRevenueModelType("%");
              // }}
              >
                %
              </MenuItem>
              <MenuItem
              // value={"kWh"}
              // onClick={() => {
              //   setRevenueModelType("kWh");
              // }}
              >
                ₹
              </MenuItem>
            </Select>
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl variant="standard" sx={{ width: 500 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Start Date"
                  // value={moment(startDateFilter).format("DD MMM YYYY")}
                  // onChange={(item) => setStartDateFilter(item || "")}
                  renderInput={(params) => (
                    <TextField {...params} error={false} />
                  )}
                  inputFormat="DD-MM-YYYY"
                  onChange={function (
                    value: unknown,
                    keyboardInputValue?: string | undefined
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  value={undefined}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl variant="standard" sx={{ width: 500 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="End Date"
                  // value={moment(startDateFilter).format("DD MMM YYYY")}
                  // onChange={(item) => setStartDateFilter(item || "")}
                  renderInput={(params) => (
                    <TextField {...params} error={false} />
                  )}
                  inputFormat="DD-MM-YYYY"
                  onChange={function (
                    value: unknown,
                    keyboardInputValue?: string | undefined
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  value={undefined}
                />
              </LocalizationProvider>
            </FormControl>
          </Stack>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Detail
            </FormLabel>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              // value={message}
              // onChange={(e) => setMessage(e.target.value)}
              minRows={5}
              size="small"
            />
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={values.status === "true"}
                onChange={() =>
                  setValues({
                    ...values,
                    status: values.status === "true" ? "false" : "true",
                  })
                }
                name="antoine"
              />
            }
            label="Enable Promocode"
          />
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
