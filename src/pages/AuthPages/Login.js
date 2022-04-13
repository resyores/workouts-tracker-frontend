import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Field from "../../BaseComponents/Field";
import Modal from "../../BaseComponents/Modal";
import { Link, useNavigate } from "react-router-dom";
import "../../css/form.css";
import axios from "axios";
import { useCookies } from "react-cookie";
import exampleWorkout from "../../utils/exampleWorkout";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
const popover = (
  <Popover>
    <Popover.Header as="h3">Demo Mode</Popover.Header>
    <Popover.Body>
      Press Here if you only want a demo and don't forget to check the demo
      actions
    </Popover.Body>
  </Popover>
);
export default function Login() {
  const Navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user", "token"]);
  useEffect(CheckIfToken, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [demoDisabled, setDemoDisabled] = useState(false);
  function validateForm(email, password) {
    return email.length > 0 && password.length > 0;
  }
  function CheckIfToken() {
    if (cookies.token) Navigate("/Home", { replace: true });
  }
  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post(window.env.API + "/Auth/Login", { email, password })
      .then((res) => {
        if (res.data.isAuth) {
          setCookie("token", res.data.token, { path: "/" });
          setCookie("user", res.data.user, { path: "/" });
          Navigate("/Home", { replace: true });
        }
      })
      .catch((err) => {
        if (err.response.status == 400) {
          reset(err.response.data);
        }
      });
  }
  function reset(error) {
    setError(error);
    setEmail("");
    setPassword("");
  }
  function CreateDemo(e) {
    e.preventDefault();
    setDemoDisabled(true);
    axios.post(window.env.API + "/Demo/Start").then((res) => {
      axios.defaults.headers.common["authorization"] =
        "bearer " + res.data.token;
      axios.post(window.env.API + "/workouts/add", exampleWorkout).then(() => {
        setCookie("token", res.data.token, { path: "/" });
        setCookie("user", { ...res.data.user, demo: true }, { path: "/" });
        Navigate("/Home", { replace: true });
      });
    });
  }

  return (
    <div className="Login">
      <Modal open={error.length}>
        <div className="col text-center">
          <h4>{error}</h4>
          <Button
            className="btn-secondary w-25 mt-3"
            onClick={() => {
              setError("");
            }}
          >
            close
          </Button>
        </div>
      </Modal>
      <Form onSubmit={handleSubmit}>
        <Field
          Name="email"
          Label="Email"
          Type="email"
          value={email}
          setter={setEmail}
        />
        <Field
          Name="password"
          Label="Password"
          Type="password"
          value={password}
          setter={setPassword}
        />
        <div className="d-flex flex-column">
          <span>
            <Button
              block
              size="lg"
              type="submit"
              disabled={!validateForm(email, password)}
              className="submit-btn"
            >
              Login
            </Button>

            <Link to="/SignUp">Create an account</Link>
          </span>
          <OverlayTrigger placement="bottom" overlay={popover}>
            <Button
              className="btn-success w-50"
              onClick={CreateDemo}
              disabled={demoDisabled}
            >
              Demo
            </Button>
          </OverlayTrigger>
        </div>
      </Form>
    </div>
  );
}
