import React from "react";
import { Card } from "./ui/card";
import { DraggableQuestion } from "./DragableQuestion";
import { Button } from "./ui/button";
import { Download, Upload } from "lucide-react";

export function Sidebar({ onExport, onImport, fileInputRef }) {
  return (
    <Card className="w-full bg-[rgb(13,12,34)] rounded-[16px] p-4 lg:p-6 lg:mr-14 max-lg:mr-4 lg:flex lg:flex-col lg:h-fit">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <h2 className="font-semibold mb-4 text-lg text-white text-center">
          Drag and Drop Questions
        </h2>
        <hr className="mb-6 text-[#EAEAEA]" />

        <div className="flex gap-2 mb-6">
          <Button 
            onClick={onExport}
            variant="outline" 
            className="flex items-center gap-2 bg-transparent text-white border border-white hover:bg-[rgba(255,255,255,0.1)] hover:text-white w-full"
          >
            <Download size={16} />
            Export
          </Button>
          <Button 
            onClick={onImport}
            variant="outline" 
            className="flex items-center gap-2 bg-transparent text-white border border-white hover:bg-[rgba(255,255,255,0.1)] hover:text-white w-full"
          >
            <Upload size={16} />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
          />
        </div>

        <div className="mb-4">
          <div className="space-y-3">
            <div className="bg-[#FDFDFD] rounded-lg">
              <DraggableQuestion
                question={{
                  id: "new_options",
                  type: "options",
                  title: "Options Based Question",
                  options: [
                    { id: "opt1", text: "Option 1" },
                    { id: "opt2", text: "Option 2" },
                    { id: "opt3", text: "Option 3" },
                    { id: "opt4", text: "Option 4" }
                  ]
                }}
                className="flex items-start hover:bg-transparent"
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.2879 6.75H4.125C3.08947 6.75 2.25 5.91053 2.25 4.875C2.25 3.83947 3.08947 3 4.125 3H11.2879M6.71212 15H13.875C14.9105 15 15.75 14.1605 15.75 13.125C15.75 12.0895 14.9105 11.25 13.875 11.25H6.71212M2.25 13.125C2.25 14.5747 3.42525 15.75 4.875 15.75C6.32475 15.75 7.5 14.5747 7.5 13.125C7.5 11.6753 6.32475 10.5 4.875 10.5C3.42525 10.5 2.25 11.6753 2.25 13.125ZM15.75 4.875C15.75 6.32475 14.5747 7.5 13.125 7.5C11.6753 7.5 10.5 6.32475 10.5 4.875C10.5 3.42525 11.6753 2.25 13.125 2.25C14.5747 2.25 15.75 3.42525 15.75 4.875Z"
                      stroke="#3D3D4E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
            <div className="bg-[#FDFDFD] rounded-lg">
              <DraggableQuestion
                question={{
                  id: "new_text",
                  type: "text",
                  title: "Text Based Question"
                }}
                className="flex items-start hover:bg-transparent"
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 5.25C3 4.55109 3 4.20163 3.11418 3.92597C3.26642 3.55843 3.55843 3.26642 3.92597 3.11418C4.20163 3 4.55109 3 5.25 3H12.75C13.4489 3 13.7984 3 14.074 3.11418C14.4416 3.26642 14.7336 3.55843 14.8858 3.92597C15 4.20163 15 4.55109 15 5.25M6.75 15H11.25M9 3V15"
                      stroke="#3D3D4E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>

            <div className="bg-[#FDFDFD] rounded-lg">
              <DraggableQuestion
                question={{
                  id: "new_end",
                  type: "end",
                  title: "End"
                }}
                className="flex items-start hover:bg-transparent"
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.125 11.25V6.75M10.875 11.25V6.75M5.85 15.75H12.15C13.4101 15.75 14.0402 15.75 14.5215 15.5048C14.9448 15.289 15.289 14.9448 15.5048 14.5215C15.75 14.0402 15.75 13.4101 15.75 12.15V5.85C15.75 4.58988 15.75 3.95982 15.5048 3.47852C15.289 3.05516 14.9448 2.71095 14.5215 2.49524C14.0402 2.25 13.4101 2.25 12.15 2.25H5.85C4.58988 2.25 3.95982 2.25 3.47852 2.49524C3.05516 2.71095 2.71095 3.05516 2.49524 3.47852C2.25 3.95982 2.25 4.58988 2.25 5.85V12.15C2.25 13.4101 2.25 14.0402 2.49524 14.5215C2.71095 14.9448 3.05516 15.289 3.47852 15.5048C3.95982 15.75 4.58988 15.75 5.85 15.75Z"
                      stroke="#3D3D4E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-4 mb-14 pt-3 border-t border-[#EAEAEA]">
          <div className="flex justify-end">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.08997 8.99999C9.32507 8.33166 9.78912 7.7681 10.3999 7.40912C11.0107 7.05015 11.7289 6.91893 12.4271 7.0387C13.1254 7.15848 13.7588 7.52151 14.215 8.06352C14.6713 8.60552 14.921 9.29151 14.92 9.99999C14.92 12 11.92 13 11.92 13M12 17H12.01M2 8.52274V15.4773C2 15.7218 2 15.8441 2.02763 15.9592C2.05213 16.0613 2.09253 16.1588 2.14736 16.2483C2.2092 16.3492 2.29568 16.4357 2.46863 16.6086L7.39137 21.5314C7.56432 21.7043 7.6508 21.7908 7.75172 21.8526C7.84119 21.9075 7.93873 21.9479 8.04077 21.9724C8.15586 22 8.27815 22 8.52274 22H15.4773C15.7218 22 15.8441 22 15.9592 21.9724C16.0613 21.9479 16.1588 21.9075 16.2483 21.8526C16.3492 21.7908 16.4357 21.7043 16.6086 21.5314L21.5314 16.6086C21.7043 16.4357 21.7908 16.3492 21.8526 16.2483C21.9075 16.1588 21.9479 16.0613 21.9724 15.9592C22 15.8441 22 15.7218 22 15.4773V8.52274C22 8.27815 22 8.15586 21.9724 8.04077C21.9479 7.93873 21.9075 7.84119 21.8526 7.75172C21.7908 7.6508 21.7043 7.56432 21.5314 7.39137L16.6086 2.46863C16.4357 2.29568 16.3492 2.2092 16.2483 2.14736C16.1588 2.09253 16.0613 2.05213 15.9592 2.02763C15.8441 2 15.7218 2 15.4773 2H8.52274C8.27815 2 8.15586 2 8.04077 2.02763C7.93873 2.05213 7.84119 2.09253 7.75172 2.14736C7.6508 2.2092 7.56432 2.29568 7.39137 2.46863L2.46863 7.39137C2.29568 7.56432 2.2092 7.6508 2.14736 7.75172C2.09253 7.84119 2.05213 7.93873 2.02763 8.04077C2 8.15586 2 8.27815 2 8.52274Z"
                stroke="#FDFDFD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-[#FDFDFD]">
            Drag, Drop and connect your question with simply picking up the
            question type and connecting it with the releavant response.
          </div>
        </div>
      </div>

      {/* Mobile Layout - Horizontal Toolbar */}
      <div className="lg:hidden">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg text-white">
              Drag and Drop Questions
            </h2>
            <div className="flex gap-2">
              <Button 
                onClick={onExport}
                variant="outline" 
                className="flex items-center gap-2 bg-transparent text-white border border-white hover:bg-[rgba(255,255,255,0.1)] hover:text-white px-3 py-2"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button 
                onClick={onImport}
                variant="outline" 
                className="flex items-center gap-2 bg-transparent text-white border border-white hover:bg-[rgba(255,255,255,0.1)] hover:text-white px-3 py-2"
              >
                <Upload size={16} />
                <span className="hidden sm:inline">Import</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          {/* Question Types - Horizontal */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            <div className="bg-[#FDFDFD] rounded-lg flex-shrink-0">
              <DraggableQuestion
                question={{
                  id: "new_options",
                  type: "options",
                  title: "Options Based Question",
                  options: [
                    { id: "opt1", text: "Option 1" },
                    { id: "opt2", text: "Option 2" },
                    { id: "opt3", text: "Option 3" },
                    { id: "opt4", text: "Option 4" }
                  ]
                }}
                className="flex items-start hover:bg-transparent"
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.2879 6.75H4.125C3.08947 6.75 2.25 5.91053 2.25 4.875C2.25 3.83947 3.08947 3 4.125 3H11.2879M6.71212 15H13.875C14.9105 15 15.75 14.1605 15.75 13.125C15.75 12.0895 14.9105 11.25 13.875 11.25H6.71212M2.25 13.125C2.25 14.5747 3.42525 15.75 4.875 15.75C6.32475 15.75 7.5 14.5747 7.5 13.125C7.5 11.6753 6.32475 10.5 4.875 10.5C3.42525 10.5 2.25 11.6753 2.25 13.125ZM15.75 4.875C15.75 6.32475 14.5747 7.5 13.125 7.5C11.6753 7.5 10.5 6.32475 10.5 4.875C10.5 3.42525 11.6753 2.25 13.125 2.25C14.5747 2.25 15.75 3.42525 15.75 4.875Z"
                      stroke="#3D3D4E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
            <div className="bg-[#FDFDFD] rounded-lg flex-shrink-0">
              <DraggableQuestion
                question={{
                  id: "new_text",
                  type: "text",
                  title: "Text Based Question"
                }}
                className="flex items-start hover:bg-transparent"
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 5.25C3 4.55109 3 4.20163 3.11418 3.92597C3.26642 3.55843 3.55843 3.26642 3.92597 3.11418C4.20163 3 4.55109 3 5.25 3H12.75C13.4489 3 13.7984 3 14.074 3.11418C14.4416 3.26642 14.7336 3.55843 14.8858 3.92597C15 4.20163 15 4.55109 15 5.25M6.75 15H11.25M9 3V15"
                      stroke="#3D3D4E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
            <div className="bg-[#FDFDFD] rounded-lg flex-shrink-0">
              <DraggableQuestion
                question={{
                  id: "new_end",
                  type: "end",
                  title: "End"
                }}
                className="flex items-start hover:bg-transparent"
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.125 11.25V6.75M10.875 11.25V6.75M5.85 15.75H12.15C13.4101 15.75 14.0402 15.75 14.5215 15.5048C14.9448 15.289 15.289 14.9448 15.5048 14.5215C15.75 14.0402 15.75 13.4101 15.75 12.15V5.85C15.75 4.58988 15.75 3.95982 15.5048 3.47852C15.289 3.05516 14.9448 2.71095 14.5215 2.49524C14.0402 2.25 13.4101 2.25 12.15 2.25H5.85C4.58988 2.25 3.95982 2.25 3.47852 2.49524C3.05516 2.71095 2.71095 3.05516 2.49524 3.47852C2.25 3.95982 2.25 4.58988 2.25 5.85V12.15C2.25 13.4101 2.25 14.0402 2.49524 14.5215C2.71095 14.9448 3.05516 15.289 3.47852 15.5048C3.95982 15.75 4.58988 15.75 5.85 15.75Z"
                      stroke="#3D3D4E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}