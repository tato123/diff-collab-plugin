import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocket = nsp => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const s = io(`http://localhost:8001/${nsp}`);
    setSocket(s);
  }, [nsp]);

  return socket;
};

export default useSocket;
