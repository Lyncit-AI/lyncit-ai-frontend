import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";

const Congratulation = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "Insight Hub",
      description: "Spot Trends, Track Progress and Stay ahead",
      href: "#" // Replace with your actual URL
    },
    {
      title: "Stat Story",
      description: "Uncover Trends, track perforce and make smart decision.",
      href: "#" // Replace with your actual URL
    }
  ];

  const handleback = () => {
    navigate("/app")
  };

  return (
    <DashboardLayout>
      <div className="pt-8 px-[82px] max-sm:px-8">
        <h1 className="text-5xl font-bold max-sm:text-4xl">Congratulations</h1>
        <p className="mt-6 text-sm text-[#637083] max-w-[760px]">
          We are seeking a compassionate and skilled Occupational Therapist to
          join our dynamic healthcare team. If you're passionate about helping
          individuals achieve independence in their daily lives and enjoy
          working in a collaborative environment, we'd love to hear from you!
        </p>

        <div className="mt-16 max-sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 max-sm:gap-8 max-w-[760px]">
        {cardData.map((card, index) => (
          <div key={index} className="p-5 rounded-[32px] border border-[#EAEAEA] max-w-[374px]">
            <h2 className="text-xl font-semibold mb-8">{card.title}</h2>
            <p className="text-[#637083] max-w-[320px]">
            {card.description}
            </p>
            <div className="mt-3 text-right">
              <a href={card.href} className="text-[#637083] font-medium hover:underline">
                View
              </a>
            </div>
          </div>
          ))}
        </div>
        <div className="mt-8">
          <button onClick={handleback} className="bg-black text-white text-sm font-semibold py-4 px-6 max-sm:w-full rounded-full hover:bg-gray-800">
            Back to home
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Congratulation;