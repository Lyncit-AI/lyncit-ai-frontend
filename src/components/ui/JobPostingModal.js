import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import axios from "axios";

const dummyData = {
  categories: ["skills", "availability", "preferences"],
  keywords: [
    { category: "skills", keyword: "home healthcare", selected: true },
    { category: "skills", keyword: "childcare", selected: false },
    { category: "skills", keyword: "disability care", selected: true },
    { category: "skills", keyword: "first aid", selected: true },
    { category: "skills", keyword: "medical training", selected: false },
    { category: "availability", keyword: "full time", selected: false },
    { category: "availability", keyword: "overnight care", selected: true },
    {
      category: "preferences",
      keyword: "comfortable with pets",
      selected: true
    },
    { category: "preferences", keyword: "non-smoker", selected: true }
  ]
};

export default function JobPostingModal() {
  const navigate = useNavigate();
  const [jobUrl, setJobUrl] = useState("");
  const [, setJobDescription] = useState("");
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customKeyword, setCustomKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const handleAddCustom = () => {
    if (customKeyword.trim()) {
      const newKeyword = {
        category: "other",
        keyword: customKeyword.trim(),
        selected: true
      };

      setKeywords((prevKeywords) => [...prevKeywords, newKeyword]);
      setCustomKeyword("");
    }
  };

  const fetchCategoriesFromBackend = async (jobDesc) => {
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
        url: url,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        params: { 
          jobDescription: jobDesc,
          categories: "skills,availability,preferences" 
        },
        withCredentials: true
      });

      const responseData = response.data;
      
      const uniqueCategories = [...new Set(responseData.map(item => item.category))];
      
      return { 
        categories: uniqueCategories, 
        keywords: responseData 
      };
    } catch (error) {
      console.error("Error fetching categories from backend:", error);
      return dummyData;
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobDescriptionInput = () => {
    setJobDescription(jobUrl);
  };

  const handleNextStep = async () => {
    handleJobDescriptionInput();

    if (jobUrl.trim()) {
      const backendData = await fetchCategoriesFromBackend(jobUrl);
      if (backendData) {
        setCategories(backendData.categories);
        setKeywords(backendData.keywords);
        if (backendData.categories && backendData.categories.length > 0) {
          setSelectedCategory(backendData.categories[0]);
        }
      }
    }

    setStep(2);
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
      
      const selectedKeywords = keywords
        .filter(kw => kw.selected)
        .map(kw => kw.keyword)
        .join(',');
        
      const accessToken = localStorage.getItem("accessToken");
  
      if (!accessToken) {
        console.error("Access token not found in localStorage");
        throw new Error("Access token not found");
      }
  
      const url = `https://lyncitapplications.xyz:8086/AI/ai_questionnaire`;
  
      console.log("Sending questionnaire request with:", {
        jobDescription: jobUrl,
        keywords: selectedKeywords
      });
  
      const response = await axios({
        method: "POST",
        url: url,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        params: { 
          jobDescription: jobUrl,
          keywords: selectedKeywords
        },
        withCredentials: true
      });
  
      console.log("Questionnaire API response:", response.data);
      
      localStorage.setItem('questionnaire', JSON.stringify(response.data));
      
      navigate("/question");
    } catch (error) {
      console.error("Error generating questionnaire:", error);
      alert("Failed to generate questionnaire. Please try again. Error: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
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
            className={`fixed top-1/2 left-1/2 max-w-[857px] max-sm:w-[315px] ${
              step === 1
                ? "lg:w-[615px] px-8"
                : "lg:w-[857px] px-24 max-md:px-12 max-sm:px-8"
            } bg-white py-12 rounded-[32px] shadow-lg -translate-x-1/2 -translate-y-1/2`}
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
                  Paste the Job Description
                </label>
                <textarea
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="We are seeking a compassionate and reliable Healthcare Assistant to join our team. In this role...."
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
                    onClick={handleNextStep}
                    disabled={!jobUrl.trim() || isLoading}
                    className="bg-[#0D0C22] text-white text-sm font-semibold px-10 py-4 rounded-full disabled:opacity-50"
                  >
                    {isLoading ? "Loading..." : "Next"}
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
                    {categories.map((category) => (
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
                    <div
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
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Add an option
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 max-sm:hidden sm:max-h-[250px] overflow-y-auto">
                  {keywords
                    .filter((kw) => kw.category === selectedCategory)
                    .map((keywordData) => (
                      <button
                        key={keywordData.keyword}
                        className={`flex justify-between items-center gap-2 border border-[#BFBFBF] text-[#637083] text-sm font-semibold rounded-full px-3 py-2 ${
                          keywordData.selected ? "border-black" : ""
                        }`}
                        onClick={() =>
                          toggleKeywordSelection(keywordData.keyword)
                        }
                      >
                        {keywordData.keyword}
                        <span>
                          {keywordData.selected ? (
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

                {selectedCategory === "Add an option" && (
                  <div>
                    <div className="flex gap-2 border rounded-[32px] overflow-hidden w-fit">
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

                    {keywords
                      .filter((kw) => kw.category === "other")
                      .map((customKeywordData) => (
                        <button
                          key={customKeywordData.keyword}
                          className={`flex justify-between items-center w-fit gap-2 border border-[#BFBFBF] text-[#637083] text-sm font-semibold rounded-full px-3 py-2 ${
                            customKeywordData.selected ? "border-black" : ""
                          }`}
                          onClick={() =>
                            toggleKeywordSelection(customKeywordData.keyword)
                          }
                        >
                          {customKeywordData.keyword}
                          <span>
                            {customKeywordData.selected ? (
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
                )}

                <div className="flex justify-end gap-4 items-center mt-8">
                  <span className="text-[#637083] text-sm font-semibold">
                    Step 2 of 2
                  </span>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-[#0D0C22] text-white text-sm font-semibold px-10 py-4 rounded-full disabled:opacity-50"
                  >
                    {isLoading ? "Generating..." : "Next"}
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