import React, { useState, useCallback } from "react";
import axios from "axios";
import Nurse from "../assets/images/Section.webp";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { LoginSocialFacebook } from "reactjs-social-login";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import PasswordInput from "../components/ui/PasswordInput";
import SignUpBanner from "../components/auth/SignUpBanner";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { instance } = useMsal();
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState();

  const onLoginStart = useCallback(() => {
    // Optional: Do something before Facebook login starts
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider("");
    navigate("/app");
  }, [navigate]);

  const handleAuthSuccess = (response) => {
    console.log("Authentication successful:", response);
    navigate("/app");
  };

  const handleAuthError = (error) => {
    console.error("Authentication failed:", error);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
            },
          }
        );
        console.log("User Info:", userInfo.data);
        navigate("/recruiter-dashboard");
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      setLoading(false);
    },
    scope: "email profile",
  });

  const handleMicrosoftLogin = async () => {
    try {
      const loginRequest = {
        scopes: ["user.read", "openid", "profile", "email"],
        prompt: "select_account",
        redirectUri: "http://localhost:3000",
      };

      const response = await instance.loginPopup(loginRequest);
      if (response) {
        console.log("Login successful", response);
        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: response.account,
        });
        handleAuthSuccess({
          token: tokenResponse.accessToken,
          user: response.account,
        });
      }
    } catch (error) {
      console.error("Login failed", error);
      if (error instanceof InteractionRequiredAuthError) {
        try {
          await instance.acquireTokenPopup({
            scopes: ["user.read", "openid", "profile", "email"],
          });
        } catch (err) {
          handleAuthError(err);
        }
      } else {
        handleAuthError(error);
      }
    }
  };

  return (
    <div className="flex max-lg:gap-10 gap-36 justify-end max-sm:block h-screen w-full bg-white">
      <div className="flex items-center justify-center max-sm:block">
        <div className="lg:min-w-[620px] sm:w-full max-sm:w-full p-8">
          <h2 className="text-3xl font-sora font-bold text-secondary max-lg:mt-10 max-sm:mt-[102px] mb-3">
            Get Started
          </h2>
          <p className="text-muted font-medium">
            Welcome to Lyncit AI - Let’s create your account
          </p>
          <div className="mt-8">
            <div className="mb-5">
              <label className="text-sm font-medium text-secondary">
                Company Email
              </label>
              <Input
                type="email"
                placeholder="Email ..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? "border-danger" : ""}
              />
            </div>
            <div className="mb-8">
              <label className="text-sm font-medium text-secondary">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="..."
                className={passwordError ? "border-danger" : ""}
              />
            </div>
            <Button
              className="w-full bg-primary text-white rounded-lg hover:bg-purple-700 mt-8"
            >
              Sign Up
            </Button>
          </div>
          <p className="mt-8 text-accent max-sm:text-center mb-8">
            Already have an account?
            <a
              href="/login"
              className="text-primary ml-1 underline underline-offset-2"
            >
              Login
            </a>
          </p>
          <SocialAuthButtons
            googleLogin={googleLogin}
            loading={loading}
            handleMicrosoftLogin={handleMicrosoftLogin}
            onLoginStart={onLoginStart}
            onLogoutSuccess={onLogoutSuccess}
            setProvider={setProvider}
            setProfile={setProfile}
            LoginSocialFacebook={LoginSocialFacebook}
          />
        </div>
      </div>
      <SignUpBanner Nurse={Nurse} />
    </div>
  );
}