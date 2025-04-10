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
import Checkbox from "../components/ui/Checkbox";
import SignUpBanner from "../components/auth/SignUpBanner";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";

export default function Login() {
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
        navigate("/app");
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
    <div className="flex max-lg:gap-10 max-xl:gap-10 gap-36 justify-end max-sm:block max-lg:min-h-full h-screen w-full bg-white min-ultra-wide:h-fit min-ultra-wide:w-[1440px] min-ultra-wide:mx-auto min-[2000px]:h-fit min-[2000px]:w-[1440px] min-[2000px]:mx-auto">
      <div className="flex items-center justify-center max-sm:block max-lg:h-full">
        <div className="lg:w-custom sm:w-full max-sm:w-full p-8">
          <h2 className="text-3xl font-bold text-secondary max-lg:mt-10 max-sm:mt-custom-sm mb-8">
            Sign in to Lyncit AI
          </h2>
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
            <Button className="w-full bg-primary text-white rounded-lg mt-8">
              Sign in
            </Button>
          </div>
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
      Okay you must be busy but just wanna say I loved the audacity of sitting in Islamabad and ordering about percentage and insecurities for text. Yes we all are accountable to you Sir Haris Afzal. We are. Like you make us realise that we are roaming out with friends, get family problems serious enough that when you ask me or Hassan bahi we don’t even tell. 

Brother for what favor are you asking percentage to Hassan bahi? Even I don’t. Percentage is given on basis of what value you are bringing to Appifyo. Have you ever came 1 second earlier or went 1 second late because of work? Secondly do you think you have been burdenize with hectic work and we all are chilling except you. The answer is NO. It’s other way around. By doing bare minimum and expecting that you will be paid 2lakh and we are just fucking around. The world does not work like that unfortunately. Percentage is given on basis of stress your colleague is reducing not increasing. I’d been fucking working for 16 hours in Stellar stack and was paid 2 lakh + monthly because I’ve solely handling the entire project including work communication and every other updates in my fucking waking hours despite family problems and friends stuff and bring 5+ lakh to the company for remaining fellows working on three projects and so was Shahbaz despite being abused if we get 1 second late and most often been working on weekends too.


    No tell me have you ever worked on any weekend. No
 did you worked more than 1 hour dediciated in last month. No
 do you consider building a product serious enough. Answer is NO. Doing bare minimum and what is told only.
 Do you think the work you did for one project or two project is enough to be paid more than what you have been paid. Answer is No. If we exclude the James Delay it becomes barely 1 hour work. UI was developed by Zarrar when you were away for week.
 






      <SignUpBanner Nurse={Nurse} />
    </div>
  );
}
