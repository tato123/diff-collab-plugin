import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import jwtDecode from "jwt-decode";

const AuthCallback = ({ location, match }) => {
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");
    const idToken = params.get("id_token");
    const user = jwtDecode(idToken);
    console.log("Access Token", accessToken);
    console.log("ID Token", idToken);
    console.log("user", jwtDecode(idToken));

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("idToken", idToken);
    localStorage.setItem("user", JSON.stringify(user));

    // get a redirect
    const redirectTo = localStorage.getItem("redirectTo") || "/";
    localStorage.removeItem("redirectTo");
    setRedirectTo(redirectTo);
  }, [location.search]);

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  return <h1>callback received</h1>;
};

export default AuthCallback;
