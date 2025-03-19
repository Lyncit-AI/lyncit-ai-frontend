import React, { useState, useCallback, useEffect } from "react";
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

  // Base URL for proxy based on environment
  const proxyBaseUrl = process.env.NODE_ENV === "development" ? "/api" : "/api";

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/app");
    }
  }, [navigate]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      console.log(
        "Fetching token from:",
        `${proxyBaseUrl}/authentication/token`
      );
      const tokenResponse = await axios.post(
        `${proxyBaseUrl}/authentication/token`,
        new URLSearchParams({
          grant_type: "",
          username: "jsmith", // Use form input
          password: "password", // Use form input
          scope: "",
          client_id: "",
          client_secret: ""
        }),
        {
          headers: {
            "accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;
      localStorage.setItem("accessToken", accessToken);

      const userResponse = await axios.get(
        `${proxyBaseUrl}/user/read?username=${email}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const userData = userResponse.data[0];
      if (!userData) {
        throw new Error("User not found");
      }

      const userInfo = {
        name: userData.userName,
        email: userData.email,
        picture: null,
        sub: userData.id
      };

      navigate("/app", {
        state: {
          accessToken: accessToken,
          userInfo: userInfo
        }
      });
    } catch (error) {
      console.error("Authentication failed:", error);
      setEmailError(true);
      setPasswordError(true);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  const onLoginStart = useCallback(() => {}, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider("");
    localStorage.removeItem("accessToken");
    navigate("/app");
  }, [navigate]);

  const handleAuthError = (error) => {};

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        const accessToken = codeResponse.access_token;
        localStorage.setItem("accessToken", accessToken);

        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        navigate("/app", {
          state: {
            accessToken: accessToken,
            userInfo: userInfo.data
          }
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
        localStorage.removeItem("accessToken");
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

  const handleMicrosoftLogin = async () => {
    try {
      const redirectUri =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://lyncit-ai-frontend.vercel.app";

      const loginRequest = {
        scopes: ["user.read", "openid", "profile", "email"],
        prompt: "select_account",
        redirectUri: redirectUri
      };

      const response = await instance.loginPopup(loginRequest);
      if (response) {
        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: response.account
        });

        const accessToken = tokenResponse.accessToken;
        localStorage.setItem("accessToken", accessToken);

        let pictureUrl = null;
        try {
          const graphResponse = await axios.get(
            "https://graph.microsoft.com/v1.0/me/photo/$value",
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${accessToken}`
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

        const userInfo = {
          name: response.account.name,
          email: response.account.username,
          picture: pictureUrl,
          sub: response.account.localAccountId || response.account.homeAccountId
        };

        navigate("/app", {
          state: {
            accessToken: accessToken,
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
        localStorage.removeItem("accessToken");
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
              onClick={handleSignIn}
              className="w-full bg-primary text-white rounded-lg mt-8"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
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
