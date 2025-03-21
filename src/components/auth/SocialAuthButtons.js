import React from "react";
import Google from "../../assets/icons/Google";
import Microsoft from "../../assets/icons/Microsoft";
import Facebook from "../../assets/icons/Facebook";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function SocialAuthButtons({
  googleLogin,
  loading,
  handleMicrosoftLogin,
  onLoginStart,
  onLogoutSuccess,
  setProvider,
  setProfile,
  LoginSocialFacebook
}) {
  const navigate = useNavigate();
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
        redirect_uri={
          process.env.NODE_ENV === "development" 
            ? "http://localhost:3000"
            : "https://lyncit-ai-frontend.vercel.app"
        }
        onResolve={({ provider, data }) => {
          console.log("Facebook login successful:", data);

          const userInfo = {
            name: data.name,
            email: data.email,
            picture: data.picture?.data?.url,
            sub: data.id
          };
          const providerName = "facebook";

          const accessToken = data.accessToken || "";
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));

          navigate("/app", {
            state: {
              accessToken: accessToken,
              userInfo: userInfo,
              provider: providerName
            }
          });

          setProvider(provider);
          setProfile(data);
        }}
        onReject={(err) => {
          console.log(err);
          localStorage.removeItem("userInfo");
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
