import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://dp.lyncit.com:8843",
  realm: "master",
  clientId: "recruiter",
});

export default keycloak;
