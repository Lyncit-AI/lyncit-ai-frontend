import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { ArrowLeft } from "lucide-react";
import ScheduleModal from "../components/ui/ScheduleModal";

const Upload = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState("");
  const [fileError, setFileError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isValidFileType = (file) => {
    const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "text/csv", // .csv
      "application/json", // .json
      "text/plain" // .txt
    ];

    const extension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["xlsx", "xls", "doc", "docx", "csv", "json"];

    return (
      allowedTypes.includes(file.type) || allowedExtensions.includes(extension)
    );
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (isValidFileType(file)) {
        const previewURL = URL.createObjectURL(file);
        setUploadedFile({ file, previewURL });
        setFileError(false);
      } else {
        setUploadedFile("");
        setFileError(true);
      }
    }
  }, []);

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isValidFileType(file)) {
        const previewURL = URL.createObjectURL(file);
        setUploadedFile({ file, previewURL });
        setFileError(false);
      } else {
        setUploadedFile("");
        setFileError(true);
      }
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleNext = () => {
    setIsModalOpen(true);
  };

  const handleModalDone = (modalData) => {
    setIsModalOpen(false);
    console.log("Modal data:", modalData);
    navigate("/congratulation");
  };

  const handleback = () => {
    navigate("/question");
  };

  const renderFilePreview = () => {
    if (!uploadedFile) return null;

    const iconSvg = (
      <svg
        width="41"
        height="41"
        viewBox="0 0 41 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.834 27.1667L20.5007 20.5M20.5007 20.5L27.1673 27.1667M20.5007 20.5V35.5M33.834 28.4047C35.8698 26.7234 37.1673 24.1799 37.1673 21.3333C37.1673 16.2707 33.0633 12.1667 28.0007 12.1667C27.6365 12.1667 27.2958 11.9767 27.1109 11.6629C24.9374 7.97473 20.9247 5.5 16.334 5.5C9.43043 5.5 3.83398 11.0964 3.83398 18C3.83398 21.4435 5.2264 24.5618 7.4789 26.8226"
          stroke="#289A6A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    return (
      <div className="flex flex-col items-center gap-4">
        {iconSvg}
        <p className="text-[#289A6A] font-semibold">Success</p>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-cente py-8 px-8 gap-4">
        <button
          onClick={handleback}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
      <div className="px-[82px] max-sm:px-8">
        <h2 className="text-2xl font-semibold mb-8 max-sm:hidden">
          Campaign &nbsp; &nbsp;
          <span className="text-base text-[#637083] font-normal">
            http://app/userbraintrust.com/jobs/11450?utm/
          </span>
        </h2>

        <div className="max-w-[615px] border border-[#EAEAEA] rounded-[32px] p-8 text-start">
          <h2 className="text-2xl font-semibold mb-2 max-sm:text-xl max-sm:font-medium">
            Ready to Upload?
          </h2>
          <p
            className={`${
              fileError
                ? "text-[#D32F2F]"
                : uploadedFile
                  ? "text-[#289A6A]"
                  : "text-[#637083]"
            } mb-8`}
          >
            {fileError
              ? "There was an error uploading the file. Please try again."
              : uploadedFile
                ? "File Uploaded Successfully"
                : "Drop your file here and let the magic unfold."}
          </p>

          <div
            className={`border-2 border-dashed ${
              fileError
                ? "border-[#D32F2F]"
                : uploadedFile
                  ? "border-[#289A6A]"
                  : "border-[#BFBFBF]"
            } rounded-[12px] px-6 py-12 cursor-pointer`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {uploadedFile ? (
              renderFilePreview()
            ) : (
              <div className="flex flex-col justify-center items-center">
                <div className="mb-3">
                  <svg
                    width="41"
                    height="41"
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.834 27.1667L20.5007 20.5M20.5007 20.5L27.1673 27.1667M20.5007 20.5V35.5M33.834 28.4047C35.8698 26.7234 37.1673 24.1799 37.1673 21.3333C37.1673 16.2707 33.0633 12.1667 28.0007 12.1667C27.6365 12.1667 27.2958 11.9767 27.1109 11.6629C24.9374 7.97473 20.9247 5.5 16.334 5.5C9.43043 5.5 3.83398 11.0964 3.83398 18C3.83398 21.4435 5.2264 24.5618 7.4789 26.8226"
                      stroke="#637083"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="text-[#637083]">
                  <span
                    className={`${fileError ? "text-[#D32F2F]" : "text-[#825C9A]"} font-semibold`}
                  >
                    Click to upload
                  </span>{" "}
                  &amp; or drag and drop
                </p>
                <p className="text-[#637083]">
                  Excel, Word, CSV, or JSON files
                </p>
              </div>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
            accept=".xlsx,.xls,.doc,.docx,.csv,.json"
          />
        </div>
        {uploadedFile && (
          <div className="flex gap-2 p-3 my-8">
            <p className="text-sm text-[#D32F2F]">
              Five people in the DNC list have been Removed.
            </p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 14V10.5M12 7H12.01M9.9 19.2L11.36 21.1467C11.5771 21.4362 11.6857 21.5809 11.8188 21.6327C11.9353 21.678 12.0647 21.678 12.1812 21.6327C12.3143 21.5809 12.4229 21.4362 12.64 21.1467L14.1 19.2C14.3931 18.8091 14.5397 18.6137 14.7185 18.4645C14.9569 18.2656 15.2383 18.1248 15.5405 18.0535C15.7671 18 16.0114 18 16.5 18C17.8978 18 18.5967 18 19.1481 17.7716C19.8831 17.4672 20.4672 16.8831 20.7716 16.1481C21 15.5967 21 14.8978 21 13.5V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V13.5C3 14.8978 3 15.5967 3.22836 16.1481C3.53284 16.8831 4.11687 17.4672 4.85195 17.7716C5.40326 18 6.10218 18 7.5 18C7.98858 18 8.23287 18 8.45951 18.0535C8.76169 18.1248 9.04312 18.2656 9.2815 18.4645C9.46028 18.6137 9.60685 18.8091 9.9 19.2Z"
                stroke="#D32F2F"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        )}
        <div className="mt-8 max-w-[615px] flex justify-end">
          <button
            className="px-24 py-4 bg-black text-white font-semibold max-sm:w-full rounded-full"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ScheduleModal
          onClose={() => setIsModalOpen(false)}
          onDone={handleModalDone}
        />
      )}
    </DashboardLayout>
  );
};

export default Upload;
