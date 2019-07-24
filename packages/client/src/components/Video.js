import React, { useEffect, useState, useRef } from "react";
import Video, {
  LocalDataTrack,
  connect,
  createLocalTracks
} from "twilio-video";
import styled from "styled-components";
import { Avatar } from "antd";

const Container = styled.div`
  border-left: 1px solid #ccc;
  height: 100%;
  width: inherit;

  video {
    width: inherit;
    height: inherit;
  }

  .track-container {
    width: 100%;
    height: 100%;
    padding: 4px 20px;
  }

  .avatar {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
  }
`;

const Participants = styled.div`
  position: absolute;
  right: 16px;
  display: flex;
  flex: 1 auto;
  top: 16px;

  > .ant-avatar {
    margin-right: 4px;
    display: block;
  }
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 auto;
`;

function getToken(identity) {
  return fetch(`${process.env.REACT_APP_API_SERVER}/twilio/token`).then(res => {
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  });
}

async function setupLocalAudioAndVideoTracks(video) {
  const audioAndVideoTrack = await createLocalTracks({
    audio: true,
    video: false
  });
  audioAndVideoTrack.forEach(track => track.attach(video));
  return audioAndVideoTrack;
}

const useRoomConnection = roomJoined => {
  const [token, setToken] = useState();
  const [localAudioVideoTracks, setLocalAudioVideoTracks] = useState();

  useEffect(() => {
    getToken()
      .then(data => {
        console.log("token data", data);
        setToken(data.token);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (token) {
      console.log("connecting with token", token);

      setupLocalAudioAndVideoTracks()
        .then(tracks =>
          connect(
            token,
            { name: "room-name", tracks }
          )
        )
        .then(roomJoined)
        .catch(err => {
          console.error("Error occured connecting to room", err);
        });
    }
  }, [token]);

  return [localAudioVideoTracks];
};

const VideoComponent = ({ roomName }) => {
  const [room, setRoom] = useState();
  const [participants, setPartipants] = useState([]);
  const localMedia = useRef(null);
  const trackList = useRef(null);

  const participantConnected = participant => {
    setPartipants(s => [...s, participant]);

    console.log('Participant "%s" connected', participant.identity);
    const div = document.createElement("div");
    div.id = participant.sid;
    div.classList.add("track-container");

    participant.on("trackSubscribed", track => trackSubscribed(div, track));
    participant.tracks.forEach(track => trackSubscribed(div, track));
    participant.on("trackUnsubscribed", trackUnsubscribed);

    trackList.current.appendChild(div);
  };

  const participantDisconnected = participant => {
    console.log('Participant "%s" disconnected', participant.identity);

    participant.tracks.forEach(trackUnsubscribed);
    document.getElementById(participant.sid).remove();
  };

  const trackSubscribed = (div, track) => {
    div.appendChild(track.attach());
  };

  const trackUnsubscribed = track => {
    track.detach().forEach(element => element.remove());
  };

  const disableVideo = () => {
    const participant = room.localParticipant;
    participant.tracks.values();
    var tracks = Array.from(participant.tracks.values());
    tracks.forEach(track => {
      track.disable();
    });
  };

  const enableVideo = () => {
    const participant = room.localParticipant;
    participant.tracks.values();
    var tracks = Array.from(participant.tracks.values());
    tracks.forEach(track => {
      track.enable();
    });
  };

  const attachTracks = (tracks, container) => {
    console.log("Attaching track");
    tracks.forEach(track => {
      container.current.appendChild(track.attach());
    });
  };
  const attachParticipantTracks = (participant, container) => {
    console.log("Attaching participant tracks");
    var tracks = Array.from(participant.tracks.values());
    attachTracks(tracks, container);
  };

  useRoomConnection(room => {
    setRoom(room);

    console.log(localMedia);
    // attachParticipantTracks(room.localParticipant, localMedia);

    setPartipants(p => [...p, room.localParticipant]);

    console.log('Connected to Room with with name, "%s"', room.name);
    room.participants.forEach(participantConnected);

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.once("disconnected", error =>
      room.participants.forEach(participantDisconnected)
    );
  });

  return (
    <Container>
      <TrackList ref={trackList}>
        <div className="track-container" ref={localMedia} id="local-media" />
      </TrackList>
      <Participants>
        {participants.map(p => (
          <Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
            U
          </Avatar>
        ))}
      </Participants>
    </Container>
  );
};

export default VideoComponent;
