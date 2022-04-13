import React, { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import useLoader from "../../../Hooks/useLoader";
import useObserver from "../../../Hooks/useObserver";
import axios from "axios";
import MessageRow from "../Components/MessageRow";
import FriendRow from "../Components/FriendRow";
import Button from "react-bootstrap/Button";
import Field from "../../../BaseComponents/Field";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const styles = {
  position: "relative",
  height: "300px",
  overflow: "auto",
  backgroundColor: "#F5F5F5",
  borderRadius: "10px",
};
export default function Messages() {
  const Navigate = useNavigate();
  const id = parseInt(window.location.href.split("/")[4]);
  const [cookies] = useCookies(["token", "user"]);
  const [write, setWrite] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [friend, setFriend] = useState({});
  const [isAuth, setIsAuth] = useState(false);
  const {
    loading,
    error,
    hasMore,
    items: messages,
    setItems: setMessages,
  } = useLoader(
    "",
    pageNumber,
    cookies.token,
    window.env.API + "/messages/" + id,
    true
  );
  useEffect(Start, []);
  let socket;
  function Start() {
    socket = io.connect(window.env.API);
    socket.emit("enter-chat", id, cookies.token);
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token; // for all requests
    axios
      .get(window.env.API + "/user/" + id + "/userdata")
      .then((res) => {
        setFriend(res.data.userdata);
        setIsAuth(res.data.isauth);
        if (!socket) return;
        socket.on("message", (message) => {
          if (id != cookies.user.UserID)
            setMessages((prveMessages) => [
              { senderid: id, content: message },
              ...prveMessages,
            ]);
        });
      })
      .catch((err) => {
        Navigate("/Home", { replace: true });
      });
  }
  useEffect(() => {
    return () => {
      if (socket) socket.close();
    };
  }, []);
  function SendMessage() {
    if (!write) return;
    axios
      .post(window.env.API + "/messages/send/" + id, {
        content: write,
      })
      .then((res) => {
        setMessages([
          { senderid: cookies.user.UserID, content: write },
          ...messages,
        ]);
        setWrite("");
      });
  }
  const lastMessageElementRef = useObserver(loading, hasMore, setPageNumber);
  return (
    <>
      <FriendRow friend={{ ...friend, UserId: id }} clickable={true} />
      {isAuth ? (
        <>
          <div
            style={styles}
            className="d-flex flex-column-reverse w-75v list-group"
          >
            {messages.map((message, index) => {
              if (messages.length - 1 == index)
                return (
                  <span ref={lastMessageElementRef}>
                    <MessageRow
                      message={message}
                      userid={cookies.user.UserID}
                    />
                  </span>
                );
              return (
                <MessageRow message={message} userid={cookies.user.UserID} />
              );
            })}
          </div>
          <div className="d-flex justify-content-center">
            <Field value={write} setter={setWrite} />
            <Button
              className="btn-outline-success btn-light h-25 mt-4"
              onClick={SendMessage}
            >
              {" "}
              send
            </Button>
          </div>
        </>
      ) : (
        <h2 className="text-muted text-center mt-4">
          You can't message this user beacause you are not friends
        </h2>
      )}
    </>
  );
}
