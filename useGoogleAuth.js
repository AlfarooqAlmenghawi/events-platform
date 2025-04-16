import { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID =
  "327814106325-vfsjfg49508c930r09n2djv2mvstk5bu.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export const useGoogleAuth = () => {
  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    };
    gapi.load("client:auth2", start);
  }, []);
};
