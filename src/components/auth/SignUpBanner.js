import React from "react";

export default function SignUpBanner({ Nurse }) {
  return (
    <div className="w-45p max-lg:w-1/2 max-sm:hidden flex relative justify-end">
      <img src={Nurse} alt="Nurse" loading="lazy" className="w-full" />
      <div className="absolute text-[#FDFDFD] bottom-12">
        <p className="text-4xl max-xl:text-3xl font-sora px-10">
          "We've been using Lyncit AI <br className="lg:block hidden" /> for
          kick start every new recruitment and can't imagine working without
          it."
        </p>
        <div className="flex max-lg:flex-col px-10 justify-between items-end max-lg:items-start mt-[52px]">
          <div className="text-3xl max-xl:text-2xl font-sora">Olivia Rhye</div>
          <div className="text-lg max-xl:text-base max-lg:mt-4 font-semibold xl:mr-[20px]">
            <p>Lead Recruiter, Layers</p>
            <p>Web Development Agency</p>
          </div>
        </div>
      </div>
    </div>
  );
}
