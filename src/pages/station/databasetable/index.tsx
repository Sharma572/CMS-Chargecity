import React, { useEffect, useState, memo } from "react";
import "./databaseTable.scss";
import AddEditModal from "../addEditModal/AddEditModal";
import AddEditChargerModal from "../addEditCharger/AddEditChargerModal";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  Paper,
  TableContainer,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import moment from "moment";

interface tableProps {
  dataRow: any;
  refreshLocation: any;
  liveOcppData: any;
  loading: boolean;
}
const DatabaseTable = memo((props: tableProps) => {
  const [allChargePointData, setAllChargePointData] = useState<any>([]);

  // TO get all live session of OCPP Charges and its Data
  const loadSessions = () => {
    const parseQuery = new Parse.Query("ChargeSession");

    parseQuery.include("ChargePoint");
    parseQuery.include("Location");
    parseQuery.include("Vehicle");
    parseQuery.include("User");
    parseQuery.descending("createdAt");

    parseQuery.find().then((result) => {
      let newRow: any[] = [];
      result.forEach((item, index) => {
        if (item.get("Live") && item.get("ChargePoint").get("isOCPP")) {
          console.log("nop", item.id);
          newRow.push({
            chargeSessionId: item.id,
            userId: `${item.get("User").id}`,
            serial: `${item.get("ChargePoint").get("Serial")}`,
            transactionId: `${item.get("TransactionId")}`,
            userName: `${item.get("User").get("FullName")}`,
            createdAt: `${item.get("createdAt")}`,
          });
        } else {
          return;
        }
      });

      getAllChargePoint(newRow);
    });
  };

  useEffect(() => {
    if (props.liveOcppData.length) loadSessions();
  }, [props.liveOcppData]);

  let userDetail: any = localStorage.getItem("user-details");
  const currentUser: any = Parse.User.current();
  const getAllChargePoint = (liveOcppsChargesession: any) => {
    console.log("noi", props.liveOcppData);
    const ChargePoints = Parse.Object.extend("Chargers");

    const parseQuery = new Parse.Query(ChargePoints);
    parseQuery.include("Location");
    parseQuery.include("CP_Vendors");
    parseQuery.include("ConnectorType");
    parseQuery.include("ChargePointOperators");
    parseQuery.limit(50);
    if (currentUser && !JSON.parse(userDetail).isSuperAdmin) {
      parseQuery.equalTo("CPO", currentUser.get("CPO"));
    }
    parseQuery.find().then((result) => {
      let chargerArray: any[] = [];

      result.forEach((item, index) => {
        let connectorType = item.get("ConnectorType");
        let vendor = item.get("Vendor");
        let cpo = item.get("CPO");
        let ab = {
          id: item.id,
          serial: item.get("Serial"),
          power: `${item.get("Power")}`,
          chargingRate: `${item.get("ChargingRate")}`,
          location: `${item.get("Location")?.id}`,
          status: item.get("isOCPP")
            ? props.liveOcppData?.filter(
                (el: any) => el.ocppName === item.get("ChargeId")
              )[0]?.status || "Offline"
            : "",
          ocppName: props.liveOcppData?.filter(
            (el: any) => el.ocppName === item.get("ChargeId")
          )[0]?.ocppName,
          isActive: props.liveOcppData?.filter(
            (el: any) => el.ocppName === item.get("ChargeId")
          )[0]?.active,
          connector: {
            id: connectorType?.id ? connectorType.id : "",
            name: connectorType?.get("Name") ? connectorType.get("Name") : "",
          },
          tariff: `${item.get("Cost")}`,
          taxRate: `${item.get("TaxRate")}`,
          user: "-",
          duration: "-",
          connected: "-",
          energyConsumed: "-",
          vendor: {
            id: vendor?.id,
            name: vendor?.get("Name"),
          },
          chargerId: item.get("ChargeId"),
          inclusiveTax: item.get("inclusiveTax") ? "true" : "false",
          cost: item.get("Cost"),
          isEnabled: item.get("isEnabled") ? "true" : "false",
          disabledReason: item.get("DisableReason"),
          cpo: {
            id: cpo?.id,
            name: cpo?.get("Name"),
          },
          isOcpp: item.get("isOCPP") ? "true" : "false",
        };

        // Trasaction id to get meter values and userId to Stop charging
        if (
          liveOcppsChargesession
            .map((item: any) => item.serial)
            .includes(ab.serial)
        ) {
          getOcppData(
            liveOcppsChargesession.filter(
              (item: any) => item.serial === ab.serial
            )[0].transactionId,
            ab,
            liveOcppsChargesession.filter(
              (item: any) => item.serial === ab.serial
            )[0].userId,
            liveOcppsChargesession.filter(
              (item: any) => item.serial === ab.serial
            )[0].userName,
            liveOcppsChargesession.filter(
              (item: any) => item.serial === ab.serial
            )[0].createdAt,
            liveOcppsChargesession.filter(
              (item: any) => item.serial === ab.serial
            )[0].chargeSessionId
          );
        } else {
          chargerArray.push(ab);
        }
      });

      setAllChargePointData(chargerArray);
    });
  };

  const getOcppData = async (
    id: any,
    item: any,
    userId: any,
    userName: any,
    start: any,
    chargeSessionId: any
  ) => {
    await fetch(`${process.env.REACT_APP_OCPP_BASE_URL}/meter_value/${id}`)
      .then((response: any) => response.json())
      .then((res: any) => {
        setAllChargePointData((oldArray: any) => [
          ...oldArray,
          {
            ...item,
            energyConsumed: (res.energy_active_import_register / 1000).toFixed(
              2
            ),

            duration:
              moment.duration(moment(res.timestamp).diff(start)).hours() +
              "hr" +
              " " +
              moment.duration(moment(res.timestamp).diff(start)).minutes() +
              "min",

            ocppCost: (
              item.tariff *
              (res.energy_active_import_register / 1000)
            ).toFixed(2),

            ocppTransactionId: res.transaction_id,
            ocppUserId: userId,
            userName: userName,
            chargeSessionId: chargeSessionId,
          },
        ]);
      });
  };

  const { dataRow } = props;

  function createData(
    id: string,
    stationName: number,
    type: number,
    city: number,
    access: number,
    operator: number
  ) {
    return {
      id,
      stationName,
      type,
      city,
      access,
      operator,
    };
  }

  const handleResetOcppCharging = (name: any) => {
    if (
      !window.confirm(`Are you sure you want to reboot the charger ${name} ?`)
    )
      return;

    (async () => {
      await fetch(
        `${process.env.REACT_APP_OCPP_BASE_URL}/reset?name=${name}&reset_type=hard`,
        {
          method: "POST",
        }
      ).then(() => {
        alert(`${name} Rebooted`);
      });
    })();
  };

  const handleStopChargingBack4app = (
    id: any,
    energy: any,
    time: any,
    cost: any,
    range: any
  ) => {
    let myNewObject: Parse.Object = new Parse.Object("ChargeSession");
    console.log("hui", typeof id);
    myNewObject.set("objectId", id);
    myNewObject.set("TotalEnergyConsumed", Number(energy));
    // myNewObject.set("TotalTimeConsumed", time);
    myNewObject.set("TotalCost", cost);
    // myNewObject.set("RangeAdded", range);
    myNewObject.set("Live", false);

    myNewObject.save().then(() => {
      alert("Charger Stopped");
    });
  };

  const handleStopOcppCharging = (
    csId: any,
    name: any,
    transactionId: any,
    userId: any,
    cost: any,
    energy: any,
    time: any,
    range: any
  ) => {
    console.log("lkj", csId);

    if (
      !window.confirm(
        `Are you sure you want to stop the charging session ${name} ?`
      )
    )
      return;
    (async () => {
      await fetch(
        `${process.env.REACT_APP_OCPP_BASE_URL}/remote_stop?cp_name=${name}&transaction=${transactionId}&userId=${userId}&amount=${cost}&detail=Charge Session Id is ${csId}`,
        {
          method: "POST",
        }
      ).then(() => handleStopChargingBack4app(csId, energy, time, cost, range));
    })();
  };
  function Row(props: {
    [x: string]: any;
    row: ReturnType<typeof createData>;
  }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [actionOpen, setActionOpen] = React.useState(false);
    const [showAddEditLocationModal, setShowAddEditLocationModal] =
      useState(false);
    const [showAddEditChargerModal, setShowAddEditChargerModal] =
      useState(false);
    const [editLocationData, setEditLocationData] = useState({});
    const [editChargerData, setEditChargerData] = useState({});

    const handleEditCharger = (item: any) => {
      setEditChargerData(item);
      setShowAddEditChargerModal(true);
    };
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell component="th" scope="row">
            {row.id}
          </TableCell>
          <TableCell>{row.stationName}</TableCell>
          <TableCell>{row.type}</TableCell>
          <TableCell>{row.city}</TableCell>
          <TableCell>{row.access}</TableCell>

          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              <span className="toggleButton">
                {open ? "Hide Charger" : "Show Charger"}
              </span>
            </IconButton>
          </TableCell>
          <TableCell>
            {" "}
            <Button
              variant="contained"
              sx={{ maxWidth: 150 }}
              onClick={() => {
                setShowAddEditLocationModal(true);
                setEditLocationData(row);
              }}
            >
              Edit Location
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  <span className="innertableTitle">Chargers</span>
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead className="innerTableHead">
                    <TableRow>
                      <TableCell className="innerTable">
                        Serial Number
                      </TableCell>
                      <TableCell className="innerTable">Max Power</TableCell>
                      <TableCell className="innerTable">Status</TableCell>
                      <TableCell className="innerTable">Duration</TableCell>
                      <TableCell className="innerTable">Connected</TableCell>
                      <TableCell className="innerTable">Cost</TableCell>
                      <TableCell className="innerTable">
                        Energy Consumed
                      </TableCell>
                      <TableCell className="innerTable">Operator</TableCell>
                      <TableCell className="innerTable">User</TableCell>

                      {actionOpen ? (
                        <TableCell className="innerTable" align="left">
                          Action
                        </TableCell>
                      ) : (
                        <TableCell className="innerTable" align="center">
                          Action
                        </TableCell>
                      )}

                      <TableCell
                        className="innerTable"
                        align="center"
                      ></TableCell>
                    </TableRow>
                  </TableHead>

                  {allChargePointData
                    .filter(
                      (item: { location: any }) => item.location === row.id
                    )
                    .map((item: any) => {
                      return (
                        <TableBody key={item.id}>
                          <TableCell>{item.serial}</TableCell>
                          <TableCell>{item.power}</TableCell>
                          <TableCell>
                            {item.status === "Available" && (
                              <span className="label-available">
                                Available{" "}
                              </span>
                            )}

                            {item.status === "Charging" && (
                              <span className="label-charging"> Charging</span>
                            )}

                            {item.status === "Preparing" && (
                              <span className="label-connected">Connected</span>
                            )}
                            {item.status === "Finishing" && (
                              <span className="label-connected">Connected</span>
                            )}
                            {item.status === "Offline" && (
                              <span className="label-offline">Offline</span>
                            )}
                            {item.status === "Faulted" && (
                              <span className="label-faulted">Faulted</span>
                            )}
                          </TableCell>
                          <TableCell>{item.duration}</TableCell>
                          <TableCell>
                            {item.status
                              ? item.status === "Charging" ||
                                item.status === "Preparing"
                                ? "Yes"
                                : "No"
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {item.cost * item.energyConsumed
                              ? item.cost * item.energyConsumed
                              : "-"}
                          </TableCell>
                          <TableCell>{item.energyConsumed}</TableCell>
                          <TableCell>{item.cpo.name}</TableCell>
                          <TableCell>{item.userName}</TableCell>
                          {item.vendor !== "EO" ? (
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
                                      onClick={() =>
                                        handleStopOcppCharging(
                                          item.chargeSessionId,
                                          item.ocppName,
                                          item.ocppTransactionId,
                                          item.ocppUserId,
                                          Math.round(item.ocppCost),
                                          item.energyConsumed,
                                          20,
                                          10
                                        )
                                      }
                                    >
                                      Stop Charging
                                    </Button>

                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={() =>
                                        handleResetOcppCharging(item.ocppName)
                                      }
                                    >
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
                          )}

                          <TableCell>
                            {" "}
                            <Button
                              variant="contained"
                              sx={{ width: 150 }}
                              onClick={() => handleEditCharger(item)}
                            >
                              Edit Charger
                            </Button>
                          </TableCell>
                          <AddEditChargerModal
                            show={showAddEditChargerModal}
                            handleClose={() =>
                              setShowAddEditChargerModal(false)
                            }
                            data={editChargerData}
                            type="Edit"
                          />
                        </TableBody>
                      );
                    })}
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <AddEditModal
          show={showAddEditLocationModal}
          handleClose={() => setShowAddEditLocationModal(false)}
          type="Edit"
          data={editLocationData}
          refreshLocation={() => console.log("Hey")}
          allChargePointData={allChargePointData}
        />
      </React.Fragment>
    );
  }

  return (
    <div className="databaseTable">
      <div className="title">All Locations ({dataRow.length})</div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead className="tHead">
            <TableRow>
              <TableCell className="tCell">Id</TableCell>
              <TableCell className="tCell">Name</TableCell>
              <TableCell className="tCell">Type</TableCell>
              <TableCell className="tCell">City</TableCell>

              <TableCell className="tCell">Access</TableCell>

              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {props.loading ? (
              <Box
                width="100%"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress color="success" />
              </Box>
            ) : (
              dataRow.length &&
              dataRow?.map((row: any) => {
                return <Row key={row.name} row={row} />;
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
});

export default DatabaseTable;
