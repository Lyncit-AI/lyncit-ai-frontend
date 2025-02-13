import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://idp.lyncit.com:8443",
  realm: "master",
  clientId: "recruiter",
});

export default keycloak;
