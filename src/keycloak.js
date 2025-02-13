import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://idp.lyncit.com:8443",
  realm: "master",
  clientId: "recruiter",
});

export const initKeycloak = () =>
  keycloak
    .init({
      onLoad: "check-sso", // Does not force login, only checks session
      checkLoginIframe: false, // Avoid iframe timeout issues
      redirectUri: "https://lyncit-ai-frontend.vercel.app/app",
    })
    .then((authenticated) => {
      if (authenticated) {
        console.log("User is authenticated:", keycloak.token);
      } else {
        console.log("User is not authenticated");
      }
    })
    .catch((err) => console.error("Keycloak Initialization Failed:", err));

export default keycloak;
