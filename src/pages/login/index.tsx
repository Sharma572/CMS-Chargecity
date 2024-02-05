import { useEffect, useState } from "react";
import "./login.scss";
import "./style.scss";

import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import top from "../../icons/image 24.png";
import topBannerImg from "../../icons/image 26.png";
import bottomBannerImg from "../../icons/image 25.png";
import privacy from "../../icons/privacy.pdf";
import refund from "../../icons/refund.pdf";
import service from "../../icons/terms.pdf";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { CircularProgress, Input, Link, Stack } from "@mui/material";
import { useAppDispatch } from "../../store/store";
import { getAllRoles } from "../../store/features/roleSlice";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const Login = () => {
  const dispatch = useAppDispatch();
  const [userDetail, setUserDetail] = useState({
    name: "",
    password: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let user = Parse.User.current();
    if (user) {
      setLoading(true);
      Parse.Session.current().then((session) => {
        setLoading(false);
        if (session.id) {
          navigate("/home");
        }
      });
    }
  }, []);

  const submitOtp = () => {
    setLoading(true);
    // Check the OTP with the server.
    const parseQuery: any = Parse.User.logIn(
      userDetail.name,
      userDetail.password
    );

    parseQuery
      .then((res: any) => {
        // Check if the user is allowed to access the Dashboard.
        if (!res.attributes.allowDashboard) alert("Unassigned User");
        else {
          // The dashboard permissions are stored in the local storage.
          // Later these info will be used in sidebar component to show only those dashboard which are allowed for that particular user
          localStorage.setItem("session-id", res.attributes.sessionToken);
          localStorage.setItem(
            "user-details",
            JSON.stringify({
              userName: res.attributes.FullName,
              email: res.attributes.email,
              isSuperAdmin: res.attributes.isSuperAdmin,
            })
          );
          localStorage.setItem(
            "roles",
            res.attributes.isSuperAdmin === true
              ? [
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
                  "Invoices",
                ]
              : res.attributes.RoleAssigned
          );
          dispatch(getAllRoles(res.attributes.RoleAssigned));
          navigate("/home");
        }
        setLoading(false);
      })
      .catch((err: any) => {
        alert(err);
        setLoading(false);
      });
  };
  // For forgot password feature
  // Checking all the emails weather the user email is in database or not
  const [allEmail, setAllEmail] = useState<any>([]);
  useEffect(() => {
    const parseQuery = new Parse.Query("User");
    parseQuery.descending("createdAt");
    parseQuery.include("EV");
    parseQuery.limit(5000);
    parseQuery.equalTo("UserType", "Cloud");
    parseQuery.find().then((result) => {
      let newRow: any = [];
      result.forEach((user, index) => {
        newRow.push(user.get("username"));
      });
      setAllEmail(newRow);
    });
  }, []);

  const [viewForgetPassLink, setViewForgetPassLink] = useState(true);

  const disableLink = () => {
    setTimeout(function () {
      setViewForgetPassLink(true);
    }, 30000);
  };
  //Function to handle forget password and this will send mail
  const handleForgetPassword = () => {
    setViewForgetPassLink(true);

    if (!userDetail.name) {
      alert("Please Enter Email");
    } else {
      if (allEmail.includes(userDetail.name)) {
        Parse.User.requestPasswordReset(userDetail.name)
          .then(() => {
            setViewForgetPassLink(false);
            alert("Password reset request was sent successfully on your mail");
            disableLink();
          })
          .catch((error) => {
            // Show the error message
            alert("Error: " + error.code + " " + error.message);
          });
      } else {
        alert("Email not registered!");
      }
    }
  };

  // const IconTextField = ({
  //   iconStart,
  //   InputProps,

  //   ...props
  // }: any) => {
  //   return (
  //     <TextField
  //       inputProps={{
  //         style: { margin: 0, padding: 0, height: 35 },
  //       }}
  //       {...props}
  //       fullWidth
  //       InputProps={{
  //         ...InputProps,
  //         startAdornment: iconStart ? (
  //           <InputAdornment position="start">{iconStart}</InputAdornment>
  //         ) : null,
  //       }}
  //     />
  //   );
  // };

  // On press Enter to Submit OTP
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      submitOtp();
    }
  };

  return (
    <>
     <div className="h-lvh overflow-x-hidden">
    <div className="flex flex-wrap h-lvh -mx-2">
      <div className="w-full md:w-1/2">
        {/* Content for the first div */}
        <div  className=" flex flex-col justify-between content-between h-full logo_container">
          <div className="flex flex-row-reverse">  
          <img src={topBannerImg} style={{ height: "25vh" }} />
          </div>   
          <div className="flex justify-center">
          <img src={top} style={{ height: "25vh" }} />
          </div>  
          <div className="relative top-36 left-9 p-4 text-center w-10/12 flex flex-col justify-center Address_container">
            <p>1800-843-6467 | info@chargecity.co</p>
            <p>Regus, Plot No.22,TOWER-2,
Assotech Business Cresterra,
Sector 135, Noida, UP 201301</p>
          </div>    
          <div className="">
          <img src={bottomBannerImg} style={{ height: "25vh" }} />
          </div>
         
        </div>
      </div>
      <div className="flex  justify-center content-center w-full h-lvh md:w-1/2">
        {/* Content for the second div */}
        <div className="h-full flex flex-col justify-center ">
          <h1 className="ml-8 text-3xl font-bold mb-4">Login</h1>
          <Stack direction="column" gap={4} alignItems="center">
                <Input
                  placeholder="Username"
                  sx={{ width: 270 }}
                  inputProps={{
                    style: {
                      margin: 0,
                      padding: 0,
                      height: 35,
                      backgroundColor: "white",
                    },
                  }}
                  value={userDetail.name}
                  onChange={(e: { target: { value: any } }) =>
                    setUserDetail({ ...userDetail, name: e.target.value })
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircleIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  }
                />{" "}
                <Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  sx={{ width: 270 }}
                  inputProps={{
                    style: {
                      margin: 0,
                      padding: 0,
                      height: 35,
                      backgroundColor: "white",
                    },
                  }}
                  value={userDetail.password}
                  onChange={(e: { target: { value: any } }) =>
                    setUserDetail({ ...userDetail, password: e.target.value })
                  }
                  onKeyPress={handleKeyPress}
                  startAdornment={
                    <InputAdornment position="start">
                      <VpnKeyIcon sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  }
                />{" "}
                <div className="w-full flex justify-around items-center content-center">
                  {/* <button
                    type="submit"
                    className="btn "
                    id="login"
                    onClick={() => submitOtp()}
                    
                  >
                    Login
                  </button> */}
                  <button type="submit" id="login" onClick={() => submitOtp()} className="flex ml-4 rounded-full justify-between w-24 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    Login
                    <FaArrowRightLong className="mt-1  " />
                    </button>
       
                    <div>
                  {viewForgetPassLink ? (
                    <Link className="forgot_pass" href="#" onClick={() => handleForgetPassword()}>
                      {" "}
                      Send forget password link?
                    </Link>
                  ) : (
                    <small className="link-sent">
                      Please check your mail{" "}
                      <MarkEmailReadIcon
                        sx={{
                          fontSize: "18px",
                          alignSelf: "center",
                          justifySelf: "center",
                        }}
                      />
                    </small>
                  )}
                </div>
                </div>
                <div className="refund_policy">
                Refund Policy | Privacy Policy | Terms and Conditions
                </div>
                
                {loading ? <CircularProgress color="success" /> : ""}
              </Stack>
        </div>
      </div>
    </div>
  </div>  
    </>
   
  );
};
export default Login;
