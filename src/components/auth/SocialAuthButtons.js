import React from "react";
import Google from "../../assets/icons/Google";
import Microsoft from "../../assets/icons/Microsoft";
import Facebook from "../../assets/icons/Facebook";
import Button from "../ui/Button";

export default function SocialAuthButtons({
  googleLogin,
  loading,
  handleMicrosoftLogin,
  onLoginStart,
  onLogoutSuccess,
  setProvider,
  setProfile,
  LoginSocialFacebook,
}) {
  return (
    <div className="flex justify-between max-lg:flex-col max-lg:gap-2">
      <Button
        onClick={() => googleLogin()}
        disabled={loading}
        variant="outline"
        className="px-7 py-4 border border-[#EAEAEA] flex items-center max-lg:w-full max-lg:justify-center gap-2"
      >
        Sign in with <Google />
      </Button>

      <Button
        onClick={handleMicrosoftLogin}
        variant="outline"
        className="px-7 py-4 border border-[#EAEAEA] flex items-center max-lg:w-full max-lg:justify-center gap-2"
      >
        Sign in with <Microsoft />
      </Button>

      <LoginSocialFacebook
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        fieldsProfile="id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender"
        onLoginStart={onLoginStart}
        onLogoutSuccess={onLogoutSuccess}
        redirect_uri="http://localhost:3000/sign-up"
        onResolve={({ provider, data }) => {
          setProvider(provider);
          setProfile(data);
        }}
        onReject={(err) => {
          console.log(err);
        }}
      >
        <Button
          variant="outline"
          className="px-7 py-4 border border-[#EAEAEA] flex items-center max-lg:w-full max-lg:justify-center gap-2"
        >
          Sign in with <Facebook />
        </Button>
      </LoginSocialFacebook>
    </div>
  );
}