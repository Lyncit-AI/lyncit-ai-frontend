import React, { useState, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Sidebar } from "../components/recruiter/Sidebar";
import { useNavigate } from "react-router-dom";
import { QuestionFlow } from "../components/recruiter/QuestionFlow";
import { ArrowLeft } from "lucide-react";
import Logo from "../assets/icons/keylogo";

function Questionaire() {
  const navigate = useNavigate();
  const [currentFlow, setCurrentFlow] = useState(null);
  const fileInputRef = useRef(null);
  const questionFlowRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleFlowChange = (flowData) => {
    setCurrentFlow(flowData);
    // You can save or process the flow data here if needed
  };

  const handleExport = () => {
    if (questionFlowRef.current && questionFlowRef.current.exportFlow) {
      questionFlowRef.current.exportFlow();
    }
  };

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleback = () => {
    navigate("/app");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-white">
        <div className="px-14 max-lg:px-8 mb-8 max-sm:hidden">
          <div className="flex items-center justify-between pt-3">
            <div>
              <Logo />
            </div>
            <h1 className="text-lg font-semibold text-black">
              Campaign Dashboard
            </h1>
            <span className="text-xs text-gray-500">Powered By Lyncit AI</span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <button onClick={handleback} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
              <ArrowLeft size={16} />
              Back
            </button>

            <button className="px-14 py-3 text-sm font-medium text-white bg-[rgb(122,86,144,1)] rounded-full hover:bg-[rgb(122,86,144,1)]">
              Finalize the Campaign
            </button>
            <div></div>
          </div>
        </div>
        <div className="sm:hidden flex justify-between px-8 my-11">
          <div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12H15M3 6H21M3 18H21"
                stroke="#637083"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.35493 21C10.0601 21.6224 10.9863 22 12.0008 22C13.0152 22 13.9414 21.6224 14.6466 21M18.0008 8C18.0008 6.4087 17.3686 4.88258 16.2434 3.75736C15.1182 2.63214 13.5921 2 12.0008 2C10.4095 2 8.88333 2.63214 7.75811 3.75736C6.63289 4.88258 6.00075 6.4087 6.00075 8C6.00075 11.0902 5.22122 13.206 4.35042 14.6054C3.61588 15.7859 3.24861 16.3761 3.26208 16.5408C3.27699 16.7231 3.31561 16.7926 3.46253 16.9016C3.59521 17 4.19334 17 5.38961 17H18.6119C19.8082 17 20.4063 17 20.539 16.9016C20.6859 16.7926 20.7245 16.7231 20.7394 16.5408C20.7529 16.3761 20.3856 15.7859 19.6511 14.6054C18.7803 13.206 18.0008 11.0902 18.0008 8Z"
                stroke="#637083"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="md:flex px-14 max-lg:px-8 max-md:flex-col">
          <Sidebar
            onExport={handleExport}
            onImport={handleImport}
            fileInputRef={fileInputRef}
          />
          <div className="flex justify-center sm:hidden">
          <button className="px-14 py-3 my-6 text-sm font-medium text-white bg-[rgb(122,86,144,1)] rounded-full hover:bg-[rgb(122,86,144,1)]">
              Finalize the Campaign
            </button>
          </div>
          <QuestionFlow
            ref={questionFlowRef}
            onFlowChange={handleFlowChange}
            fileInputRef={fileInputRef}
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default Questionaire;
