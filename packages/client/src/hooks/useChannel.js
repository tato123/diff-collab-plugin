import React, { useEffect, useState, useContext } from "react";
import Pusher from "pusher-js";

const pusher = new Pusher("91a64093ff1be24f878a", {
  cluster: "us2",
  forceTLS: true,
  authEndpoint: "http://localhost:8001/pusher/auth"
});

Pusher.logToConsole = true;

export const PusherContext = React.createContext(pusher);

export const useChannel = channelName => {
  const [channel, setChannel] = useState();

  useEffect(() => {
    const myChannel = pusher.subscribe(channelName);
    setChannel(myChannel);
  }, [channelName]);

  return channel;
};
