import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Nurse from "../assets/images/Section.webp";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { LoginSocialFacebook } from "reactjs-social-login";
import Input from "../components/ui/Input";
import Checkbox from "../components/ui/Checkbox";
import Button from "../components/ui/Button";
import PasswordInput from "../components/ui/PasswordInput";
import SignUpBanner from "../components/auth/SignUpBanner";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";
import keycloak from "../keycloak";

export default function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { instance } = useMsal();
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState();

  const isValidEmail = (value) => {
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return pattern.test(value);
  };

  const handleSignIn = () => {
    const validEmail = email.trim() !== "" && isValidEmail(email);
    const validPassword = password.trim() !== "";

    setEmailError(!validEmail);
    setPasswordError(!validPassword);

    if (validEmail && validPassword) {
      // console.log("Sign In Successful!");
    }
  };

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
    // console.error("Authentication failed:", error);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        console.log("Access Token:", codeResponse.access_token);

        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`
            }
          }
        );

        console.log("User Info:", userInfo.data);

        // Navigate to /app with state containing accessToken and userInfo
        // This already has the right format with userInfo object
        navigate("/app", {
          state: {
            accessToken: codeResponse.access_token,
            userInfo: userInfo.data
          }
        });
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
    scope: "email profile"
  });

  const handleLogin = () => {
    const samlLoginUrl = `https://idp.lyncit.com:8443/realms/master/protocol/saml/SSO?client_id=recruiter&RelayState=${encodeURIComponent(
      "https://lyncit-ai-frontend.vercel.app/app"
    )}`;

    window.location.href = samlLoginUrl;
  };

  const handleMicrosoftLogin = async () => {
    try {
      const loginRequest = {
        scopes: ["user.read", "openid", "profile", "email"],
        prompt: "select_account",
        redirectUri: "http://localhost:3000"
      };

      const response = await instance.loginPopup(loginRequest);
      if (response) {
        console.log("Login successful", response);
        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: response.account
        });

        // Get user's profile picture from Microsoft Graph API
        let pictureUrl = null;
        try {
          const graphResponse = await axios.get(
            "https://graph.microsoft.com/v1.0/me/photo/$value",
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${tokenResponse.accessToken}`
              }
            }
          );

          if (graphResponse.status === 200) {
            const blob = graphResponse.data;
            pictureUrl = URL.createObjectURL(blob);
          }
        } catch (photoError) {
          console.log("Could not retrieve profile photo", photoError);
        }

        // Extract user info in a consistent format
        const userInfo = {
          name: response.account.name,
          email: response.account.username,
          picture: pictureUrl, // Use the retrieved photo or null if not available
          sub: response.account.localAccountId || response.account.homeAccountId
        };

        // Navigate to RecruiterDashboard with consistent data structure
        navigate("/app", {
          state: {
            accessToken: tokenResponse.accessToken,
            userInfo: userInfo
          }
        });
      }
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          await instance.acquireTokenPopup({
            scopes: ["user.read", "openid", "profile", "email"]
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
    <div className="flex max-lg:gap-10 max-xl:gap-10 gap-36 justify-end max-sm:block max-lg:min-h-full h-screen w-full bg-white min-ultra-wide:h-fit min-ultra-wide:w-[1440px] min-ultra-wide:mx-auto min-[2000px]:h-fit min-[2000px]:w-[1440px] min-[2000px]:mx-auto">
      <div className="flex items-center justify-center max-sm:block max-lg:h-full">
        <div className="lg:w-custom sm:w-full max-sm:w-full p-8">
          <h2 className="text-3xl font-sora font-bold text-secondary max-lg:mt-10 max-sm:mt-custom-sm">
            Welcome back
          </h2>
          <p className="text-muted font-medium">
            Welcome back! to <span className="text-primary">Lyncit AI</span>
          </p>
          <div className="mt-8">
            <div className="mb-5">
              <label className="text-sm font-medium text-secondary">
                Email
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
            <div className="flex items-center justify-between text-sm max-lg:text-xs">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-accent font-semibold">
                  Remember for 30 days
                </label>
              </div>
              <a
                href="/forget"
                className="text-primary font-semibold underline underline-offset-2"
              >
                Forgot Password?
              </a>
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-primary text-white rounded-lg mt-8"
            >
              Sign In
            </Button>
          </div>
          <div className="my-3 text-center text-xs text-accent">or</div>
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
          <p className="mt-8 text-accent max-sm:text-center">
            Don't have an account?
            <a
              href="/sign-up"
              className="text-primary ml-1 underline underline-offset-2"
            >
              Signup
            </a>
          </p>
        </div>
      </div>
      <SignUpBanner Nurse={Nurse} />
    </div>
  );
}
