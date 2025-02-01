import React, { useState } from "react";
import Nurse from "../assets/images/Section.webp";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SignUpBanner from "../components/auth/SignUpBanner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  return (
    <div className="flex max-lg:gap-10 max-xl:gap-10 gap-36 justify-end max-sm:block max-lg:min-h-full h-screen w-full bg-white min-ultra-wide:h-fit min-ultra-wide:w-[1440px] min-ultra-wide:mx-auto min-[2000px]:h-fit min-[2000px]:w-[1440px] min-[2000px]:mx-auto">
      <div className="flex items-center justify-center max-sm:block max-lg:h-full">
        <div className="lg:w-custom sm:w-full max-sm:w-full p-8">
          <h2 className="text-3xl font-sora font-bold text-secondary max-lg:mt-10 max-sm:mt-custom-sm">
            Get Started
          </h2>
          <p className="text-muted text-lg mt-3 w-fit">
            Enter the email address you used when you joined and we'll send you
            instructions to reset your password.
            <br />
            For security reasons, we do NOT store your password. So rest assured
            that we will never send your password via email.
          </p>
          <div className="mt-8">
            <div className="mb-8">
              <label className="text-sm font-medium text-secondary">
                Enter your registered email
              </label>
              <Input
                type="email"
                placeholder="Email ..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? "border-danger" : ""}
              />
            </div>
            <Button className="w-full bg-primary text-white rounded-lg mt-8">
              Send Instructions
            </Button>
          </div>
        </div>
      </div>
      <SignUpBanner Nurse={Nurse} />
    </div>
  );
}
