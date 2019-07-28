import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Page from "./Page";
import Video from "./Video";
import Paper from "./Paper";
import { Button, Select } from "antd";
import Canvas from "./Canvas";
import Image from "./Image";

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
  overflow: auto;
`;

const Toolbox = styled.div`
  height: 32px;
  background: #fff;
  border: 1px solid #eee;
  position: absolute;
  margin: 0 auto;
  bottom: 16px;
  right: 64px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 4px 16px;
  display: block;
  box-sizing: content-box;
`;

const Room = ({ match }) => {
  const roomId = match.params.id;
  const [media, setMedia] = useState();
  const [selectedMedia, setSelectedMedia] = useState();
  const [zoom, setZoom] = useState("75%");

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
        console.log("media is", media);
        setMedia(media);

        const urls = media.map(x => x.url);
        setSelectedMedia(urls);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <Page>
      <Container>
        <Stage>
          {/* <Paper images={selectedMedia} zoom={zoom} /> */}

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {selectedMedia &&
              selectedMedia.map(src => (
                <div
                  key={src}
                  style={{ width: "200px", height: 200, padding: 16 }}
                >
                  {/* <img
                    style={{ width: "100%", height: "auto" }}
                    src={src}
                    alt="thumbnail"
                  /> */}
                  <Canvas width={200} height={200}>
                    <Image url={src} scale={0.2} />
                  </Canvas>
                </div>
              ))}
          </div>
        </Stage>
        <Toolbox>
          <Button>Select</Button>
          <Button>Draw</Button>
          <Button>Rect</Button>

          <Select
            defaultValue="75%"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="100%">100%</Option>
            <Option value="75%">75%</Option>
            <Option value="50%">50%</Option>
            <Option value="25%">25%</Option>
          </Select>
        </Toolbox>
        <Video />
      </Container>
    </Page>
  );
};

export default Room;
