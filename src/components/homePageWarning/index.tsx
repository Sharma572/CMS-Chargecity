import { useEffect, useState } from "react";
import "./warning.scss";

function Warnings(props: any) {
  const { data } = props;

  const [myData, setMyData] = useState('');
  console.log("charg on going",data?.chargingSession)
  useEffect(() => {
    // Retrieve data from local storage when the component mounts
    localStorage.setItem('activateCharge', data?.chargingSession);
   
  }, [data?.chargingSession]);

  
  return (
    <div className="warning">
      <div className="title">Alerts</div>
      <div className="list">
        <ul>
          <li>
            <span
              style={{
                backgroundColor: "#5185EC",
                border: "#5185EC",
              }}
            >
              {data.chargingPointOnline}
            </span>
            Charging points available
          </li>
          <li>
            <span
              style={{
                backgroundColor: "#F1BE42",
                border: "#F1BE42",
              }}
            >
              {data.chargingPointOffline}
            </span>
            Charging points offline
          </li>
          <li>
            <span
              style={{
                backgroundColor: "#58A55C",
                border: "#58A55C",
              }}
            >
              {data.chargingSession}
            </span>
            Charging Sessions in Progress
          </li>
          <li>
            <span
              style={{
                backgroundColor: "#FF6633",
                border: "#FF6633",
              }}
            >
              {data.chargerBooked}
            </span>
            Chargers Booked
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Warnings;
