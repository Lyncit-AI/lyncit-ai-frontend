import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://54.174.196.179:8080",
  realm: "master",
  clientId: "recruiter",
});

export default keycloak;
