import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Logo from "../assets/logo/logo";
import JobPostingModal from "../components/ui/JobPostingModal";

const RecruiterDashboard = () => {
  const location = useLocation();
  // const navigate = useNavigate();
  
  // const { accessToken, userInfo } = location.state || {};
  const { userInfo } = location.state || {};
  
  const userName = userInfo?.name || "";
  // const userEmail = userInfo?.email || "";
  const userPicture = userInfo?.picture || "";
  // const userId = userInfo?.sub || "";

  // const handleLogout = () => {
  //   localStorage.removeItem("accessToken");
  //   navigate("/"); // Assuming "/" is your login route
  // };

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

  return (
    <div className="flex w-full bg-gray-100">
      <Sidebar name={userName} picture={userPicture} />
      <div className="flex-1 w-full bg-white px-3 font-sans">
        <div className="flex justify-between items-center py-8 px-8 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Campaign Dashboard
          </h1>
          <div className="flex items-center gap-6">
            <button className="text-[#637083] text-sm font-semibold rounded-full border border-[#EAEAEA] py-2 px-3">
              + Hire
            </button>
            <button className="">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 10H5.51M10 10H10.01M14.5 10H14.51M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 11.1971 1.23374 12.3397 1.65806 13.3845C1.73927 13.5845 1.77988 13.6845 1.798 13.7653C1.81572 13.8443 1.8222 13.9028 1.82221 13.9839C1.82222 14.0667 1.80718 14.1569 1.77711 14.3374L1.18413 17.8952C1.12203 18.2678 1.09098 18.4541 1.14876 18.5888C1.19933 18.7067 1.29328 18.8007 1.41118 18.8512C1.54589 18.909 1.73218 18.878 2.10476 18.8159L5.66265 18.2229C5.84309 18.1928 5.9333 18.1778 6.01613 18.1778C6.09715 18.1778 6.15566 18.1843 6.23472 18.202C6.31554 18.2201 6.41552 18.2607 6.61549 18.3419C7.6603 18.7663 8.80286 19 10 19ZM6 10C6 10.2761 5.77614 10.5 5.5 10.5C5.22386 10.5 5 10.2761 5 10C5 9.72386 5.22386 9.5 5.5 9.5C5.77614 9.5 6 9.72386 6 10ZM10.5 10C10.5 10.2761 10.2761 10.5 10 10.5C9.72386 10.5 9.5 10.2761 9.5 10C9.5 9.72386 9.72386 9.5 10 9.5C10.2761 9.5 10.5 9.72386 10.5 10ZM15 10C15 10.2761 14.7761 10.5 14.5 10.5C14.2239 10.5 14 10.2761 14 10C14 9.72386 14.2239 9.5 14.5 9.5C14.7761 9.5 15 9.72386 15 10Z"
                  stroke="#0D0C22"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.35493 21C10.0601 21.6224 10.9863 22 12.0008 22C13.0152 22 13.9414 21.6224 14.6466 21M18.0008 8C18.0008 6.4087 17.3686 4.88258 16.2434 3.75736C15.1182 2.63214 13.5921 2 12.0008 2C10.4095 2 8.88333 2.63214 7.75811 3.75736C6.63289 4.88258 6.00075 6.4087 6.00075 8C6.00075 11.0902 5.22122 13.206 4.35042 14.6054C3.61588 15.7859 3.24861 16.3761 3.26208 16.5408C3.27699 16.7231 3.31561 16.7926 3.46253 16.9016C3.59521 17 4.19334 17 5.38961 17H18.6119C19.8082 17 20.4063 17 20.539 16.9016C20.6859 16.7926 20.7245 16.7231 20.7394 16.5408C20.7529 16.3761 20.3856 15.7859 19.6511 14.6054C18.7803 13.206 18.0008 11.0902 18.0008 8Z"
                  stroke="#0D0C22"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex gap-6 w-full max-sm:flex-col">
          <div className="bg-[#493456] text-white rounded-[32px] py-8 px-16 flex flex-col justify-center w-[60%] max-sm:w-full">
            <div className="flex flex-col gap-4 mb-4">
              <Logo />
              <h2 className="text-2xl font-semibold">
                Recruiting Made easier with Lyncit AI
              </h2>
            </div>
            <p className="">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium,
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
                      <button className="flex justify-center items-center gap-2 mx-9 max-xl:mx-6 w-full my-6 py-4 rounded-full text-sm border border-[#EAEAEA]">
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
                    {/* <button className="flex justify-center items-center rounded-b-[32px] gap-2 w-full bg-[#3d3d4e] text-white py-6 hover:bg-gray-700">
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
      <JobPostingModal /> */}
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
        {/* <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            >
              Logout
            </button> */}
      </div>
    </div>
  );
};

export default RecruiterDashboard;