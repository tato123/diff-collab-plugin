import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";

export const SocketContext = React.createContext();

const SocketProvider = ({ namespace, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const url = namespace
      ? `${process.env.REACT_APP_API_SERVER}/${namespace}`
      : `${process.env.REACT_APP_API_SERVER}`;
    const s = io(url);
    setSocket(s);
  }, [namespace]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
