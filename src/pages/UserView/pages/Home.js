import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import useLoader from "../../../Hooks/useLoader";
import useObserver from "../../../Hooks/useObserver";
import WorkoutsView from "../Components/WorkoutsView";
import Toast from "react-bootstrap/Toast";
export default function Home({ workoutUpdated, setWorkoutUpdated }) {
  const [cookies, _] = useCookies(["user", "token"]);
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [show, setShow] = useState(false);
  const [toastData, setToastData] = useState({});
  let targetUrl = cookies.user
    ? window.env.API + "/user/" + cookies.user.UserID + "/workouts"
    : window.env.API + "/exercises";
  const {
    loading,
    error,
    hasMore,
    items: workouts,
    setItems: setWorkouts,
  } = useLoader("", pageNumber, cookies.token, targetUrl);
  const lastWorkoutElementRef = useObserver(loading, hasMore, setPageNumber);
  useEffect(() => {
    setWorkoutUpdated(null);
  }, []);
  useEffect(() => {
    if (workoutUpdated) {
      UpdateWorkout(workoutUpdated);
      setWorkoutUpdated(null);
    }
  }, [workoutUpdated]);
  function UpdateWorkout(workout) {
    setWorkouts((prevWorkouts) => {
      return [
        workout,
        ...prevWorkouts.filter(
          (currworkout) => currworkout.WorkoutId != workout.WorkoutId
        ),
      ];
    });
  }
  function handleSearch(event) {
    setQuery(event.target.value);
    setPageNumber(1);
  }
  function changeState(WorkoutId) {
    let isPublic = workouts.filter(
      (workout) => workout.WorkoutId == WorkoutId
    )[0].public;
    axios
      .patch(
        window.env.API +
          "/workouts/" +
          WorkoutId +
          "/changeState/" +
          Number(!isPublic)
      )
      .then((res) => {
        let temp = [...workouts];
        temp.filter((workout) => workout.WorkoutId == WorkoutId)[0].public =
          !isPublic;
        setWorkouts(temp);
      });
  }
  return (
    <>
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
      <WorkoutsView
        workouts={workouts}
        query={query}
        message={"You have no workouts"}
        lastWorkoutElementRef={lastWorkoutElementRef}
        handleSearch={handleSearch}
        changeState={changeState}
      />
    </>
  );
}
