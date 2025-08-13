import React from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo/logo";
import JobPostingModal from "../components/ui/JobPostingModal";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const upcomingMeetings = [
    { name: "Josh Emanuel", time: "1:00 CST" },
    { name: "Laura", time: "10:00 CST" },
    { name: "Max", time: "11:00 CST" },
    { name: "Max", time: "11:00 CST" }
  ];

  const campaigns = [
    {
      title: "Hire",
      description:
        "Craft, curates and connect - tailored screening questions to spot the high quality candidates first"
    },
    {
      title: "ReHire",
      description: "Engaging with prospects at scale to find the right roles"
    }
  ];

  const handleback = () => {
    navigate("/campaign");
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 w-full max-sm:flex-col">
        <div className="bg-[#493456] text-white rounded-[32px] py-8 px-16 flex flex-col justify-center w-[60%] max-sm:w-full">
          <div className="flex flex-col gap-4 mb-4">
            <Logo />
            <h2 className="text-2xl font-semibold">
              Recruiting Made easier with Lyncit AI
            </h2>
          </div>
          <p className="">
              Find the Right Talent, First Time
          </p>
        </div>
        <div className="rounded-[32px] p-6 border border-[#EAEAEA] w-[40%] max-sm:w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#0D0C22] mb-2">
              Job Analytics
            </h3>
            <button className="text-[#0D0C22] hover:underline">View</button>
          </div>
          <div className="h-[120px] bg-[#EAF5F0] rounded-[32px] mt-6"></div>
        </div>
      </div>
      <div className="flex gap-6 w-full mt-6 max-sm:flex-col">
        <div className="flex w-[60%] max-sm:w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaigns.map((campaign, index) => (
              <div
                key={index}
                className="bg-white rounded-[32px] border border-[#EAEAEA] h-full overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-4 justify-center items-center py-8">
                    <h3 className="text-3xl font-medium text-gray-800">
                      {campaign.title}
                    </h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                    >
                      <path
                        d="M6.5 18L18.5 6M18.5 6H10.5M18.5 6V14"
                        stroke="#0D0C22"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="px-1">
                    <hr />
                  </div>
                </div>
                <div>
                  <p className="text-[#637083] text-sm px-9 max-xl:px-6 py-4">
                    {campaign.description}
                  </p>
                </div>
                <div>
                  <div className="flex justify-center">
                    <button onClick={handleback} className="flex justify-center items-center gap-2 mx-9 max-xl:mx-6 w-full my-6 py-4 rounded-full text-sm border border-[#EAEAEA]">
                      View Approved Campaigns
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M2.01677 10.5944C1.90328 10.4147 1.84654 10.3248 1.81477 10.1863C1.79091 10.0822 1.79091 9.918 1.81477 9.8139C1.84654 9.67532 1.90328 9.58547 2.01677 9.40577C2.95461 7.92078 5.74617 4.16675 10.0003 4.16675C14.2545 4.16675 17.0461 7.92078 17.9839 9.40577C18.0974 9.58547 18.1541 9.67532 18.1859 9.8139C18.2098 9.918 18.2098 10.0822 18.1859 10.1863C18.1541 10.3248 18.0974 10.4147 17.9839 10.5944C17.0461 12.0794 14.2545 15.8334 10.0003 15.8334C5.74617 15.8334 2.95461 12.0794 2.01677 10.5944Z"
                          stroke="#637083"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10.0003 12.5001C11.381 12.5001 12.5003 11.3808 12.5003 10.0001C12.5003 8.61937 11.381 7.50008 10.0003 7.50008C8.61962 7.50008 7.50034 8.61937 7.50034 10.0001C7.50034 11.3808 8.61962 12.5001 10.0003 12.5001Z"
                          stroke="#637083"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {campaign.title === "Hire" ? (
                    <JobPostingModal />
                  ) : (
                    <>
                      <button className="flex justify-center items-center rounded-b-[32px] gap-2 w-full bg-[#3d3d4e] text-white py-6 hover:bg-gray-700">
                        Design a campaign
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M10 6.66667V13.3333M6.66667 10H13.3333M6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 14.9001 2.5 13.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5Z"
                            stroke="#FDFDFD"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Job Analytics & Upcoming Meetings */}
        <div className="flex flex-col gap-3 w-[40%] max-sm:w-full">
          <div className="rounded-[32px] p-6 border border-[#EAEAEA]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#0D0C22] mb-2">
                Upcoming Meetings
              </h3>
              <button className="text-[#0D0C22] hover:underline">
                View All
              </button>
            </div>
            <ul className="space-y-1 mt-6">
              {upcomingMeetings.map((meeting, index) => (
                <li
                  key={index}
                  className="flex justify-between text-[#637083]"
                >
                  <span className="font-medium">{meeting.name}</span>
                  <span className="text-sm">{meeting.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[32px] p-6 border border-[#EAEAEA]">
            <div className="flex justify-between items-center max-lg:flex-col max-lg:items-start">
              <h3 className="text-lg font-bold text-[#0D0C22] mb-2">Sync</h3>
              <p className="text-[#0D0C22] text-sm max-w-[219px]">
                Collect active users preferences to meet their unfulfilled
                demands
              </p>
            </div>
            <div className="flex justify-end max-lg:justify-start mt-3">
              <button className="text-white max-sm:w-full text-sm font-semibold bg-[#0D0C22] border border-[#EAEAEA] rounded-[32px] py-2 px-3">
                Run Engage Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;