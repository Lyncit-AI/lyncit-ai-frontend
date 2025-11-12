import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import brain from "../../assets/icons/brain.jpg";
import bolt from "../../assets/icons/bolt.svg";
import JobPostingModal from "./JobPostingModal"; // ✅ make sure path is correct

const ChooseHiringTypeModal = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openJobModal, setOpenJobModal] = useState(false);

  const handleSelect = (kind) => {
    if (kind === "specialized") {
      // ✅ tell JobPostingModal to auto-open at step 1
      localStorage.setItem("openModalAtStep", "1");

      // close this modal first
      setDialogOpen(false);

      // mount JobPostingModal a tick later for smooth UX (and to let Radix unmount)
      setTimeout(() => {
        setOpenJobModal(true); // this renders <JobPostingModal />, whose useEffect will open it
      }, 150);
    } else if (kind === "commodity") {
      // optional behavior
      setDialogOpen(false);
      // You could also open JobPostingModal here if you want:
      // localStorage.setItem("openModalAtStep", "1");
      // setTimeout(() => setOpenJobModal(true), 150);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center z-30">
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger asChild>
            <button
              className="flex justify-center items-center rounded-b-[32px] gap-2 w-full bg-[#3d3d4e] text-white py-6 hover:bg-gray-700"
              onClick={() => setDialogOpen(true)}
            >
              Design a campaign
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 6.66667V13.3333M6.66667 10H13.3333M6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 14.9001 2.5 13.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5Z"
                  stroke="#FDFDFD" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl z-50 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-[22px] font-semibold text-gray-900">Choose Hiring Type</h1>
                  <p className="text-gray-600 text-[16px] mt-1 leading-snug">
                    Help Lyncit AI design the right screening flow for your campaign.
                  </p>
                </div>
                <Dialog.Close asChild>
                  <button aria-label="Close" className="text-gray-500 hover:text-gray-800 text-xl">✕</button>
                </Dialog.Close>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Specialized */}
                <div className="border border-gray-200 hover:border-gray-300 rounded-2xl p-6 flex flex-col justify-between transition-all">
                  <div className="flex items-start gap-3">
                    <img src={brain} alt="brainIcon" className="w-10 h-10 mt-2" />
                    <h3 className="text-2xl font-medium text-gray-800 leading-snug">Hire for a Specialized Role</h3>
                  </div>
                  <div className="items-start gap-3">
                    <p className="text-[15px] text-gray-700 font-medium mt-5 leading-relaxed">
                      Designed for skilled or certified positions requiring domain knowledge.
                    </p>
                    <p className="text-[15px] text-gray-700 font-medium mt-3 leading-relaxed">
                      Lyncit AI will create detailed multi-step screening questions to assess expertise, experience depth, and fit.
                    </p>
                  </div>
                  <button
                    onClick={() => setOpenJobModal(true)}
                    className="mt-6 bg-[#0D0C22] text-white font-medium rounded-xl text-lg py-2.5 w-full hover:bg-[#353536] transition-colors"
                  >
                    Select Specialized Role
                  </button>
                </div>

                {/* Commodity */}
                <div className="border border-gray-200 hover:border-gray-300 rounded-2xl p-6 flex flex-col justify-between transition-all">
                  <div className="flex items-start gap-3">
                    <img src={bolt} alt="boltIcon" className="w-10 h-10 mt-2" />
                    <h3 className="text-2xl font-medium text-gray-800 leading-snug">Hire for high volume hiring</h3>
                  </div>
                  <div className="items-start">
                    <p className="text-[15px] text-gray-700 font-medium mt-5 leading-relaxed">
                      Ideal for high-volume positions where speed and suitability matter most.
                    </p>
                    <p className="text-[15px] text-gray-700 font-medium mt-5 leading-relaxed">
                      Lyncit AI will generate concise screening questions to verify availability, reliability, and basic eligibility — so you can move fast.
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelect("commodity")}
                    className="mt-6 bg-[#0D0C22] text-white font-medium rounded-xl text-lg py-2.5 w-full hover:bg-[#353536] transition-colors"
                  >
                    Select Commodity Role
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      {openJobModal && <JobPostingModal />}
    </>
  );
};

export default ChooseHiringTypeModal;
