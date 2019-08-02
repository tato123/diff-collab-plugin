import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import Page from "./Page";
import Video from "./Video";
import { Button } from "antd";
import Canvas from "./Canvas";
import Image from "./Image";
import useWindowSize from "../hooks/useWindowSize";
import { Icon } from "react-icons-kit";
import { pencil } from "react-icons-kit/fa/pencil";
import { mousePointer } from "react-icons-kit/fa/mousePointer";
import Participants from "./Participants";
import { useSync } from "../hooks/useToken";

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
  const syncClient = useSync();
  const [p, setP] = useState({});
  const [myId, setMyId] = useState();

  const size = useWindowSize();

  useEffect(() => {
    if (roomId && syncClient) {
      syncClient
        .map(`${roomId}_p`)
        .then(map => {
          const p = Math.floor(Math.random() * 1000) + "_person";
          setMyId(p)

          map.set(p, { lastSeen: Date.now() });

          map.on("itemUpdated", event => {
            console.log("Received itemUpdated event: ", event);
            const { key, value, isLocal } = event.item;
            setP(pa => ({
              ...pa,
              [key]: value
            }));
          });

          map.on("itemAdded", event => {
            console.log("Received itemAdded event: ", event);
            const { key, value, isLocal } = event.item;
            setP(pa => ({
              ...pa,
              [key]: value
            }));
          });
        })
        .catch(function(error) {
          console.log("Unexpected error", error);
        });
    }
  }, [roomId, syncClient]);

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
              <Participants participants={p} myId={myId}/>
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
          <Button
            shape="circle"
            style={{ width: 48, height: 48, marginRight: 8 }}
          >
            <Icon
              icon={mousePointer}
              size={16}
              style={{ position: "absolute", top: "21%", left: "38%" }}
            />
          </Button>
          <Button shape="circle" style={{ width: 48, height: 48 }}>
            <Icon
              icon={pencil}
              size={17}
              style={{ position: "absolute", top: "21%", left: "34%" }}
            />
          </Button>
        </Toolbox>
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            background: "#fff",
            boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
            padding: 8,
            borderRadius: 8
          }}
        >
          <label>{Math.round(100 * zoom)}%</label>
        </div>
        {/* <Video /> */}
      </Container>
    </Page>
  );
};

export default Room;
