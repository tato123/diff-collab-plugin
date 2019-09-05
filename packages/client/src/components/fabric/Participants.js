import React, { useEffect, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { Avatar, Tooltip } from "antd";
import _ from "lodash";

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
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.emit("get:participants");

      // save our id if alreayd available
      if (socket.id) {
        setSocketId(socket.id);
      }

      // otherwise wait for a connection
      socket.on("connect", () => {
        console.log("socketid", socket.id);
        setSocketId(socket.id);
      });

      socket.on("participants", p => {
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

  const OrderedActorKeys = actors => {
    return _.sortBy(actors, actor => {
      return actor.socketId === socketId ? 0 : 1;
    });
  };

  if (el) {
    return ReactDOM.createPortal(
      <ParticipantList>
        {OrderedActorKeys(actors).map(actor => (
          <div key={actor.socketId}>
            <Tooltip title={actor.email} placement="bottom">
              <Avatar
                className="avatar"
                size="large"
                src={actor.picture}
              />
            </Tooltip>
          </div>
        ))}
      </ParticipantList>,
      el
    );
  }

  return null;
};

export default Participants;
