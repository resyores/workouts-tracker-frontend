import SearchDiv from "./SearchDiv";
import Workout from "./WorkoutRow";
const styles = {
  position: "relative",
  overflow: "auto",
  borderRadius: "10px",
  width: "90%",
};
export default function WorkoutsView({
  workouts,
  query,
  message,
  lastWorkoutElementRef,
  handleSearch,
  changeState,
}) {
  const mine = changeState ? true : false;
  if (workouts.length || query.length)
    return (
      <div className="d-flex justify-content-center pt-5">
        <div className="w-75">
          <div className="d-flex" style={styles}>
            {workouts.map((workout, index) => {
              if (workouts.length - 1 == index)
                return (
                  <span ref={lastWorkoutElementRef}>
                    <Workout
                      workout={workout}
                      mine={mine}
                      changeState={changeState}
                    />
                  </span>
                );
              return (
                <Workout
                  workout={workout}
                  mine={mine}
                  changeState={changeState}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  return <h2 className="text-muted text-center mt-4">{message}</h2>;
}
