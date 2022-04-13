import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import commentLogo from "../../../logos/comment.png";
import WorkoutHead from "../Components/WorkoutHead";
import axios from "axios";
import Comments from "../Components/WorkoutComments";
import io from "socket.io-client";
import SetsView from "../Components/SetsView";
import useLoader from "../../../Hooks/useLoader";
import useObserver from "../../../Hooks/useObserver";
import InputVideo from "../Components/InputVideo";
export default function Workout({ workoutChanged, setWorkoutChanged }) {
  const id = parseInt(window.location.href.split("/")[4]);
  const Navigate = useNavigate();
  const [cookies, _] = useCookies();
  const [workout, setWorkout] = useState([]);
  const [title, setTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [isPublic, setPublic] = useState(false);
  const [date, setDate] = useState(new Date(0));
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currSetNum, setCurrSetNum] = useState(-1);
  const [refreshVideo, setRefreshVideo] = useState(0);
  let socket;
  let targetUrl = cookies.user
    ? window.env.API + "/comment/" + id
    : window.env.API + "/exercises";
  const {
    loading,
    error,
    hasMore,
    items: comments,
    setItems: setComments,
  } = useLoader(null, pageNumber, cookies.token, targetUrl);
  const lastCommentElementRef = useObserver(loading, hasMore, setPageNumber);
  const onClickCommentsButton = () => {
    setIsCommentOpen(!isCommentOpen);
  };
  const userNameText = () => {
    if (userName == cookies.user.username) return null;
    return <small className="ms-4 mt-3"> by {userName}</small>;
  };
  useEffect(() => {
    if (workoutChanged) {
      loadWorkout();
      setWorkoutChanged(false);
    }
  },  [workoutChanged]);
  useEffect(() => {
    setWorkoutChanged(false);
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token;
  }, []);
  useEffect(() => {
    if (currSetNum != -1) setIsVideoOpen(true);
  }, [currSetNum]);
  useEffect(() => {
    if (!isVideoOpen) setCurrSetNum(-1);
  }, [isVideoOpen]);
  function upload(File) {
    if (!File) return;
    const formData = new FormData();
    formData.append("video", File);
    axios
      .post(`${window.env.API}/SetVideo/${id}/${currSetNum}`, formData)
      .then((res) => {
        setCurrSetNum(-1);
        setIsVideoOpen(false);
        loadWorkout();
        setRefreshVideo(Date.now());
      })
      .catch(() => {
        setCurrSetNum(-1);
        setIsVideoOpen(false);
      });
  }
  function loadWorkout() {
    return new Promise((resolve) => {
      let index = -1;
      axios.get(window.env.API + "/workouts/" + id).then((res) => {
        setWorkout([
          ...res.data.exersets.map((exerSet) => {
            let newExerSet = exerSet;
            newExerSet.sets = newExerSet.sets.map((set) => {
              index++;
              return { ...set, index };
            });
            return {
              ...newExerSet,
              size: Math.min(3, exerSet.sets.length) * 50,
            };
          }),
        ]);

        resolve([
          res.data.title,
          res.data.public,
          res.data.username,
          res.data.date,
        ]);
      });
    });
  }
  useEffect(Start, []);
  function Start() {
    socket = io.connect(window.env.API);
    socket.emit("enter-room", id, cookies.token);
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token;
    loadWorkout()
      .then(([title, DataPublic, DataUsername, DataDate]) => {
        setTitle(title);
        setPublic(DataPublic);
        setUserName(DataUsername);
        setDate(new Date(DataDate));
        if (!socket) return;
        socket.on("chat-message", ({ user, message }) => {
          if (user.UserID != cookies.user.UserID) {
            setComments((prevComments) => [
              {
                Content: message,
                UserName: user.UserName,
                UserId: user.UserID,
                PostDate: new Date(),
              },
              ...prevComments,
            ]);
          }
        });
      })
      .catch((err) => {
        Navigate("/Home", {
          replace: true,
        });
      });
  }
  useEffect(() => {
    return () => {
      if (socket) socket.close();
    };
  }, []);
  function deleteWorkout() {
    axios
      .delete(window.env.API + "/workouts/" + id)
      .then((res) => Navigate("/Home", { replace: true }));
  }
  function publicToString() {
    if (isPublic) return <h3 class="text-info">public</h3>;
    return <h4 class="text-muted me-1">private</h4>;
  }
  return (
    <>
      <WorkoutHead
        props={{
          title,
          userNameText,
          date,
          publicToString,
          commentLogo,
          onClickCommentsButton,
          deleteWorkout,
          mine: userName == cookies.user.username,
        }}
      />
      <InputVideo
        isOpen={isVideoOpen}
        setIsOpen={setIsVideoOpen}
        upload={upload}
      />
      <div className="d-flex">
        <SetsView
          isCommentOpen={isCommentOpen}
          workout={workout}
          setCurrSetNum={setCurrSetNum}
          WorkoutId={id}
          token={cookies.token}
          isCreator={userName == cookies.user.username}
          refreshVideo={refreshVideo}
        />
        {isCommentOpen && (
          <span className="w-50">
            <Comments
              comments={comments}
              setComments={setComments}
              id={id}
              cookies={cookies}
              lastCommentElementRef={lastCommentElementRef}
            />
          </span>
        )}
      </div>
    </>
  );
}
