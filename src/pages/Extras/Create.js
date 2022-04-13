import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Field from "../../BaseComponents/Field";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
const styles = {
  position: "relative",
  overflow: "auto",
  borderRadius: "10px",
  width: "100%",
};
const SmallInput = ({ onChange, placeholder, last, value }) => {
  return (
    <input
      type="number"
      min="0"
      class=" bg-transparent form-control rounded-0 text-center p-0"
      style={{
        border: 0,
        borderBottom: "1px solid " + (last ? "#c5c5c5" : "#0000FF"),
        width: "4rem",
        MozAppearance: "textfield",
      }}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};
export default function Create() {
  const Navigate = useNavigate();
  const [cookies, _] = useCookies(["user", "token"]);
  let exercises = [];
  const [options, setOptions] = useState([]);
  const [workout, setWorkout] = useState([
    { exerciseid: -1, sets: [{ reps: "", weight: "" }] },
  ]);
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  useEffect(Start, []);

  function chooseExercise(index, value) {
    let temp = [...workout];
    temp[index].exerciseid = value;
    setWorkout(temp);
  }
  function Start() {
    axios.defaults.headers.common["authorization"] = "bearer " + cookies.token;
    axios.get(window.env.API + "/exercises").then((res) => {
      exercises = res.data;
      setOptions(
        exercises.map((exer) => {
          return { value: exer.ExerciseId, label: exer.ExerciseName };
        })
      );
    });
  }
  function addExer() {
    setWorkout([
      ...workout,
      { exerciseid: -1, sets: [{ reps: "", weight: "" }] },
    ]);
  }
  function addSet(index) {
    let temp = [...workout];
    temp[index].sets.push({ reps: "", weight: "" });
    setWorkout(temp);
  }
  function setSetVal(exerIndex, setIndex, valueName, value) {
    let temp = [...workout];
    temp[exerIndex].sets[setIndex][valueName] = value;
    setWorkout(temp);
  }
  function publicToString() {
    return isPublic ? (
      <h3 class="text-info">public</h3>
    ) : (
      <h3 class="text-muted">private</h3>
    );
  }
  function Create() {
    if (!title) return alert("Workout must have title");
    let finalWorkout = [...workout];
    let setExist = false;
    finalWorkout.forEach((exerset, exerIndex) => {
      if (exerset.exerciseid == -1) return finalWorkout.splice(exerIndex, 1);

      exerset.sets.forEach((set, setIndex) => {
        if (setIndex != exerset.sets.length - 1) {
          if (set.reps == "" || set.weight == "")
            exerset.sets.splice(setIndex, 1);
          else setExist = true;
        }
      });
    });
    if (!setExist) return alert("Workout can't be empty");
    axios
      .post(window.env.API + "/workouts/add", {
        exersets: finalWorkout.map((exerSet) => {
          return {
            exerciseid: exerSet.exerciseid,
            sets: exerSet.sets.slice(0, -1),
          };
        }),
        public: isPublic,
        title,
      })
      .then((res) => {
        Navigate("/Home", { replace: true });
      });
  }
  function removeExerSet(index) {
    let temp = [...workout];
    temp.splice(index, 1);
    setWorkout(temp);
  }
  function removeSet(index1, index2) {
    let temp = [...workout];
    temp[index1].sets.splice(index2, 1);
    setWorkout(temp);
  }
  return (
    <>
      <div className="d-flex mb-3 ms-3">
        <Field Name="Title" setter={setTitle} placeholder="Workout Title" />
        <span
          onClick={() => {
            setIsPublic(!isPublic);
          }}
          className="ms-3"
        >
          {publicToString(isPublic)}
        </span>
      </div>
      <div className="d-flex align-items-center" style={styles}>
        {workout.map((exerSet, exerIndex) => {
          return (
            <Card
              className="ms-3 bg-light-green"
              style={{ minWidth: "15rem", minHeight: "20rem" }}
            >
              <Card.Title className="text-center rounded d-flex">
                {workout.length > 1 && (
                  <p
                    className="bi bi-trash3"
                    onClick={() => {
                      removeExerSet(exerIndex);
                    }}
                  />
                )}
                <Form.Select
                  value={exerSet.exerciseid}
                  onChange={(e) => {
                    chooseExercise(exerIndex, e.target.value);
                  }}
                >
                  {exerSet.exerciseid == -1 && (
                    <option>Open this select menu</option>
                  )}
                  {options.map((option) => {
                    return <option value={option.value}>{option.label}</option>;
                  })}
                </Form.Select>
              </Card.Title>
              {exerSet.exerciseid != -1 && (
                <Card.Img
                  variant="top"
                  src={window.env.API + "/exercises/" + exerSet.exerciseid}
                  height={110}
                />
              )}
              <Card.Body>
                <Card.Text>
                  {exerSet.sets.map((set, index) => {
                    const last = index == exerSet.sets.length - 1;
                    return (
                      <div
                        className="d-flex justify-content-center px-2"
                        onClick={
                          last
                            ? () => {
                                addSet(exerIndex);
                              }
                            : () => {}
                        }
                      >
                        <SmallInput
                          onChange={(e) => {
                            setSetVal(
                              exerIndex,
                              index,
                              "weight",
                              e.target.value
                            );
                          }}
                          placeholder="weight"
                          last={last}
                          value={set.weight}
                        />
                        {last ? (
                          <span className="text-muted">x</span>
                        ) : (
                          <span>x</span>
                        )}
                        <SmallInput
                          onChange={(e) => {
                            setSetVal(exerIndex, index, "reps", e.target.value);
                          }}
                          value={set.reps}
                          placeholder="reps"
                          last={last}
                        />

                        {!last && (
                          <Button
                            className="bg-transparent btn-outline-light text-danger py-0 px-1 ms-3"
                            onClick={() => {
                              removeSet(exerIndex, index);
                            }}
                          >
                            -
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </Card.Text>
              </Card.Body>
            </Card>
          );
        })}
        <div className="d-flex flex-column">
          <Button
            className="btn-light btn-outline-success h-25 "
            onClick={addExer}
          >
            Add Exercise
          </Button>
          <Button
            className="
            btn-success"
            onClick={Create}
          >
            Create
          </Button>
        </div>
      </div>
    </>
  );
}
