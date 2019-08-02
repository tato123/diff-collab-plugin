import React, { useEffect, useState, useContext } from "react";
import SyncClient from "twilio-sync";

export const TwilioContext = React.createContext();

export const TwilioProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const getToken = identity => {
    return fetch(`${process.env.REACT_APP_API_SERVER}/twilio/token`).then(
      res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      }
    );
  };

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

  return (
    <TwilioContext.Provider value={token}>{children}</TwilioContext.Provider>
  );
};

export const useSync = () => {
  const token = useContext(TwilioContext);
  const [sC, setSC] = useState();

  useEffect(() => {
    if (token) {
      const syncClient = new SyncClient(token);
      setSC(syncClient);
    }
  }, [token]);

  return sC;
};

export const useStream = name => {
  const syncClient = useSync();
  const [stream, setStream] = useState();

  useEffect(() => {
    if (syncClient) {
      syncClient.stream(name).then(stream => {
        setStream(stream);
      });
    }
  }, [name, syncClient]);

  return stream;
};
