import React from "react";
import Button from "react-bootstrap/esm/Button";
import FormatDate from "../../../utils/FormatDate";
export default function WorkoutHead({ props }) {
  return (
    <div class=" bg-light border border-dark">
      <div className="w-75 d-flex justify-content-between">
        {props.mine ? (
          <Button
            onClick={props.deleteWorkout}
            className="btn-danger h-50 justify-content-center"
          >
            Delete
          </Button>
        ):<p/>}
        <span>
          <span className="d-flex">
            <h3>{props.title + "  "}</h3>
            {props.userNameText()}
          </span>
          <p className="text-primary">{FormatDate(props.date)}</p>
        </span>
        <div>
          {props.publicToString()}
          <img
            className="mt-3 me-0"
            src={props.commentLogo}
            width={30}
            height={30}
            onClick={props.onClickCommentsButton}
          />
        </div>
      </div>
    </div>
  );
}
