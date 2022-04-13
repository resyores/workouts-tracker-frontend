import Set from "./SetRow";
import VideoView from "./VideoView";
import Card from "react-bootstrap/Card";
import { useState } from "react";
const SETS_VIEW_LENGTH = 3;
const styles = {
  position: "relative",
  overflow: "auto",
  borderRadius: "10px",
  width: "100%",
};
function ExerSet({ exerSet, setCurrSetNum, WorkoutId, token, isCreator, refreshVideo }) {
  let color = "bg-light-green";
  const [offset, setOffset] = useState(0);
  return (
    <Card className="ms-3" style={{ minWidth: "15rem", minHeight: "20rem" }}>
      <Card.Title className={color + " text-center rounded"}>
        {exerSet.exercise.exercisename}
      </Card.Title>
      <Card.Img
        variant="top"
        src={window.env.API + "/exercises/" + exerSet.exercise.exerciseid}
        height={110}
      />
      <Card.Body>
        {offset > 0 && (
          <pg
            className=" bi bi-chevron-up mb-0"
            onClick={() => {
              setOffset(offset - Math.min(SETS_VIEW_LENGTH, offset));
            }}
          />
        )}
        <Card.Text className={color + " mb-0"}>
          {exerSet.sets.map((set, index) => {
            if (index - offset >= 0 && index < offset + SETS_VIEW_LENGTH)
              return (
                <Set
                  setNum={index}
                  reps={set.reps}
                  weight={set.weight}
                  video={
                    Boolean(set.videoexist) && (
                      <VideoView
                        WorkoutId={WorkoutId}
                        index={set.index}
                        token={token}
                        refreshVideo={refreshVideo}
                      />
                    )
                  }
                  isCreator={isCreator}
                  openModal={() => {
                    setCurrSetNum(set.index);
                  }}
                />
              );
          })}
        </Card.Text>

        {exerSet.sets.length - offset > SETS_VIEW_LENGTH && (
          <p
            className=" bi bi-chevron-down mb-0"
            onClick={() => {
              setOffset(
                offset +
                  Math.min(
                    SETS_VIEW_LENGTH,
                    exerSet.sets.length - offset - SETS_VIEW_LENGTH
                  )
              );
            }}
          />
        )}
      </Card.Body>
    </Card>
  );
}
export default function SetsView({
  workout,
  setCurrSetNum,
  WorkoutId,
  token,
  isCreator,
}) {
  return (
    <div style={styles} className="d-flex flex-row">
      {workout.map((exerSet, exerIndex) => {
        return (
          <ExerSet
            exerSet={exerSet}
            setCurrSetNum={setCurrSetNum}
            WorkoutId={WorkoutId}
            token={token}
            isCreator={isCreator}
          />
        );
      })}
    </div>
  );
}
