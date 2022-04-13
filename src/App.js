import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useCookies } from "react-cookie";
import SignUp from "./pages/AuthPages/SignUp";
import Login from "./pages/AuthPages/Login";
import Base from "./pages/Extras/Base";
import Home from "./pages/UserView/pages/Home";
import FriendWorkouts from "./pages/UserView/pages/FriendWorkouts";
import Create from "./pages/Extras/Create";
import Workout from "./pages/Workouts/Pages/Workout";
import Friends from "./pages/Friends/pages/Friends";
import Requests from "./pages/Friends/pages/Requests";
import NavBar from "./NavBarComponents/NavBar";
import { Route, Routes } from "react-router-dom";
import Messages from "./pages/Friends/pages/Messages";
import { useNavigate } from "react-router-dom";
import "./css/colors.css";
function App() {
  window.env = {};
  window.env.API = "https://workouts-tracker-api.herokuapp.com";
  const Navigate = useNavigate();
  const [cookies, _, removeCookies] = useCookies(["user", "token"]);
  const [middleMan, setMiddleMan] = useState(null);
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (cookies.token && cookies.user) {
      if (path == "/signin" || path == "/login") {
        Navigate("/Home", { replace: true });
      }
    } else if (path != "/signup" && path != "/login") {
      logout();
    }
  });
  function logout() {
    removeCookies("token", { path: "/" });
    removeCookies("user", { path: "/" });
    Navigate("/Login", { replace: true });
  }
  return (
    <div
      style={{
        backgroundColor: "#E0E0E0",
        width: "100%",
        minHeight: "100%",
        position: "absolute",
        left: "0px",
      }}
    >
      {cookies.user && cookies.token && (
        <NavBar cookies={cookies} logout={logout} setMiddleMan={setMiddleMan} />
      )}
      <Routes>
        <Route exact path="/Login" element={<Login />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route exact path="/" element={<Base />} />
        <Route
          exact
          path="/home"
          element={
            <Home setWorkoutUpdated={setMiddleMan} workoutUpdated={middleMan} />
          }
        />

        <Route exact path="/workouts/create" element={<Create />} />

        <Route
          exact
          path="/workouts/:id"
          element={
            <Workout
              setWorkoutChanged={setMiddleMan}
              workoutChanged={middleMan}
            />
          }
        />
        <Route exact path="/friends" element={<Friends />} />
        <Route exact path="/requests" element={<Requests />} />
        <Route exact path="/friends/:id" element={<FriendWorkouts />} />
        <Route exact path="/messages/:id" element={<Messages />} />
      </Routes>
    </div>
  );
}
export default App;
