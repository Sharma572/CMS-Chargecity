import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./invoiceModal.scss";
import {
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import moment from "moment";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import myImg from "../../../icons/main.png";

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

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(props.tableData);
  }, [props.tableData]);
  const handleRateChange = (type: string, id: any, item: any) => {
    let ab: any = [];
    if (type === "Rate") {
      ab = tableData.map((el: any, idx) => {
        if (idx === id) {
          el = { ...el, rate: parseFloat(item) };
        } else {
          return el;
        }
        return el;
      });
    } else {
      ab = tableData.map((el: any, idx) => {
        if (idx === id) {
          el = { ...el, energy: parseFloat(item) };
        } else {
          return el;
        }
        return el;
      });
    }

    setTableData(ab);
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
              <p className="top-header">INVOICE</p>
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
                  <span className="left-item"> Start Date:</span>

                  <span className="right-item">
                    {" "}
                    {props.data.startDate
                      ? moment(props.data.startDate).format("ll")
                      : "-"}
                  </span>
                </p>
                <p className="list-item">
                  <span className="left-item">End Date:</span>

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
                        Item Description
                      </TableCell>
                      <TableCell sx={{ color: "white", fontSize: 18 }}>
                        Rate (/kWh)
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
                    {tableData.map((item: any, index: any) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell
                          contentEditable={true}
                          onInput={(e: any) => {
                            let a = e.currentTarget.textContent;
                            setTimeout(() => {
                              handleRateChange("Rate", index, a);
                            }, 1000);
                          }}
                        >
                          {item.rate ? item.rate.toFixed(2) : ""}
                        </TableCell>
                        <TableCell
                          contentEditable={true}
                          onInput={(e: any) => {
                            let a = e.currentTarget.textContent;
                            setTimeout(() => {
                              handleRateChange("Energy", index, a);
                            }, 1000);
                          }}
                        >
                          {item.energy ? item.energy.toFixed(2) : ""}
                        </TableCell>
                        <TableCell>
                          ₹{(item.rate * item.energy).toFixed(2)}
                        </TableCell>
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
                      {tableData
                        .reduce((acc, curr: any) => {
                          return acc + curr.rate * curr.energy;
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </p>
                  <p className="list-item">
                    <span className="left-item"> CGST (9%):</span>

                    <span className="right-item">
                      ₹
                      {tableData.reduce((acc, curr: any) => {
                        return acc + curr.rate * curr.energy;
                      }, 0)
                        ? (
                            (9 / 100) *
                            tableData.reduce((acc, curr: any) => {
                              return acc + curr.rate * curr.energy;
                            }, 0)
                          ).toFixed(2)
                        : "-"}
                    </span>
                  </p>
                  <p className="list-item">
                    <span className="left-item"> SGST (9%):</span>

                    <span className="right-item">
                      ₹
                      {tableData.reduce((acc, curr: any) => {
                        return acc + curr.rate * curr.energy;
                      }, 0)
                        ? (
                            (9 / 100) *
                            tableData.reduce((acc, curr: any) => {
                              return acc + curr.rate * curr.energy;
                            }, 0)
                          ).toFixed(2)
                        : "-"}
                    </span>
                  </p>
                  <p className="list-item">
                    <span className="left-item">Total:</span>

                    <span className="right-item">
                      ₹
                      {tableData.reduce((acc, curr: any) => {
                        return acc + curr.rate * curr.energy;
                      }, 0)
                        ? (
                            tableData.reduce((acc, curr: any) => {
                              return acc + curr.rate * curr.energy;
                            }, 0) +
                            (18 / 100) *
                              tableData.reduce((acc, curr: any) => {
                                return acc + curr.rate * curr.energy;
                              }, 0)
                          ).toFixed(2)
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
