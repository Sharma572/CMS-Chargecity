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
import "./addEdit.scss";
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
    image: "",
    enabled: "",
  };

  const [values, setValues] = useState(initialValues);
  useEffect(() => {
    if (!props.show) return;
    setValues(props.data);
  }, [props.show]);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const submitAddManufaturer = () => {
    let myNewObject: Parse.Object = new Parse.Object("EV_Manufacturer");

    myNewObject.set("Name", values.name);

    myNewObject.set("isEnabled", values.enabled === "true" ? true : false);

    myNewObject.save().then((res) => {
      alert("Manufaturer added successfully");
      props.refresh();
      props.handleClose();
    });
  };

  const submitEditManufaturer = () => {
    let myNewObject: Parse.Object = new Parse.Object("EV_Manufacturer");
    myNewObject.set("objectId", values.id);
    myNewObject.set("Name", values.name);

    myNewObject.set("isEnabled", values.enabled === "true" ? true : false);
    myNewObject.save().then((res) => {
      alert("Manufaturer Edited successfully");
      props.refresh();
      props.handleClose();
    });
  };

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
            {props.type == "add" ? "Add Manufacturer" : "Edit Manufacturer"}
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

          <FormControlLabel
            control={
              <Switch
                checked={values.enabled === "true"}
                onChange={() =>
                  setValues({
                    ...values,
                    enabled: values.enabled === "true" ? "false" : "true",
                  })
                }
                name="antoine"
              />
            }
            label="Enable "
          />
          <br />
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
