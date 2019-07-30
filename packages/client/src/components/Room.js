import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Page from "./Page";
import Video from "./Video";
import { Button, Select } from "antd";
import Canvas from "./Canvas";
import Image from "./Image";
import useWindowSize from "../hooks/useWindowSize";
import { Icon } from "react-icons-kit";
import { pencil } from "react-icons-kit/fa/pencil";
import { mousePointer } from "react-icons-kit/fa/mousePointer";

const { Option } = Select;

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
  const [zoom, setZoom] = useState("75%");
  const [center, setCenter] = useState([0, 0]);
  const size = useWindowSize();

  const handleChange = change => {
    console.log(change);
    setZoom(change);
  };

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
            >
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
        <Video />
      </Container>
    </Page>
  );
};

export default Room;
