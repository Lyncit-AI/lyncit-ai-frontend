import React, { useState } from "react";
import axios from "axios";
import Nurse from "../assets/images/Section.webp";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import PasswordInput from "../components/ui/PasswordInput";
import SignUpBanner from "../components/auth/SignUpBanner";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Base URL for proxy based on environment
  const proxyBaseUrl = "https://lyncitapplications.xyz:8086";

  const handleSignUp = async () => {
    setLoading(true);
    setUserNameError(false);
    setEmailError(false);
    setPasswordError(false);

    try {
      const tokenResponse = await axios.post(
        `${proxyBaseUrl}/authentication/token`,
        new URLSearchParams({
          grant_type: "",
          username: "jsmith",
          password: "password",
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

      const userCheckResponse = await axios.get(
        `${proxyBaseUrl}/user/read?username=${userName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (Array.isArray(userCheckResponse.data) && userCheckResponse.data.length > 0) {
        setUserNameError(true);
        throw new Error("Username already exists");
      }

      const userData = {
        activeFrom: new Date().toISOString().split('T')[0],
        activeTo: null,
        authType: "internal",
        created: {
          By: "system",
          Timestamp: new Date().toISOString()
        },
        email: email,
        firstName: firstName,
        id: crypto.randomUUID(),
        lastName: lastName,
        password: password,
        phone: "",
        roles: [{
          departmentId: "",
          orgId: "",
          roleIDs: []
        }],
        status: "active",
        updated: {
          By: "system",
          Timestamp: new Date().toISOString()
        },
        userName: userName
      };

      await axios.post(
        `${proxyBaseUrl}/user/`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      navigate("/");

    } catch (error) {
      console.error("Sign up failed:", error);
      if (!userNameError) {
        setEmailError(true);
        setPasswordError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-lg:gap-10 max-xl:gap-10 gap-36 justify-end max-sm:block max-lg:min-h-full h-screen w-full bg-white min-ultra-wide:h-fit min-ultra-wide:w-[1440px] min-ultra-wide:mx-auto min-[2000px]:h-fit min-[2000px]:w-[1440px] min-[2000px]:mx-auto">
      <div className="flex items-center justify-center max-sm:block max-lg:h-full">
        <div className="lg:w-custom sm:w-full max-sm:w-full p-8">
          <h2 className="text-3xl font-sora font-bold text-secondary max-lg:mt-10 max-sm:mt-custom-sm mb-3">
            Get Started
          </h2>
          <p className="text-muted font-medium">
            Welcome to Lyncit AI - Let's create your account
          </p>
          <div className="mt-8">
            <div className="mb-5">
              <label className="text-sm font-medium text-secondary">
                Username
              </label>
              <Input
                type="text"
                placeholder="Username ..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={userNameError ? "border-danger" : ""}
              />
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-secondary">
                First Name
              </label>
              <Input
                type="text"
                placeholder="First Name ..."
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-secondary">
                Last Name
              </label>
              <Input
                type="text"
                placeholder="Last Name ..."
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
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
              onClick={handleSignUp}
              className="w-full bg-primary text-white rounded-lg mt-8"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </div>
          <p className="mt-8 text-accent max-sm:text-center mb-8">
            Already have an account?
            <a
              href="/"
              className="text-primary ml-1 underline underline-offset-2"
            >
              Login
            </a>
          </p>
        </div>
      </div>
      <SignUpBanner Nurse={Nurse} />
    </div>
  );
}