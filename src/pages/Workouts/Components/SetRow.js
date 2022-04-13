import React, { useState } from "react";
import Modal from "../../../BaseComponents/Modal";
import Button from "react-bootstrap/Button";
export default function Set({
  reps,
  weight,
  video,
  openModal,
  isCreator,
  setNum,
}) {
  const [videoOpen, setVideoOpen] = useState(false);
  const toggleVideo = () => {
    setVideoOpen(!videoOpen);
  };
  return (
    <>
      <div className="rounded  d-flex justify-content-around  border border-secondary">
        <p>{setNum + 1}</p>
        <span className="d-flex">
          <h5 className="me-2 border border-dark">{weight} kg</h5>
          <p>X {reps} Reps</p>
        </span>
        <div className="d-flex">
          {isCreator && (
            <p onClick={openModal} className="bi-camera-reels-fill" />
          )}
          {video && <p onClick={toggleVideo} className="bi-file-play ms-2" />}
        </div>
      </div>
      <Modal open={videoOpen}>
        <div className="d-flex">
          <Button
            onClick={toggleVideo}
            className="rounded btn-sm mb-auto me-auto btn-light btn-outline-danger"
          >
            X
          </Button>
          {video}
        </div>
      </Modal>
    </>
  );
}
