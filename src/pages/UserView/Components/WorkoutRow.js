import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FormatDate from "../../../utils/FormatDate";
export default function Workout({ workout, mine, changeState }) {
  function publicToString(isPublic) {
    if (isPublic) return <p class="text-info">public</p>;
    return <p class="text-muted">private</p>;
  }
  function publicToChangeString(isPublic) {
    if (isPublic) return "UnShare";
    return "Share";
  }

  function changeThis() {
    changeState(workout.WorkoutId);
  }

  const ShareButton = () => {
    return (
      <Button
        size="lg"
        onClick={changeThis}
        className="rounded btn-sm  btn-success btn-sml w-50"
      >
        {publicToChangeString(workout.public)}
      </Button>
    );
  };
  return (
    <div className="d-flex ms-4">
      <Card className="text-center" style={{ width: 200 }}>
        <a
          href={"/workouts/" + workout.WorkoutId}
          className="text-decoration-none text-dark mt-2 "
          aria-current="false"
        >
          <Card.Title>
            <div className="d-flex justify-content-center">
              <span className="me-1">{workout.Title}</span>
              {mine && workout.unseen > 0 && (
                <div>
                  <small className="rounded-circle bg-light-green px-2 text-primary">
                    {workout.unseen}
                  </small>
                </div>
              )}
            </div>
          </Card.Title>
          <Card.Body>
            <Card.Text>{publicToString(workout.public)}</Card.Text>
          </Card.Body>
        </a>
        <Card.Footer className="text-muted d-flex flex-column">
          {FormatDate(workout.WorkoutDate)}
          <span className="d-flex justify-content-center mt-2">
            {mine && <ShareButton />}
          </span>
        </Card.Footer>
      </Card>
    </div>
  );
}
