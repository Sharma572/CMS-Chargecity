import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "@mui/material/Select";
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
  Switch,
  MenuItem,
  FormControlLabel,
  FormLabel,
  TextField,
} from "@mui/material";

import "./addEdit.scss";
import CloseIcon from "@mui/icons-material/Close";
import { WidthFull } from "@mui/icons-material";

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
    companyName: "",
    tradeName: "",
    companyAddress: "",
    contactName: "",
    contactNumber: "",
    contactEmail: "",
    companyDescription: "",
    isWhiteLabel: "",
    upiCode: "",
    accountName: "",
    accountNumber: "",
    bankName: "",
    ifsc: "",
    upi: "",
  };

  const [values, setValues] = useState(initialValues);
  useEffect(() => {
    if (!props.show) return;
    setValues(props.data);
  }, [props.show]);

  const theme = useTheme();

  const upiArray = [
    "@rbl",
    "@idbi",
    "@upi",
    "@aubank",
    "@axisbank",
    "@bandhan",
    "@dlb",
    "@indus",
    "@kbl",
    "@federal",
    "@sbi",
    "@uco",
    "@yesbank",
    "@citi",
    "@dlb",
    "@dbs",
    "@okicici",
    "@okhdfcbank ",
    "@hsbc",
    "@idbi",
    "@allbank",
    "@indianbank",
    "@kotak",
  ];

  const allBankArray = [
    " State Bank of India",
    "Axis Bank",
    " HDFC Bank",
    "ICICI Bank",
    "Bank of Baroda",
    "Bank of Maharashtra",
    "Bandhan Bank",
    "Canara Bank",
    "Central Bank of India",
    " Citi Bank",
    "City Union Bank",
    "Cosmos Co-op Bank",
    "Dhanalaxmi Bank",
    " DBS Bank India Ltd",
    "Deutsche Bank AG",
    " Equitas Small Finance Bank",
    "Federal Bank",
    "Hongkong and Shanghai Banking Corporation (HSBC)",
    " IDBI Bank",
    "IDFC First Bank",
    "Indian Bank",
    "Indusind Bank",
    "Jana Small Finance Bank",
    " Jio Payments Bank",
    "Karnataka Bank Ltd",
    "Karur Vysya Bank",
    " Kotak Mahindra Bank",
    " Oriental Bank of Commerce",
    " Paytm Payments Bank",
    "Punjab National Bank",
    " RBL Bank",
    "Standard Charted Bank",
    "South Indian Bank",
    "Syndicate Bank",
    "Tamilnadu Mercantile Bank",
    "Ujjivan Small Finance Bank",
    " Union Bank of India",
    "Yes Bank",
    "Karnataka Vikas Grameena Bank",
    "DCB Bank Ltd",
    " Andhra Pragathi Grameena Bank",
    "The Varachha Co-op Bank Ltd",
    "  AU Small Finance Bank",
    " The Catholic Syrian Bank",
    " Ujjivan Small Finance Bank Ltd",
    "Airtel Payments Bank Ltd",
    " ESAF Small Finance Bank Ltd",
    " NSDL Payments Bank",
    " Suryoday Small Finance Bank Ltd",
    "Punjab & Sind Bank",
  ];

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  function isValid_UPI_ID(upi_Id: any) {
    // Regex to check valid
    // upi_Id
    let regex = new RegExp(/^[a-zA-Z0-9.-]{2, 256}@[a-zA-Z][a-zA-Z]{2, 64}$/);

    // upi_Id
    // is empty return false
    if (upi_Id == null) {
      return "false";
    }

    // Return true if the upi_Id
    // matched the ReGex
    if (regex.test(upi_Id) == true) {
      return "true";
    } else {
      alert("Enter Valid UPI");
      return "false";
    }
  }
  function isValid_Bank_Acc_Number(bank_account_number: any) {
    // Regex to check valid
    // BANK ACCOUNT NUMBER CODE
    let regex = new RegExp(/^[0-9]{9,18}$/);

    // bank_account_number CODE
    // is empty return false
    if (bank_account_number == null) {
      return "false";
    }

    // Return true if the bank_account_number
    // matched the ReGex
    if (regex.test(bank_account_number) == true) {
      return "true";
    } else {
      alert("Enter Valid Acc Number");
      return "false";
    }
  }
  function isValid_IFSC_Code(ifsc_Code: any) {
    // Regex to check valid
    // ifsc_Code
    let regex = new RegExp(/^[A-Z]{4}0[A-Z0-9]{6}$/);

    // if ifsc_Code
    // is empty return false
    if (ifsc_Code == null) {
      return "false";
    }

    // Return true if the ifsc_Code
    // matched the ReGex
    if (regex.test(ifsc_Code) == true) {
      return "true";
    } else {
      alert("Please Enter Valid IFSC Code");
      return "false";
    }
  }
  const submitAddCPO = () => {
    if (
      values.companyName &&
      values.companyAddress &&
      values.contactName &&
      values.contactNumber &&
      values.contactEmail &&
      (values.ifsc === "" || isValid_IFSC_Code(values.ifsc) === "true") &&
      (values.accountNumber === "" ||
        isValid_Bank_Acc_Number(values.accountNumber) === "true")
    ) {
      let myNewObject: Parse.Object = new Parse.Object("ChargePointOperators");

      myNewObject.set("CompanyName", values.companyName);
      myNewObject.set("Name", values.tradeName);
      myNewObject.set("Address", values.companyAddress);
      myNewObject.set("ContactName", values.contactName);
      myNewObject.set("Phone", values.contactNumber);
      myNewObject.set("Email", values.contactEmail);
      myNewObject.set("Description", values.companyDescription);
      myNewObject.set("AccountNumber", parseFloat(values.accountNumber));
      myNewObject.set("IFSC", values.ifsc);
      myNewObject.set("BankName", values.bankName);
      myNewObject.set("UPI", values.upi);
      myNewObject.set("UPICode", values.upiCode);
      myNewObject.set(
        "isWhiteLabel",
        values.isWhiteLabel === "true" ? true : false
      );
      myNewObject.save().then((res) => {
        alert("CPO added successfully");
        props.refresh();
        props.handleClose();
      });
    } else {
      alert("Please Enter All Mandatory Details");
    }
  };

  const [showBilingInfo, setShowBilingInfo] = useState(false);

  console.log("hey ", values);

  const submitEditCPO = () => {
    if (
      values.companyName &&
      values.companyAddress &&
      values.contactName &&
      values.contactNumber &&
      values.contactEmail &&
      (values.ifsc === "" || isValid_IFSC_Code(values.ifsc) === "true") &&
      (values.accountNumber === "" ||
        isValid_Bank_Acc_Number(values.accountNumber) === "true")
    ) {
      let myNewObject: Parse.Object = new Parse.Object("ChargePointOperators");
      myNewObject.set("objectId", values.id);
      myNewObject.set("CompanyName", values.companyName);
      myNewObject.set("Name", values.tradeName);
      myNewObject.set("Address", values.companyAddress);
      myNewObject.set("ContactName", values.contactName);
      myNewObject.set("Phone", values.contactNumber);
      myNewObject.set("Email", values.contactEmail);
      myNewObject.set("Description", values.companyDescription);
      myNewObject.set("AccountNumber", parseFloat(values.accountNumber));
      myNewObject.set("IFSC", values.ifsc);
      myNewObject.set("BankName", values.bankName);
      myNewObject.set("UPI", values.upi);
      myNewObject.set("UPICode", values.upiCode);
      myNewObject.set(
        "isWhiteLabel",
        values.isWhiteLabel === "true" ? true : false
      );
      myNewObject.save().then((res) => {
        alert("CPO Edited successfully");
        props.refresh();
        props.handleClose();
      });
    } else {
      alert("Please Enter All Mandatory Details");
    }
  };

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
            {props.type == "add"
              ? "Add Charge Point Operator"
              : "Edit Charge Point Operator"}
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
                Company Name<small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={values.companyName}
                onChange={(e) =>
                  setValues({
                    ...values,
                    companyName: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl variant="standard" sx={{ width: 500 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Trade Name
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={values.tradeName}
                onChange={(e) =>
                  setValues({
                    ...values,
                    tradeName: e.target.value,
                  })
                }
              />
            </FormControl>
          </Stack>
          <FormControl variant="standard" sx={{ maxWidth: 800 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Company Address <small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.companyAddress}
              onChange={(e) =>
                setValues({
                  ...values,
                  companyAddress: e.target.value,
                })
              }
            />
          </FormControl>{" "}
          <Stack direction="row" spacing={2}>
            <FormControl variant="standard" sx={{ width: 500 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Contact Name<small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={values.contactName}
                onChange={(e) =>
                  setValues({
                    ...values,
                    contactName: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl variant="standard" sx={{ width: 500 }}>
              <InputLabel shrink htmlFor="bootstrap-input">
                Contact Number <small>*</small>
              </InputLabel>
              <Input
                id="bootstrap-input"
                value={values.contactNumber}
                onChange={(e) =>
                  setValues({
                    ...values,
                    contactNumber: e.target.value,
                  })
                }
              />
            </FormControl>
          </Stack>
          <FormControl variant="standard" sx={{ width: 500 }}>
            <InputLabel shrink htmlFor="bootstrap-input">
              Email <small>*</small>
            </InputLabel>
            <Input
              id="bootstrap-input"
              value={values.contactEmail}
              onChange={(e) =>
                setValues({
                  ...values,
                  contactEmail: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Company Description
            </FormLabel>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              value={values.companyDescription}
              onChange={(e) =>
                setValues({
                  ...values,
                  companyDescription: e.target.value,
                })
              }
              minRows={5}
              size="small"
            />
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={values.isWhiteLabel === "true"}
                onChange={() =>
                  setValues({
                    ...values,
                    isWhiteLabel:
                      values.isWhiteLabel === "true" ? "false" : "true",
                  })
                }
                name="antoine"
              />
            }
            label="White Labled"
          />
          <br />
          <hr />
          <h4
            style={{ cursor: "pointer" }}
            onClick={() => setShowBilingInfo(!showBilingInfo)}
          >
            + Add Biling info for Payouts
          </h4>
          {showBilingInfo ? (
            <>
              <Stack direction="row" spacing={0}>
                <Stack direction="column" spacing={0}>
                  <InputLabel shrink htmlFor="bootstrap-input">
                    Upi
                  </InputLabel>
                  <Input
                    sx={{ height: 30, marginTop: 5 }}
                    id="bootstrap-input"
                    value={values.upi}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        upi: e.target.value,
                      })
                    }
                  />
                </Stack>

                <Select
                  sx={{ height: 30, marginTop: 5, width: 180 }}
                  inputProps={{ "aria-label": "Without label" }}
                  value={values.upiCode}
                >
                  <MenuItem value="">
                    <em>UPI</em>
                  </MenuItem>
                  {upiArray.map((item, idx) => (
                    <MenuItem
                      key={idx}
                      value={item}
                      onClick={() =>
                        setValues({
                          ...values,
                          upiCode: item,
                        })
                      }
                    >
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              <FormControl variant="standard" sx={{ width: 500 }}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Account Number
                </InputLabel>
                <Input
                  id="bootstrap-input"
                  type="number"
                  value={values.accountNumber}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      accountNumber: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl variant="standard" sx={{ width: 400 }}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  Bank Name
                </InputLabel>
                <Select
                  inputProps={{ "aria-label": "Without label" }}
                  value={values.bankName}
                >
                  <MenuItem value="">
                    <em>State</em>
                  </MenuItem>
                  {allBankArray.map((item, idx) => (
                    <MenuItem
                      key={idx}
                      value={item}
                      onClick={() =>
                        setValues({
                          ...values,
                          bankName: item,
                        })
                      }
                    >
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <FormControl variant="standard" sx={{ width: 500 }}>
                <InputLabel shrink htmlFor="bootstrap-input">
                  IFSC
                </InputLabel>
                <Input
                  id="bootstrap-input"
                  value={values.ifsc}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      ifsc: e.target.value,
                    })
                  }
                />
              </FormControl>
            </>
          ) : (
            <></>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          autoFocus
          fullWidth
          onClick={() => {
            props.type === "add" ? submitAddCPO() : submitEditCPO();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEditModal;
