import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyPicture from "../../../logos/profile.jpg";
import messagePicture from "../../../logos/message.png";
export default function Workout({ friend, clickable, isNotFriend }) {
  const Navigate = useNavigate();
  const ProfileUrl = `${window.env.API}/user/${friend.UserId}/profile`;
  const [imageUrl, setImageUrl] = useState(ProfileUrl);
  const toPage = () => {
    Navigate("/friends/" + friend.UserId, { replace: true });
  };
  return (
    <div
      className=
        "d-flex list-group-item w-100 rounded mt-2 bg-light-green "
      
      onClick={clickable && toPage}
    >
      <img
        width={60}
        height={60}
        className="rounded-circle"
        src={imageUrl}
        onError={() => setImageUrl(EmptyPicture)}
      />
      <div className="d-flex justify-content-between mx-5">
        <h4 className="mx-4">{friend.UserName}</h4>
        <p>{friend.Email}</p>
      </div>
      <div className="ms-auto me-0">
        {!clickable && !isNotFriend && (
          <a href={"/messages/" + friend.UserId}>
            <img width={60} height={60} src={messagePicture} />
          </a>
        )}
      </div>
    </div>
  );
}
