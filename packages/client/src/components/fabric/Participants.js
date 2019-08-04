import React, { useEffect, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { Avatar } from "antd";

import { SocketContext } from "../../hooks/useSocket";
import styled from "styled-components";

const ParticipantList = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 16px;
  right: 16px;

  .avatar {
    margin-right: 8px;
  }
`;

const Participants = ({ participants, myId }) => {
  const socket = useContext(SocketContext);
  const [el, setEl] = useState(null);
  const [actors, setActors] = useState({});

  useEffect(() => {
    if (socket) {
      socket.emit("get:participants");

      socket.on("participants", p => {
        console.log("participants", p);
        setActors(p);
      });
    }
  }, [socket]);

  useEffect(() => {
    const el = document.createElement("div");
    el.id = "participants";

    document.body.appendChild(el);
    setEl(el);
  }, []);

  if (el) {
    return ReactDOM.createPortal(
      <ParticipantList>
        {Object.keys(actors).map(key => (
          <div key={key}>
            <Avatar className="avatar" size={24} icon="user" />
          </div>
        ))}
      </ParticipantList>,
      el
    );
  }

  return null;
};

export default Participants;
