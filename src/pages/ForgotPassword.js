import React, { useState } from "react";
import Nurse from "../assets/images/Section.webp";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SignUpBanner from "../components/auth/SignUpBanner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  return (
    <div className="flex max-lg:gap-10 gap-36 justify-end max-sm:block h-screen w-full bg-white">
      <div className="flex items-center justify-center max-sm:block">
        <div className="lg:max-w-[620px] sm:w-full max-sm:w-full p-8">
          <h2 className="text-3xl font-sora font-bold text-secondary max-lg:mt-10 max-sm:mt-[102px] mb-3">
            Get Started
          </h2>
          <p className="text-muted font-medium">
            Enter the email address you used when you joined and we’ll send you
            instructions to reset your password.
            <br />
            For security reasons, we do NOT store your password. So rest assured
            that we will never send your password via email.
          </p>
          <div className="mt-8">
            <div className="mb-8">
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
            <Button
              className="w-full bg-primary text-white rounded-lg hover:bg-purple-700 mt-8"
            >
              Send Instructions
            </Button>
          </div>
        </div>
      </div>
      <SignUpBanner Nurse={Nurse} />
    </div>
  );
}