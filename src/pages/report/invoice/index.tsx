import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./invoice.scss";
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
  InputAdornment,
  Switch,
  FormControlLabel,
  FormLabel,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import Select from "@mui/material/Select";

import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { userRows, userColumns } from "../../../icons/datatablesource";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import myImg from "../../../icons/main.png";
import { Height } from "@mui/icons-material";
import { table } from "console";
interface PropTypes {
  show: boolean;
  handleClose: any;
  tableData: any;
  data: any;
  location: any;
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
const ab: any = html2canvas;
function GenerateInvoice() {
  ab(document.querySelector("#invoiceCapture"), { scale: 4 }).then(
    (canvas: any) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [612, 792],
      });
      pdf.internal.scaleFactor = 1;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice-001.pdf");
    }
  );
}

function InvoiceModal(props: PropTypes) {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [dataRow, setDataRow] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [filteredRow, setFilteredRow] = useState([]);
  useEffect(() => {
    const parseQuery = new Parse.Query("_User");
    parseQuery.descending("createdAt");
    parseQuery.include("EV");
    parseQuery.limit(5000);
    parseQuery.notEqualTo("UserType", "Cloud");
    parseQuery.find().then((result) => {
      setLoading(false);
      let newRow: any = [];

      result.forEach((user, index) => {
        newRow.push({
          id: index + 1,
          objectId: `${user.id}`,
          name: `${user.get("FullName")}`,
          phone: `${user.get("Phone")}`,
          email: `${user.get("email")}`,
          credit: `${user.get("Credit")}`,
          garage: `${
            user.get("EV")?.length
              ? user
                  .get("EV")
                  .map((item: any) => item.get("Name"))
                  .join(", ")
              : "-"
          }`,

          date:
            `${user
              .get("createdAt")
              .toLocaleDateString("en-US", { day: "numeric" })}` +
            " - " +
            `${user
              .get("createdAt")
              .toLocaleDateString("en-US", { month: "short" })}` +
            " - " +
            `${user
              .get("createdAt")
              .toLocaleDateString("en-US", { year: "numeric" })}`,
          obj: user,
        });
      });
      setDataRow(newRow);
      setFilteredRow(newRow);
    });
  }, []);

  const userColumns = [
    {
      field: "id",
      headerName: "S.No.",
      width: 50,
    },
    {
      field: "qty",
      headerName: "Quantity",
      width: 150,
    },
    {
      field: "rate",
      headerName: "Rate",
      width: 200,
    },
    {
      field: "amt",
      headerName: "Amount",
      width: 150,
    },
  ];

  const userRows = filteredRow;
  const newRow = [
    {
      id: 1,
      qty: 12,
      rate: 12,
      amt: 15,
    },
  ];
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
          <span className="head1">Generate Invoice</span>{" "}
          <span className="head2" onClick={props.handleClose}>
            <CloseIcon />
          </span>
        </div>
      </DialogTitle>

      <DialogContent>
        <div id="invoiceCapture">
          <div className="invoice-box">
            <div className="top-row">
              <div className="icon-bar">
                <img src={myImg} className="logo" />
                <p className="address">
                  <small className="head">Coulomb EV Solutions Pvt Ltd</small>{" "}
                  <small>Regus, Assotech Business Crestera, Sec-135</small>
                  <small>Noida-U.P-201304</small>
                  <small>GSTIN: 09AAICC3145K1ZH</small>
                  <small>1800-843-6467 info@chargecity.co</small>
                </p>
              </div>

              {/* <Stack direction="row">
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon
                        sx={{ color: "#696969", fontWeight: "bold" }}
                      >
                        Bill to:
                      </ListItemIcon>
                      <ListItemText>00</ListItemText>
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding></ListItem>
                </Stack>
              */}
              <p className="top-header">PAYOUT INVOICE</p>
            </div>
            <hr />
            <div className="mid-row">
              <div className="left-item">
                <p className="list-item">
                  <span className="left-item">Bill To:</span>

                  <span className="right-item">
                    {" "}
                    {props.data.billto ? props.data.billto : "-"}
                  </span>
                </p>

                <p className="list-item">
                  {" "}
                  {props.data.name}
                  <br />
                  {props.data.email}
                  <br />
                  {props.data.address}
                  <br />
                </p>
              </div>

              <div>
                <p className="list-item">
                  <span className="left-item">Invoice Number:</span>

                  <span className="right-item">
                    {" "}
                    {props.data.invoiceNum ? props.data.invoiceNum : "-"}
                  </span>
                </p>

                <p className="list-item">
                  <span className="left-item">Date:</span>

                  <span className="right-item">
                    {" "}
                    {props.data.endDate
                      ? moment(props.data.endDate).format("ll")
                      : "-"}
                  </span>
                </p>
              </div>
            </div>

            <div className="bottom-row">
              <TableContainer>
                <Table aria-label="collapsible table">
                  <TableHead sx={{ backgroundColor: "#1ac47d" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontSize: 18 }}>
                        ID
                      </TableCell>

                      <TableCell sx={{ color: "white", fontSize: 18 }}>
                        CHarge Point Operator Name
                      </TableCell>
                      <TableCell sx={{ color: "white", fontSize: 18 }}>
                        Rate
                      </TableCell>
                      <TableCell sx={{ color: "white", fontSize: 18 }}>
                        Energy
                      </TableCell>
                      <TableCell sx={{ color: "white", fontSize: 18 }}>
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ width: "100%" }}>
                    {props.tableData.map((item: any, index: any) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.rate?.toFixed(2)} /kWh</TableCell>
                        <TableCell>{item.energy?.toFixed(2)}</TableCell>
                        <TableCell>₹{item.rawAmt?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="mid-row">
                <div className="left-item"></div>

                <div>
                  <p className="list-item">
                    <span className="left-item"> Subtotal:</span>

                    <span className="right-item">
                      ₹
                      {props.data.rawAmount
                        ? props.data.rawAmount.toFixed(2)
                        : "-"}
                    </span>
                  </p>
                  <p className="list-item">
                    <span className="left-item"> CGST (9%):</span>

                    <span className="right-item">
                      ₹
                      {props.data.rawAmount
                        ? ((9 / 100) * props.data.rawAmount).toFixed(2)
                        : "-"}
                    </span>
                  </p>
                  <p className="list-item">
                    <span className="left-item"> SGST (9%):</span>

                    <span className="right-item">
                      ₹
                      {props.data.rawAmount
                        ? ((9 / 100) * props.data.rawAmount).toFixed(2)
                        : "-"}
                    </span>
                  </p>
                  <p className="list-item">
                    <span className="left-item">Total:</span>

                    <span className="right-item">
                      ₹
                      {props.data.totalAmount
                        ? props.data.totalAmount.toFixed(2)
                        : "-"}
                    </span>
                  </p>
                  <p className="list-item"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          autoFocus
          fullWidth
          onClick={() => GenerateInvoice()}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InvoiceModal;
