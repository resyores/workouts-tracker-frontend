import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Friend from "../Components/FriendRow";
import Error from "../../../BaseComponents/Error";
import Modal from "../../../BaseComponents/Modal";
import Field from "../../../BaseComponents/Field";
export default function Friends() {
  const Navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [requestUserName, setRequestUserName] = useState("");
  const [requested, setRequested] = useState(false);
  const [cookies, _] = useCookies(["user", "token"]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState({ message: "" });
  useEffect(Start, []);
  const openRequestModal = () => {
    setIsOpen(true);
    setError({ message: "" });
  };
  function Start() {
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token; // for all requests
    axios.get(window.env.API + "/friends").then((res) => {
      if (res.status == 200) setFriends(res.data);
    });
  }
  function Invite(UserToRequest) {
    axios
      .post(window.env.API + "/invites/add/" + UserToRequest)
      .then((res) => {
        setRequested(true);
        setTimeout(() => {
          setIsOpen(false);
          setRequested(false);
        }, 1500);
      })
      .catch((err) => {
        if (err.response.status == 400) {
          setError({ message: err.response.data });
          setRequestUserName("");
        }
      });
  }

  const Modalcontent = (requestUserName, requested) => {
    if (requested)
      return <h2 className="text-success text-center mt-4">Requested</h2>;
    return (
      <>
        <Field
          Name="FriendName"
          Label="UserName to invite:"
          setter={setRequestUserName}
        />
        <Error error={error} />
        <div className="d-flex justify-content-between mt-3 w-75">
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            className="btn-secondary"
          >
            Cancel
          </Button>
          <Button
            className="btn-primary"
            onClick={() => {
              Invite(requestUserName);
            }}
          >
            Request
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      <Modal open={isOpen}>{Modalcontent(requestUserName, requested)}</Modal>
      <div className="d-flex justify-content-center mt-3 ">
        <Button className="btn-success w-25" onClick={openRequestModal}>
          Invite friend
        </Button>
        <a
          href="/requests"
          className="btn-outline-success bg-light-green btn w-25"
        >
          Friend Requests
        </a>
      </div>
      {friends.length ? (
        friends.map((friend) => {
          return <Friend friend={friend} clickable={true} />;
        })
      ) : (
        <h3 className="text-muted text-center mt-2">No Current Friends</h3>
      )}
    </>
  );
}
