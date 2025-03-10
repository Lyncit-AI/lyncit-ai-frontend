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
        redirect_uri="http://localhost:3000/sign-up"
        onResolve={({ provider, data }) => {
          // Log the received data for debugging
          console.log("Facebook login successful:", data);

          // Extract user info in a consistent format
          const userInfo = {
            name: data.name,
            email: data.email,
            picture: data.picture?.data?.url, // Facebook nests picture URL in picture.data.url
            sub: data.id
          };

          // You can also store provider name if needed for provider-specific logic
          const providerName = "facebook";

          // Extract an access token if available
          const accessToken = data.accessToken || "";

          // Navigate to RecruiterDashboard with standardized data
          navigate("/app", {
            state: {
              accessToken: accessToken,
              userInfo: userInfo,
              provider: providerName
            }
          });

          // If you still need to set these states for other components
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
