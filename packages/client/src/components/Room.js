import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import Page from "./Page";
import Video from "./Video";
import { Button } from "antd";
import Canvas from "./fabric/Canvas";
import Image from "./fabric/Image";
import useWindowSize from "../hooks/useWindowSize";
import SocketProvider from "../hooks/useSocket";

import Participants from "./fabric/Participants";
import MouseActivityListener from "./fabric/MouseActivity";
import { useSync } from "../hooks/useToken";
import Tool from "./Tool";
import ActiveTool from "./fabric/tools";

const Container = styled.div`
  display: grid;
  grid-template-areas: ".";
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  height: 100%;
  width: 100%;
`;

const Stage = styled.div`
  background: #fafafa;
  overflow: hidden;
`;

const Toolbox = styled.div`
  height: 64px;
  position: absolute;
  padding: 8px 16px;
  display: block;
  top: 0px;
  width: 100vw;
  display: flex;
  justify-content: center;
`;

const Room = ({ match }) => {
  const roomId = match.params.id;
  const [media, setMedia] = useState();
  const [selectedMedia, setSelectedMedia] = useState();
  const [zoom, setZoom] = useState(0.75);
  const [center, setCenter] = useState([0, 0]);
  const [activeTool, setActiveTool] = useState("select");
  const size = useWindowSize();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER}/room/${roomId}/media`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(media => {
        const xMin = media.reduce((acc, m) => Math.min(acc, m.x), 0);
        const xMax = media.reduce((acc, m) => Math.max(acc, m.x), 0);
        const yMin = media.reduce((acc, m) => Math.min(acc, m.y), 0);
        const yMax = media.reduce((acc, m) => Math.max(acc, m.y), 0);

        const centerX = (xMin + xMax) / 2;
        const centerY = (yMin + yMax) / 2;
        setCenter([-centerX, -centerY]);
        setMedia(media);
        setSelectedMedia(media);
      })
      .catch(err => {
        console.error(err);
      });
  }, [roomId]);

  return (
    <Page>
      <SocketProvider namespace={`room-${roomId}`}>
        <Container>
          <Stage>
            <div>
              <Canvas
                width={size.width}
                height={size.height}
                center={center}
                drawingMode
                onZoom={setZoom}
              >
                <ActiveTool tool={activeTool} />
                <MouseActivityListener />
                <Participants />
                {selectedMedia &&
                  selectedMedia.map((media, idx) => (
                    <Image
                      selectable={false}
                      key={idx}
                      url={media.url}
                      left={parseInt(media.x)}
                      top={parseInt(media.y)}
                    />
                  ))}
              </Canvas>
            </div>
          </Stage>
          <Toolbox>
            <Tool
              type="select"
              active={activeTool === "select"}
              action={() => setActiveTool("select")}
            />
            <Tool
              type="pencil"
              active={activeTool === "pencil"}
              action={() => setActiveTool("pencil")}
            />
            <Tool
              type="text"
              active={activeTool === "text"}
              action={() => setActiveTool("text")}
            />
          </Toolbox>
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              background: "#fff",
              boxShadow:
                "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
              padding: 8,
              borderRadius: 8
            }}
          >
            <label>{Math.round(100 * zoom)}%</label>
          </div>
          {/* <Video /> */}
        </Container>
      </SocketProvider>
    </Page>
  );
};

export default Room;
