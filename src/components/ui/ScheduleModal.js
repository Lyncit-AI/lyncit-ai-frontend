import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const ScheduleModal = ({ onClose, onDone }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [initiateNow, setInitiateNow] = useState(false);

  const handleDone = () => {
    const modalData = { date, time, initiateNow };
    onDone(modalData);
  };

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-[496px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg focus:outline-none z-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.875 7.125L7.125 16.875M7.125 7.125L16.875 16.875"
                stroke="#637083"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div className="mt-16 mb-8">
            <label className="flex items-center space-x-3 border border-[#EAEAEA] rounded-[16px] p-5">
              <input
                type="checkbox"
                checked={initiateNow}
                onChange={() => setInitiateNow(!initiateNow)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-900">
                Initiate Now
              </span>
            </label>
          </div>

          <div className="border border-[#EAEAEA] rounded-[16px] p-4">
            <h3 className="font-semibold mb-8">Schedule for later</h3>
            <div className="flex max-sm:flex-col items-center gap-5">
              <div className="relative flex flex-col">
                <label className="text-[#637083] mb-2">Date</label>
                <input
                  type="text"
                  placeholder="DD/MM/YY"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border rounded-md py-2 px-3 pr-8 text-sm focus:outline-none"
                />
                <svg
                  className="absolute right-2 bottom-2 text-gray-500"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 8.33342H2.5M13.3333 1.66675V5.00008M6.66667 1.66675V5.00008M8.75 11.6667L10 10.8334V15.0001M8.95833 15.0001H11.0417M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4388 17.2275 16.9684C17.5 16.4336 17.5 15.7335 17.5 14.3334V7.33342C17.5 5.93328 17.5 5.23322 17.2275 4.69844C16.9878 4.22803 16.6054 3.84558 16.135 3.6059C15.6002 3.33341 14.9001 3.33341 13.5 3.33341H6.5C5.09987 3.33341 4.3998 3.33341 3.86502 3.6059C3.39462 3.84558 3.01217 4.22803 2.77248 4.69844C2.5 5.23322 2.5 5.93328 2.5 7.33341V14.3334C2.5 15.7335 2.5 16.4336 2.77248 16.9684C3.01217 17.4388 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z"
                    stroke="#637083"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <div className="relative flex flex-col">
                <label className="text-[#637083] mb-2">Time</label>
                <input
                  type="text"
                  placeholder="HH:MM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border rounded-md py-2 px-3 pr-8 text-sm focus:outline-none"
                />
                <svg
                  className="absolute right-2 bottom-2 text-gray-500"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.0436 10.7441C16.8121 12.919 15.5797 14.9571 13.5406 16.1344C10.1527 18.0904 5.82057 16.9297 3.86456 13.5417L3.65623 13.1809M2.95432 9.25602C3.18583 7.08111 4.41815 5.043 6.45731 3.8657C9.84521 1.90969 14.1773 3.07047 16.1333 6.45838L16.3417 6.81922M2.91016 15.055L3.5202 12.7783L5.79691 13.3884M14.201 6.61173L16.4777 7.22177L17.0878 4.94506M9.99897 6.25004V10L12.0823 11.25"
                    stroke="#637083"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={handleDone}
                className="bg-gray-900 text-white py-2 px-6 rounded-full font-medium hover:bg-gray-800"
              >
                Done
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ScheduleModal;
