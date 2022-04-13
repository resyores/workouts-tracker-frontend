import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import EmptyPicture from "../logos/profile.jpg";
import ImageModal from "./ImageModal";
import axios from "axios";
import io from "socket.io-client";
import Toast from "react-bootstrap/Toast";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
export default function Navbar({ cookies, logout, setMiddleMan }) {
  const Navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const ProfileUrl = `${window.env.API}/user/${cookies.user.UserID}/profile`;
  const [imageUrl, setImageUrl] = useState(ProfileUrl);
  const [show, setShow] = useState(false);
  const [toastData, setToastData] = useState({});
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  useEffect(() => setImageUrl(ProfileUrl + "?" + Date.now()), [isOpen]);
  function upload(File) {
    const formData = new FormData();
    formData.append("ProfilePicture", File);
    axios
      .post(window.env.API + "/user/addPicture", formData)
      .then(() => setIsOpen(false));
  }
  function AlertWorkout(workout, sender, content) {
    setToastData({
      from: sender.UserName + " commented at " + workout.Title,
      content,
      link: "/workouts/" + workout.WorkoutId,
    });
    setShow(true);
  }
  useEffect(Start, []);
  let socket;
  function Start() {
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token;
    socket = io.connect(window.env.API);
    socket.emit("new-user", cookies.token);
    socket.on("new-comment", (WorkoutId, sender, content) => {
      axios.get(`${window.env.API}/workouts/${WorkoutId}/basic`).then((res) => {
        let workout = res.data;
        workout.WorkoutId = WorkoutId;
        if (sender.UserID != cookies.user.UserID) {
          AlertWorkout(workout, sender, content);
          if (window.location.pathname.toLowerCase() == "/home")
            setMiddleMan(workout);
        }
      });
    });
    socket.on("new-message", (UserId, username, message) => {
      if (UserId != cookies.user.UserID) {
        setToastData({
          from: username + ":",
          content: message,
          link: "/messages/" + UserId,
        });
        setShow(true);
      }
    });
  }

  function Message() {
    axios.post(window.env.API + "/Demo/SendMessage");
  }
  function Comment() {
    axios.post(window.env.API + "/Demo/Comment").catch((err) => {
      if (err.response.status == 400) {
        alert("No workout to comment on");
      }
    });
  }
  function AddVideo() {
    alert(
      "The video is going to be added to the first set of your last workout"
    );
    axios
      .get(window.env.API + "/user/" + cookies.user.UserID + "/workouts")
      .then((res) => {
        if (res.data.length == 0) alert("No workout to add video to");
        else {
          const WorkoutId = res.data[0].WorkoutId;
          axios
            .post(`http://localhost:4000/SetVideo/${WorkoutId}/0?mode=example`)
            .then(() => {
              if (
                window.location.pathname.toLowerCase() ==
                `/workouts/${WorkoutId}`
              )
                setMiddleMan(true);
              else Navigate(`/workouts/${WorkoutId}`, { replace: true });
            });
        }
      });
  }
  return (
    <>
      <nav className="p-3 navbar navbar-dark bg-success navbar-expand-lg justify-content-between">
        <ul className="navbar-nav mr-auto d-flex">
          <Link to="/Home" className="navbar-brand">
            Home
          </Link>
          <li className="navbar-item">
            <Link to="/workouts/create" className="nav-link">
              Create Workout
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/friends" className="nav-link">
              Friends
            </Link>
          </li>
          {cookies.user.demo && (
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Demo Actions
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={Comment}>
                  Comment on the last workout
                </Dropdown.Item>
                <Dropdown.Item onClick={Message}>Message me</Dropdown.Item>
                <Dropdown.Item onClick={AddVideo}>
                  Add video to the last workout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </ul>
        {cookies.token != null && (
          <>
            <span className="d-flex">
              <div className="d-flex" onClick={() => setIsOpen(true)}>
                <img
                  width={60}
                  height={60}
                  src={imageUrl}
                  onError={() => setImageUrl(EmptyPicture)}
                  className="rounded-circle"
                />
                <h5 className="text-white mx-3 mt-2">
                  {cookies.user.username}
                </h5>
              </div>
              <a className="mt-2 text-danger" onClick={logout}>
                logout
              </a>
            </span>
            <ImageModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              CurrentFile={imageUrl}
              upload={upload}
            />
          </>
        )}
      </nav>
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">{toastData.from}</strong>
          <small>just now</small>
        </Toast.Header>
        <a href={toastData.link} className="text-decoration-none">
          <Toast.Body>
            <p className="text-dark">{toastData.content}</p>
          </Toast.Body>
        </a>
      </Toast>
    </>
  );
}
