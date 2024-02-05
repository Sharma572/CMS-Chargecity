import "./stationMap.scss";
import { MapContainer } from "react-leaflet";
import { memo, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { useMap } from "react-leaflet";
import { Analytics } from "parse";
import { LatLngTuple } from "leaflet";
import { TileLayer } from "react-leaflet";
import { Marker } from "react-leaflet";
import { Popup } from "react-leaflet";
import logo from "../../icons/Type2.png";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
} from "@mui/material";
const defaultLatLng: LatLngTuple = [48.865572, 2.283523];
const zoom: number = 8;
interface dataObj {
  id: string;
  label: string;
}
const StationMap = memo(() => {
  const [allChargePointData, setAllChargePointData] = useState<any>([]);
  const getAllChargePoint = () => {
    const ChargePoints = Parse.Object.extend("Chargers");

    const parseQuery = new Parse.Query(ChargePoints);
    parseQuery.include("Location");
    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let locationArray: any[] = [];

      result.forEach((item, index) => {
        locationArray.push({
          id: item.id,
          serial: item.get("Serial"),
          power: `${item.get("Power")}`,
          location: `${item.get("Location")?.id}`,
          status: "-",
          connector: `${item.get("Connector")}`,
          tariff: `${item.get("Cost")}`,
          taxRate: `${item.get("TaxRate")}`,
          user: "-",
          duration: "-",
          connected: "-",
          energyConsumed: "-",
          vendor: item.get("Brand"),
          chargerId: item.get("ChargeId"),
          inclusiveTax: item.get("inclusiveTax") ? "true" : "false",
        });
      });
      setAllChargePointData(locationArray);
    });
  };
  useEffect(() => {
    getAllChargePoint();
  }, []);

  const [allLocationData, setAllLocationData] = useState<any>([]);
  const getAllLocations = () => {
    const Locations = Parse.Object.extend("Locations");

    const parseQuery = new Parse.Query(Locations);
    parseQuery.limit(50);
    parseQuery.find().then((result) => {
      let locationArray: any[] = [];

      result.forEach((item, index) => {
        locationArray.push({
          id: item.id,
          name: `${item.get("Name")}`,
          lat: item.get("GeoLocation")._latitude,
          long: item.get("GeoLocation")._longitude,
          address: item.get("Address"),
        });
      });
      setAllLocationData(locationArray);
    });
  };
  useEffect(() => {
    getAllLocations();
  }, []);

  const newFn = () => {
    console.log(
      "lop",
      allLocationData.map((item: any) => ({
        ...item,
        ...allChargePointData.find((el: any) => el.location === item.id),
      }))
    );
  };

  useEffect(() => {
    if (allChargePointData.length && allLocationData.length) newFn();
  }, [allChargePointData, allLocationData]);

  const [showMapInfoBar, setShowMapInfoBar] = useState(false);
  const [mapInfoData, setMapInfoData] = useState<any>({
    name: "",
    lat: "",
    long: "",
    address: "",
  });

  const columns = [
    { field: "serial", headerName: "Serial", width: 100 },
    { field: "power", headerName: "Power", width: 100 },

    { field: "connector", headerName: "Connector", width: 100 },
    { field: "capacity", headerName: "Capacity", width: 100 },
  ];

  return (
    <div className="map-container">
      {showMapInfoBar ? (
        <div className="map-info">
          <HighlightOffIcon
            className="closeIcon"
            onClick={() => setShowMapInfoBar(false)}
          />
          <hr />
          <div className="locTitle">{mapInfoData.name}</div>
          <div className="addressRow">
            <span className="addressHead">Location</span>

            <span className="addressInfo">{mapInfoData.address}</span>
          </div>
          <div className="chargerRow">
            <span className="chargerHead">Chargers</span>
            <hr />
            <div className="chargerInfo">
              {allChargePointData
                .filter((item: any) => item.location === mapInfoData.id)
                .map((row: any) => (
                  <div className="chargerList">
                    <div className="chargerType">
                      <span className="label">
                        <p className="labelText">Available</p>
                      </span>{" "}
                      <span className="chargerTypeData">
                        AC {row.connector} {row.serial} {row.vendor}
                      </span>
                    </div>
                    <div className="chargerCapacity">
                      <img src={logo} className="icon" />
                      {row.vendor === "EO" ? (
                        <span className="barData">Power {row.power}</span>
                      ) : (
                        <span className="barData">
                          Instant Power 0/{row.power}
                          <LinearProgress
                            variant="buffer"
                            value={70}
                            sx={{
                              height: 10,
                              width: 400,
                              color: "success.main",
                            }}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <MapContainer
        className="mapContainer"
        center={[28.6448, 77.216721]}
        zoom={13}
        style={{ zIndex: 0 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {allLocationData.length > 0 &&
          allLocationData.map(
            (marker: {
              id: string;
              lat: number;
              long: number;
              name: string;
              address: string;
            }) => (
              <Marker
                position={[marker.lat, marker.long]}
                eventHandlers={{
                  click: (e) => {
                    setShowMapInfoBar(true);
                    setMapInfoData({
                      id: marker.id,
                      name: marker.name,

                      address: marker.address,
                    });
                  },
                }}
              >
                <Popup>{marker.name}</Popup>
              </Marker>
            )
          )}
      </MapContainer>
    </div>
  );
});

export default StationMap;
