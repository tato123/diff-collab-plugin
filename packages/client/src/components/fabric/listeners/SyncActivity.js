import React, { useEffect, useContext, useState, useCallback } from "react";
import _ from "lodash";
import { Button } from "antd";
import styled from "styled-components";

import { CanvasContext } from "../Canvas";
import { SocketContext } from "../../../hooks/useSocket";
import { fabric } from "fabric";

const DebugSyncState = styled(Button)`
  position: fixed;
  z-index: 20;
  top: 32px;
  left: 5px;
`;

const Participants = ({ participants, myId }) => {
  const socket = useContext(SocketContext);
  const canvas = useContext(CanvasContext);

  const cb = useCallback(() => {
    socket.emit("get:synced");
  }, [socket]);

  useEffect(() => {
    if (socket && canvas) {
      socket.emit("get:synced");

      socket.on("synced", data => {
        console.log("retrieved synced state", data);
        const syncObject = _.valuesIn(data).map(x => x.o);
        fabric.util.enlivenObjects(syncObject, objects => {
          objects.forEach(function(o) {
            canvas.add(o);
          });
        });
      });

      const randomHash = () => {
        return Math.floor(Math.random() * 10000000);
      };

      const syncEvents = e => {
        const target = _.get(e, "target") || _.get(e, "path");

        if (target.id === undefined) {
          e.target.set("id", randomHash());
        }

        if (_.has(target, "sync") && target.sync === false) {
          return;
        }

        const data = target.toJSON(["id"]);
        console.log("Syncing data", data);
        socket.emit("sync:activity", {
          t: "sync",
          o: data
        });
      };

      canvas.on("object:added", syncEvents);
      canvas.on("object:modified", syncEvents);
      canvas.on("object:moving", syncEvents);
      canvas.on("object:removed", syncEvents);
      // canvas.on("path:created", syncEvents);
    }
  }, [socket, canvas]);

  return <DebugSyncState onClick={cb}>Debug Sync</DebugSyncState>;
};

export default Participants;
