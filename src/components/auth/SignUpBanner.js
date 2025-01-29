import React from "react";

export default function SignUpBanner({ Nurse }) {
  return (
    <div className="w-[45%] max-lg:w-[50%] max-sm:hidden flex relative justify-end">
      <img src={Nurse} alt="Nurse" loading="lazy" className="w-full"/>
      <div className="absolute text-[#FDFDFD] bottom-12">
        <p className="text-4xl font-sora px-10">
          “We’ve been using Lyncit AI <br className="lg:block hidden"/> for kick start every new recruitment and
          can’t imagine working without it.”
        </p>
        <div className="flex max-lg:flex-col px-10 justify-between items-end max-lg:items-start mt-[52px]">
          <div className="text-3xl">Olivia Rhye</div>
          <div className="text-lg font-semibold">
            <p>Lead Recruiter, Layers</p>
            <p>Web Development Agency</p>
          </div>
        </div>
      </div>
    </div>
  );
}