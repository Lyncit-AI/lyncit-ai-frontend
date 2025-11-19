import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import axios from "axios";
import React from "react";
import brain from "../../assets/icons/brain.jpg";
import bolt from "../../assets/icons/bolt.svg";

// Simple spinner component
const Spinner = ({ size = "w-4 h-4" }) => (
  <div
    className={`animate-spin rounded-full border-2 border-gray-300 border-t-white ${size}`}
  ></div>
);

// --- NEW: role options by hiring type ---
const ROLE_OPTIONS = {
  specialized: [
    "Registered Nurse",
    "Marketing Manager",
    "HR specialist",
    "Lab Technician",
  ],
  commodity: [
    "Home Health Aide",
    "Certified Nursing Assistant",
    "Restaurant worker",
  ],
};

// --- NEW: map hiringType -> complexity ---
const COMPLEXITY_BY_TYPE = {
  specialized: "high",
  commodity: "low",
};

export default function JobPostingModal() {
  const navigate = useNavigate();
  const [jobUrl, setJobUrl] = useState("");
  const [, setJobDescription] = useState("");
  const [stepCount, setStepCount] = useState(1);

  // --- CHANGED: replace selectedCategory init with safe default later
  const [selectedCategory, setSelectedCategory] = useState("");

  const [customKeyword, setCustomKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  // --- CHANGED: unify modal flow with hiringType + single "form" step ---
  const [step, setStep] = useState("choose"); // "choose" | "form"
  const [hiringType, setHiringType] = useState(""); // "" | "specialized" | "commodity"

  const closeDialog = () => {
    setDialogOpen(false);
    setStep("choose");
    setHiringType("");
    setStepCount(1);
    setSelectedPosition("");
    setJobUrl("");
    setCampaignName("");
    setCategories([]);
    setKeywords([]);
    setSelectedCategory("");
  };

  useEffect(() => {
    const openModalAtStep = localStorage.getItem("openModalAtStep");
    if (openModalAtStep) {
      setDialogOpen(true);
      setStepCount(parseInt(openModalAtStep, 10));
      localStorage.removeItem("openModalAtStep");

      const savedCategoriesData = localStorage.getItem("questionnaireCategories");
      if (savedCategoriesData) {
        try {
          const parsedData = JSON.parse(savedCategoriesData);
          setCategories(parsedData.categories || []);
          setKeywords(parsedData.keywords || []);
          setJobUrl(parsedData.jobDescription || "");
          setCampaignName(parsedData.campaignName || "");
          setSelectedPosition(parsedData.selectedPosition || "");
          // if resuming, default to specialized form unless specified
          setHiringType(parsedData.hiringType || "specialized");
          setStep("form");

          if (parsedData.categories && parsedData.categories.length > 0) {
            setSelectedCategory(parsedData.categories[0]);
          }
        } catch (error) {
          console.error("Error parsing saved categories data:", error);
        }
      }
    }
  }, []);

  // --- NEW: centralized click handler for hiring type ---
  const handleSelectHiringType = (type) => {
    setHiringType(type); // "specialized" or "commodity"
    setStep("form");
    setStepCount(1);
    setSelectedPosition("");
  };

  const handleAddCustom = () => {
    if (customKeyword.trim()) {
      const newKeyword = {
        category: "other",
        keyword: customKeyword.trim(),
        selected: true,
      };
      setKeywords((prev) => [...prev, newKeyword]);
      setCustomKeyword("");
    }
  };

  // --- CHANGED: accept complexity and forward to backend ---
  const fetchCategoriesFromBackend = async (jobDesc, complexity) => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found in localStorage");
        throw new Error("Access token not found");
      }

      const url = `https://lyncitapplications.xyz:8086/AI/ai_keywords`;

      const response = await axios({
        method: "POST",
        url,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Access-Control-Allow-Credentials": "true",
        },
        params: {
          jobDescription: jobDesc,
          categories: "skills,availability,preferences",
          complexity, 
        },
        // withCredentials: true,
      });

      const responseData = response.data;
      const uniqueCategories = [...new Set(responseData.map((item) => item.category))];
      const keywordsWithSelection = responseData.map((k) => ({ ...k, selected: true }));

      return {
        categories: uniqueCategories,
        keywords: keywordsWithSelection,
      };
    } catch (error) {
      console.error("Error fetching categories from backend:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobDescriptionInput = () => {
    setJobDescription(jobUrl);
  };

  const handleNextStep = async () => {
    handleJobDescriptionInput();
    const complexity = COMPLEXITY_BY_TYPE[hiringType] || "low";

    console.log("Fetching categories with complexity:", complexity);

    if (jobUrl.trim()) {
      const backendData = await fetchCategoriesFromBackend(jobUrl, complexity);
      if (backendData) {
        setCategories(backendData.categories);
        setKeywords(backendData.keywords);
        setSelectedCategory(backendData.categories?.[0] || "");
        setStepCount(2);
      } else {
        alert("Failed to fetch keywords from backend. Please try again.");
      }
    }
  };

  const toggleKeywordSelection = (keyword) => {
    setKeywords((prevKeywords) =>
      prevKeywords.map((kw) =>
        kw.keyword === keyword ? { ...kw, selected: !kw.selected } : kw
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const complexity = COMPLEXITY_BY_TYPE[hiringType] || "low";

      localStorage.setItem(
        "questionnaireCategories",
        JSON.stringify({
          categories,
          keywords,
          jobDescription: jobUrl,
          campaignName,
          selectedPosition,
          hiringType, // --- NEW (persist)
          complexity, // --- NEW (persist)
        })
      );

      const selectedKeywords = keywords
        .filter((kw) => kw.selected)
        .map((kw) => kw.keyword)
        .join(",");

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found in localStorage");
        throw new Error("Access token not found");
      }

      const url = `https://lyncitapplications.xyz:8086/AI/ai_questionnaire`;

      console.log("Sending questionnaire request with:", {
        jobDescription: jobUrl,
        keywords: selectedKeywords,
        complexity,
      });

      const response = await axios({
        method: "POST",
        url,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Access-Control-Allow-Credentials": "true",
        },
        params: {
          jobDescription: jobUrl,
          keywords: selectedKeywords,
          complexity, 
        },
        // withCredentials: true,
      });

      console.log("Questionnaire API response:", response.data);

      localStorage.removeItem("questionnaire");
      localStorage.setItem("questionnaire", JSON.stringify(response.data));

      navigate("/question");
    } catch (error) {
      console.error("Error generating questionnaire:", error);
      alert(
        "Failed to generate questionnaire. Please try again. Error: " +
          (error.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: derive role options for current hiringType ---
  const roleOptions = hiringType ? ROLE_OPTIONS[hiringType] : [];

  // --- NEW: dynamic titles based on hiringType ---
  const titleByStep = () => {
    if (step === "choose") return "Choose Hiring Type";
    if (stepCount === 1)
      return hiringType === "specialized"
        ? "Use Lyncit AI to create job posting — Specialized"
        : "Use Lyncit AI to create job posting — High Volume";
    return "Suggested Keywords";
  };

  return (
    <div className="flex justify-center items-center z-30">
      <Dialog.Root
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!isLoading) {
            setDialogOpen(open);
            if (!open) setStep("choose");
          }
        }}
      >
        <Dialog.Trigger asChild>
          <button
            className="flex justify-center items-center rounded-b-[32px] gap-2 w-full bg-[#3d3d4e] text-white py-6 hover:bg-gray-700"
            onClick={() => setDialogOpen(true)}
          >
            Design a campaign
            {/* …icon… */}
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl z-50 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-[22px] font-semibold text-gray-900">
                  {titleByStep()}
                </h1>
              </div>

              <Dialog.Close asChild>
                <button
                  onClick={() => {
                    if (step === "form" && stepCount === 1) {
                      setStepCount(1);
                    } else if (step === "choose") {
                      closeDialog();
                    } else {
                      closeDialog();
                    }
                  }}
                  disabled={isLoading}
                  className={`${
                    isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                  } p-1 rounded transition-colors`}
                  title={
                    isLoading
                      ? "Please wait while generating questionnaire..."
                      : "Close"
                  }
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* STEP 1: chooser */}
            {step === "choose" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Specialized */}
                <div className="border border-gray-200 hover:border-gray-300 rounded-2xl p-6 flex flex-col justify-between transition-all">
                  <div className="flex items-start gap-3">
                    <img src={brain} alt="brainIcon" className="w-10 h-10 mt-2" />
                    <h3 className="text-2xl font-medium text-gray-800 leading-snug">
                      Hire for a Specialized Role
                    </h3>
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
                    className="mt-6 bg-[#0D0C22] text-white font-medium rounded-xl text-lg py-2.5 w-full hover:bg-[#353536] transition-colors"
                    onClick={() => handleSelectHiringType("specialized")} // --- CHANGED
                  >
                    Select Specialized Role
                  </button>
                </div>

                {/* High Volume */}
                <div className="border border-gray-200 hover:border-gray-300 rounded-2xl p-6 flex flex-col justify-between transition-all">
                  <div className="flex items-start gap-3">
                    <img src={bolt} alt="boltIcon" className="w-10 h-10 mt-2" />
                    <h3 className="text-2xl font-medium text-gray-800 leading-snug">
                      Hire for High Volume Hiring
                    </h3>
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
                    className="mt-6 bg-[#0D0C22] text-white font-medium rounded-xl text-lg py-2.5 w-full hover:bg-[#353536] transition-colors"
                    onClick={() => handleSelectHiringType("commodity")} // --- CHANGED
                  >
                    Select High Volume Role
                  </button>
                </div>
              </div>
            )}

            {/* UNIFIED FORM for both hiring types */}
            {step === "form" && (
              <div className="grid grid-cols-1 gap-5">
                {stepCount === 1 && (
                  <>
                    <select
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className="w-full h-10 mt-6 mb-4 p-3 border rounded-lg bg-white text-[12px] font-medium appearance-none focus:outline-none focus:border-gray-200 transition duration-150 ease-in-out"
                      style={{
                        background: `url("data:image/svg+xml,%3Csvg width='16' height='16' fill='none' stroke='%230D0C22' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-down' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l4 4 4-4'/%3E%3C/svg%3E") no-repeat right 1rem center/1.25rem 1.25rem, white`,
                      }}
                    >
                      <option value="">Select a role</option>
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>

                    <input
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Enter a campaign Name"
                      className="w-full h-10 mt-2 mb-4 p-3 border rounded-lg text-[12px]"
                    />

                    <label className="block mt-0 text-sm text-[#0D0C22] font-medium">
                      Paste the Job Description
                    </label>
                    <textarea
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      placeholder="We are seeking a compassionate and reliable Healthcare Assistant to join our team. In this role...."
                      className="w-full h-20 mt-2 mb-4 p-3 border rounded-lg text-[12px]"
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
                        onClick={handleNextStep}
                        disabled={!jobUrl.trim() || !campaignName.trim() || !selectedPosition || isLoading}
                        className="bg-[#0D0C22] text-white text-sm font-semibold px-10 py-4 rounded-full disabled:opacity-50"
                      >
                        {isLoading ? <Spinner size="w-4 h-4" /> : "Next"}
                      </button>
                    </div>
                  </>
                )}

                {stepCount === 2 && (
                  <>
                    {isLoading && (
                      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 rounded-[17px]">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#825C9A] mx-auto mb-4"></div>
                          <p className="text-[#0D0C22] font-medium">
                            Generating Lyncit AI Questionnaire
                          </p>
                          <p className="text-[#637083] text-sm mt-2">
                            Please wait, this process cannot be interrupted
                          </p>
                        </div>
                      </div>
                    )}

                    <p className="text-[#637083] mt-4">
                      Keywords based on the job posting to create the screening questions
                    </p>

                    {/* Desktop View - Categories and Keywords */}
                    <div className="mt-12 gap-4 border-b sm:flex hidden">
                      <div className="flex gap-6 overflow-x-scroll">
                        {categories.map((category) => (
                          <span
                            key={category}
                            className={`cursor-pointer py-6 ${
                              selectedCategory === category
                                ? "text-[#825C9A] font-bold border-b border-[#825C9A]"
                                : "text-[#0D0C22] font-medium "
                            }`}
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </span>
                        ))}
                        <div
                          className={`cursor-pointer min-w-[170px] py-6 font-medium ${
                            selectedCategory === "Add an option"
                              ? "text-white border-b font-semibold border-[#825C9A]"
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
                            {/* plus icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Add an option
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 sm:block hidden sm:max-h-[250px] overflow-y-auto">
                      {keywords
                        .filter((kw) => kw.category === selectedCategory)
                        .map((keywordData) => (
                          <button
                            key={keywordData.keyword}
                            className={`flex justify-between items-center gap-2 border border-[#BFBFBF] text-[#637083] text-sm rounded-full px-3 py-2 ${
                              keywordData.selected ? "bg-black text-white font-bold" : "font-semibold"
                            }`}
                            onClick={() => toggleKeywordSelection(keywordData.keyword)}
                          >
                            {keywordData.keyword}
                            <span className="text-white">
                              {keywordData.selected ? (
                                <svg className="text-white" width="10" height="10" viewBox="0 0 13 13" fill="none">
                                  <path
                                    d="M11.9844 1.01562L1.01562 11.9844M1.01562 1.01562L11.9844 11.9844"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 23 20" fill="none">
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

                    {/* Mobile View */}
                    <div className="mt-6 flex flex-col space-y-6 sm:hidden max-h-[350px] overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category} className="space-y-3">
                          <h3 className="font-bold text-[#0D0C22] text-base">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {keywords
                              .filter((kw) => kw.category === category)
                              .map((keywordData) => (
                                <button
                                  key={keywordData.keyword}
                                  className={`flex justify-between items-center gap-1 border border-[#BFBFBF] text-[#637083] text-sm rounded-full px-3 py-2 ${
                                    keywordData.selected ? "border-black font-bold" : "font-semibold"
                                  }`}
                                  onClick={() => toggleKeywordSelection(keywordData.keyword)}
                                >
                                  {keywordData.keyword}
                                  <span>
                                    {keywordData.selected ? (
                                      "✔"
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 23 20" fill="none">
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

                      {/* Custom Keywords Section for Mobile */}
                      <div className="pt-4 border-t">
                        <h3 className="font-bold text-[#825C9A] text-base mb-3">Add an option</h3>
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2 border rounded-[32px] overflow-hidden w-full">
                            <input
                              type="text"
                              value={customKeyword}
                              onChange={(e) => setCustomKeyword(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                              placeholder="Add a Keyword"
                              className="pl-3 py-2 text-sm placeholder-[#637083] text-[#637083] font-semibold focus:outline-none flex-grow"
                            />
                            <button onClick={handleAddCustom} className="pr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 23 20" fill="none">
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

                          <div className="flex flex-wrap gap-2">
                            {keywords
                              .filter((kw) => kw.category === "other")
                              .map((customKeywordData) => (
                                <button
                                  key={customKeywordData.keyword}
                                  className={`flex justify-between items-center gap-2 border border-[#BFBFBF] text-[#637083] text-sm rounded-full px-3 py-2 ${
                                    customKeywordData.selected ? "border-black font-bold" : "font-semibold"
                                  }`}
                                  onClick={() => toggleKeywordSelection(customKeywordData.keyword)}
                                >
                                  {customKeywordData.keyword}
                                  <span>{customKeywordData.selected ? "✖" : "+"}</span>
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedCategory === "Add an option" && (
                      <div className="sm:block hidden">
                        <div className="flex gap-2 border rounded-[32px] overflow-hidden w-fit">
                          <input
                            type="text"
                            value={customKeyword}
                            onChange={(e) => setCustomKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                            placeholder="Add a Keyword"
                            className="pl-3 py-2 text-sm placeholder-[#637083] text-[#637083] font-semibold focus:outline-none"
                            style={{ width: `${Math.max(120, customKeyword.length * 10)}px` }}
                          />
                          <button onClick={handleAddCustom} className="text-white rounded-lg pr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 23 20" fill="none">
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

                        <div className="flex flex-col gap-2 mt-3">
                          {keywords
                            .filter((kw) => kw.category === "other")
                            .map((customKeywordData) => (
                              <button
                                key={customKeywordData.keyword}
                                className={`flex justify-between items-center w-fit gap-2 border border-[#BFBFBF] text-[#637083] text-sm font-semibold rounded-full px-3 py-2 ${
                                  customKeywordData.selected ? "bg-black text-white" : ""
                                }`}
                                onClick={() => toggleKeywordSelection(customKeywordData.keyword)}
                              >
                                {customKeywordData.keyword}
                                <span>{customKeywordData.selected ? "✖" : "+"}</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-8">
                      <button
                        onClick={() => setStepCount(1)}
                        disabled={isLoading}
                        className={`text-[#637083] text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                        }`}
                      >
                        ← Back
                      </button>

                      <div className="flex items-center gap-4">
                        <span className="text-[#637083] text-sm font-semibold">Step 2 of 2</span>
                        <button
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="bg-[#0D0C22] text-white text-sm font-semibold px-10 py-4 rounded-full disabled:opacity-50"
                        >
                          {isLoading ? <Spinner size="w-4 h-4" /> : "Next"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
