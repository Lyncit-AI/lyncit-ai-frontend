"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function JobPostingModal() {
  const [jobUrl, setJobUrl] = useState("");
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(
    "Qualifications & Certifications"
  );
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [customKeyword, setCustomKeyword] = useState("");
  const [customKeywords, setCustomKeywords] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleAddCustom = () => {
    if (customKeyword.trim() && !customKeywords.includes(customKeyword)) {
      setCustomKeywords([...customKeywords, customKeyword.trim()]);
      setCustomKeyword("");
    }
  };

  const categories = {
    "Qualifications & Certifications": [
      "Work Authorization (Proof of eligibility in the U.S.)",
      "Experience (1+ year professional caregiver)",
      "Transportation (Driver’s license, insurance, reliable vehicle)",
      "Availability (Open shifts, including weekends)"
    ],
    "Caregiving Skills": [
      "First Aid & CPR Certification",
      "Alzheimer’s & Dementia Care",
      "Medication Management",
      "Companionship & Emotional Support"
    ],
    "Work Conditions": [
      "Flexible Shifts",
      "Live-in Caregiver",
      "Home Health Aide Work",
      "Hospital Experience"
    ],
    "Communication & Teamwork": [
      "Strong Verbal & Written Communication",
      "Active Listening Skills",
      "Collaborative Team Player",
      "Ability to Follow Care Plans"
    ],
    "Professionalism & Work Ethic": [
      "Punctuality & Reliability",
      "Compassionate & Patient Approach",
      "Commitment to High-Quality Care",
      "Discretion & Confidentiality"
    ]
  };

  const categoryKeys = Object.keys(categories);
  const visibleCategories = showAllCategories
    ? categoryKeys
    : categoryKeys.slice(0, 3);
  const remainingCount = categoryKeys.length - 3;

  const toggleKeywordSelection = (keyword) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((item) => item !== keyword)
        : [...prev, keyword]
    );
  };

  const handleSubmit = () => {
    console.log("Selected Keywords:", selectedKeywords);
  };

  return (
    <div className="flex justify-center items-center z-30">
      <Dialog.Root>
        <Dialog.Trigger asChild>
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
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content
            className={`fixed top-1/2 left-1/2 max-w-[857px] max-sm:w-[315px] ${step === 1 ? "lg:w-[615px] px-8" : "lg:w-[857px] px-24 max-md:px-12 max-sm:px-8"} bg-white py-12 rounded-[32px] shadow-lg -translate-x-1/2 -translate-y-1/2`}
          >
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold">
                {step === 1
                  ? "Use Lyncit AI to create job posting"
                  : "Suggested Keywords"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button onClick={() => setStep(1)}>
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {step === 1 && (
              <>
                <label className="block mt-8 text-sm text-[#0D0C22] font-medium">
                  Paste the URL of your job link.
                </label>
                <textarea
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="http://app/userbraintrust.com/jobs/11450?utm/"
                  className="w-full h-20 mt-2 p-3 border rounded-lg resize-none"
                />
                <div className="text-sm text-[#637083] flex justify-between mt-1 max-sm:flex-col">
                  <span>Required</span>
                  <span>{jobUrl.length}/1000 maximum characters</span>
                </div>

                <div className="flex justify-end gap-4 items-center mt-8">
                  <span className="text-[#637083] text-sm font-semibold">
                    Step 1 of 2
                  </span>
                  <button
                    onClick={() => setStep(2)}
                    className="bg-[#0D0C22] text-white text-sm font-semibold px-10 py-4 rounded-full"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-[#637083] mt-4">
                  Select keywords based on the job posting.
                </p>
                <div className="flex mt-12 gap-4 border-b max-sm:hidden">
                  <div className="flex gap-4 overflow-x-scroll">
                    {visibleCategories.map((category) => (
                      <span
                        key={category}
                        className={`cursor-pointer py-6 font-medium ${
                          selectedCategory === category
                            ? "text-[#825C9A] border-b border-[#825C9A]"
                            : "text-[#0D0C22]"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </span>
                    ))}

                    {!showAllCategories && remainingCount > 0 && (
                      <span
                        className="cursor-pointer py-6 font-medium text-[#0D0C22]"
                        onClick={() => setShowAllCategories(true)}
                      >
                        +{remainingCount} more option
                        {remainingCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div
                    key={"Add an option"}
                    className={`cursor-pointer min-w-[170px] py-6 font-medium ${
                      selectedCategory === "Add an option"
                        ? "text-white border-b border-[#825C9A]"
                        : "text-[#0D0C22]"
                    }`}
                    onClick={() => setSelectedCategory("Add an option")}
                  >
                    <button
                      className={`flex justify-center gap-2 border border-[#825C9A] rounded-full py-1 px-3 ${
                        selectedCategory === "Add an option"
                          ? "text-white bg-[#825C9A] stroke-[#825C9A]"
                          : "text-[#0D0C22] stroke-[#0D0C22]"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 5V19M5 12H19"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Add an option
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-2 max-sm:hidden">
                  {categories[selectedCategory]?.map((keyword) => (
                    <button
                      key={keyword}
                      className={`flex justify-between items-center gap-2 border border-[#BFBFBF] text-[#637083] text-sm font-semibold rounded-full px-3 py-2 ${selectedKeywords.includes(keyword) && "border-black"}`}
                      onClick={() => toggleKeywordSelection(keyword)}
                    >
                      {keyword}
                      <span>
                        {selectedKeywords.includes(keyword) ? (
                          "✔"
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="23"
                            height="20"
                            viewBox="0 0 23 20"
                            fill="none"
                          >
                            <path
                              d="M11.4993 4.16669V15.8334M4.79102 10H18.2077"
                              stroke="#637083"
                              stroke-width="1.66667"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedCategory === "Add an option" && (
                  <div className="max-sm:hidden">
                    <div
                      className={`flex gap-2 border rounded-[32px] overflow-hidden w-fit transition ${
                        customKeyword ? "border-[#825C9A]" : "border-[#BFBFBF]"
                      }`}
                    >
                      <input
                        type="text"
                        value={customKeyword}
                        onChange={(e) => setCustomKeyword(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddCustom()
                        }
                        placeholder="Add a Keyword"
                        className="pl-3 py-2 text-sm placeholder-[#637083] text-[#637083] font-semibold focus:outline-none"
                        style={{
                          width: `${Math.max(120, customKeyword.length * 10)}px`
                        }}
                      />
                      <button
                        onClick={handleAddCustom}
                        className="text-white rounded-lg pr-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="23"
                          height="20"
                          viewBox="0 0 23 20"
                          fill="none"
                        >
                          <path
                            d="M11.4993 4.16669V15.8334M4.79102 10H18.2077"
                            stroke="#637083"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    {customKeywords.length > 0 && (
                      <div className="mt-4 flex flex-col gap-2">
                        {customKeywords.map((keyword, index) => (
                          <button
                            key={index}
                            className={`flex justify-between items-center w-fit gap-2 border border-[#BFBFBF] text-[#637083] text-sm font-semibold rounded-full px-3 py-2 ${selectedKeywords.includes(keyword) && "border-black"}`}
                            onClick={() => toggleKeywordSelection(keyword)}
                          >
                            {keyword}
                            <span>
                              {selectedKeywords.includes(keyword) ? (
                                "✔"
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="23"
                                  height="20"
                                  viewBox="0 0 23 20"
                                  fill="none"
                                >
                                  <path
                                    d="M11.4993 4.16669V15.8334M4.79102 10H18.2077"
                                    stroke="#637083"
                                    stroke-width="1.66667"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 space-y-2 sm:hidden overflow-y-scroll h-[240px]">
                  {Object.keys(categories).map((category) => (
                    <div key={category}>
                      {/* Category Name */}
                      <span
                        className={`cursor-pointer py-2 font-medium ${
                          selectedCategory === category ? "" : "text-[#0D0C22]"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {categories[category].map((keyword) => (
                          <button
                            key={keyword}
                            className={`flex justify-between items-center gap-2 border border-[#BFBFBF] text-[#637083] text-sm font-semibold rounded-full px-3 py-2 ${selectedKeywords.includes(keyword) && "border-black"}`}
                            onClick={() => toggleKeywordSelection(keyword)}
                          >
                            {keyword}
                            <span>
                              {selectedKeywords.includes(keyword) ? (
                                "✔"
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="23"
                                  height="20"
                                  viewBox="0 0 23 20"
                                  fill="none"
                                >
                                  <path
                                    d="M11.4993 4.16669V15.8334M4.79102 10H18.2077"
                                    stroke="#637083"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <span
                      className={`cursor-pointer py-2 font-medium text-[#0D0C22]`}
                    >
                      Add an Option
                    </span>

                    {customKeywords.length > 0 && (
                      <div className="mt-4 flex flex-col gap-2">
                        {customKeywords.map((keyword, index) => (
                          <button
                            key={index}
                            className={`flex justify-between items-center w-fit gap-2 border border-[#BFBFBF] text-[#637083] text-sm font-semibold rounded-full px-3 py-2 ${selectedKeywords.includes(keyword) && "border-black"}`}
                            onClick={() => toggleKeywordSelection(keyword)}
                          >
                            {keyword}
                            <span>
                              {selectedKeywords.includes(keyword) ? (
                                "✔"
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="23"
                                  height="20"
                                  viewBox="0 0 23 20"
                                  fill="none"
                                >
                                  <path
                                    d="M11.4993 4.16669V15.8334M4.79102 10H18.2077"
                                    stroke="#637083"
                                    stroke-width="1.66667"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div
                      className={`flex gap-2 mt-2 border rounded-[32px] overflow-hidden w-fit transition ${
                        customKeyword ? "border-[#825C9A]" : "border-[#BFBFBF]"
                      }`}
                    >
                      <input
                        type="text"
                        value={customKeyword}
                        onChange={(e) => setCustomKeyword(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddCustom()
                        }
                        placeholder="Add a Keyword"
                        className="pl-3 py-2 text-sm placeholder-[#637083] text-[#637083] font-semibold focus:outline-none"
                        style={{
                          width: `${Math.max(120, customKeyword.length * 10)}px`
                        }}
                      />
                      <button
                        onClick={handleAddCustom}
                        className="text-white rounded-lg pr-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="23"
                          height="20"
                          viewBox="0 0 23 20"
                          fill="none"
                        >
                          <path
                            d="M11.4993 4.16669V15.8334M4.79102 10H18.2077"
                            stroke="#637083"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 items-center mt-8">
                  <span className="text-[#637083] text-sm font-semibold">
                    Step 2 of 2
                  </span>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#0D0C22] text-white text-sm font-semibold px-10 py-4 rounded-full"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
