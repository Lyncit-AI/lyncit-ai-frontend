import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";

const campaigns = [
    {
      id: 1,
      name: "Campaign Name A",
      recipients: 1,
      createdOn: "Dec 8, 2024",
      status: "Completed",
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      name: "Campaign Name B",
      recipients: 2,
      createdOn: "Dec 8, 2024",
      status: "Incomplete",
      lastUpdated: "2 days ago"
    },
    {
      id: 3,
      name: "Campaign Name C",
      recipients: 1,
      createdOn: "Dec 8, 2024",
      status: "Archived",
      lastUpdated: "2 days ago"
    },
    {
      id: 4,
      name: "Campaign Name D",
      recipients: 1,
      createdOn: "Dec 8, 2024",
      status: "Completed",
      lastUpdated: "2 days ago"
    },
    {
      id: 5,
      name: "Campaign Name E",
      recipients: 2,
      createdOn: "Dec 8, 2024",
      status: "Incomplete",
      lastUpdated: "2 days ago"
    },
    {
      id: 6,
      name: "Campaign Name F",
      recipients: 1,
      createdOn: "Dec 8, 2024",
      status: "Archived",
      lastUpdated: "2 days ago"
    },
    {
      id: 7,
      name: "Special Spring Campaign",
      recipients: 3,
      createdOn: "Feb 12, 2025",
      status: "Completed",
      lastUpdated: "1 day ago"
    },
    {
      id: 8,
      name: "Winter End Campaign",
      recipients: 4,
      createdOn: "Jan 10, 2025",
      status: "Incomplete",
      lastUpdated: "5 days ago"
    }
  ];

  const CampaignTable = () => {
    const navigate = useNavigate();
  
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
  
    const filteredCampaigns = useMemo(() => {
      return campaigns.filter((campaign) =>
        campaign.name.toLowerCase().includes(search.toLowerCase())
      );
    }, [search, campaigns]);
  
    const paginatedCampaigns = useMemo(() => {
      const start = (page - 1) * itemsPerPage;
      return filteredCampaigns.slice(start, start + itemsPerPage);
    }, [filteredCampaigns, page]);
  
    const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / itemsPerPage));
  
    const getStatusClasses = (status) => {
      switch (status) {
        case "Completed":
          return "bg-[#EAF5F0] border border-[#289A6A] text-[#289A6A]";
        case "Incomplete":
          return "bg-[#FBEAEA] border border-[#D32F2F] text-[#D32F2F]";
        case "Archived":
          return "bg-[#FBEAEA] border border-[#D32F2F] text-[#D32F2F]";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };
  
    const handleback = () => {
      navigate("/app");
    };
  
    const handleSearchChange = (e) => {
      setSearch(e.target.value);
      setPage(1);
    };
  
    const handlePageClick = (newPage) => {
      if (newPage < 1 || newPage > totalPages) return;
      setPage(newPage);
    };
  
    const handleViewClick = (id) => {
      navigate(`/question?id=${id}`);
    };
  
    const handleInitiateClick = (id) => {
      navigate(`/upload?id=${id}`);
    };
  
    const renderPagination = () => {
      if (totalPages <= 1) return null;
  
      let pages = [];
  
      pages.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className={`px-3 py-1 rounded-md ${page === 1 ? "font-semibold" : ""}`}
        >
          1
        </button>
      );
  
      if (page > 3 && totalPages > 3) {
        pages.push(
          <span key="start-ellipsis" className="px-2 text-gray-500">...</span>
        );
      }
  
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);
  
      if (totalPages <= 3) {
        startPage = 2;
        endPage = totalPages - 1;
      }
  
      for (let i = startPage; i <= endPage; i++) {
        if (i === 1 || i === totalPages) continue;
        pages.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`px-3 py-1 rounded-md ${page === i ? "font-semibold" : ""}`}
          >
            {i}
          </button>
        );
      }
  
      if (page < totalPages - 2 && totalPages > 3) {
        pages.push(
          <span key="end-ellipsis" className="px-2 text-gray-500">...</span>
        );
      }
  
      if (totalPages > 1) {
        pages.push(
          <button
            key={totalPages}
            onClick={() => handlePageClick(totalPages)}
            className={`px-3 py-1 rounded-md ${page === totalPages ? "font-semibold" : ""}`}
          >
            {totalPages}
          </button>
        );
      }
  
      return (
        <div className="flex justify-end items-center mt-8 mb-[82px] space-x-2 text-sm">
          <button
            onClick={() => handlePageClick(page - 1)}
            disabled={page === 1}
            className={`flex items-center px-2 py-1 rounded-md ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ChevronLeft size={24} />
          </button>
          {pages}
          <button
            onClick={() => handlePageClick(page + 1)}
            disabled={page === totalPages}
            className={`flex items-center px-2 py-1 rounded-md ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      );
    };
  
    return (
      <DashboardLayout>
        <div className="max-w-[1005px] px-8">
          <div className="flex flex-col gap-8 mb-8">
            <button
              onClick={handleback}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              <ArrowLeft size={16} />
              Back
            </button>
  
            <div className="relative max-w-[400px] -z-0">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                className="w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search"
              />
              <svg
                className="absolute left-2 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.873-4.873m0 0a7.5 7.5 0 10-10.606-10.606 
                   7.5 7.5 0 0010.606 10.606z"
                />
              </svg>
            </div>
          </div>
          <div className="overflow-x-auto rounded-md border-b border-[#EAEAEA]">
            <table className="min-w-full text-sm">
              <thead className="border-b border-[#EAEAEA]">
                <tr>
                  <th className="p-6 text-left font-medium">Campaign Name</th>
                  <th className="p-6 text-left font-medium">Created On</th>
                  <th className="p-6 text-left font-medium">Status</th>
                  <th className="p-6 text-left font-medium">Details</th>
                  <th className="p-6 text-left font-mediu"></th>
                </tr>
              </thead>
              <tbody className="">
                {paginatedCampaigns.length > 0 ? (
                  paginatedCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-[#EAEAEA]">
                      <td className="p-6">
                        <div className="text-xs text-[#637083]">
                          {campaign.name}
                        </div>
                        <div className="flex max-md:flex-col gap-3 items-center pt-1">
                          <div>
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.5 15.75V14.25C16.5 12.8521 15.5439 11.6775 14.25 11.3445M11.625 2.46807C12.7244 2.91311 13.5 3.99098 13.5 5.25C13.5 6.50902 12.7244 7.58689 11.625 8.03193M12.75 15.75C12.75 14.3522 12.75 13.6533 12.5216 13.1019C12.2172 12.3669 11.6331 11.7828 10.8981 11.4784C10.3467 11.25 9.64783 11.25 8.25 11.25H6C4.60218 11.25 3.90326 11.25 3.35195 11.4784C2.61687 11.7828 2.03284 12.3669 1.72836 13.1019C1.5 13.6533 1.5 14.3522 1.5 15.75M10.125 5.25C10.125 6.90685 8.78185 8.25 7.125 8.25C5.46815 8.25 4.125 6.90685 4.125 5.25C4.125 3.59315 5.46815 2.25 7.125 2.25C8.78185 2.25 10.125 3.59315 10.125 5.25Z"
                                stroke="#637083"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="text-xs text-[#637083]">
                            {campaign.recipients} Recipient
                            {campaign.recipients > 1 ? "s" : ""}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-xs text-[#637083]">
                          {campaign.createdOn}
                        </div>
                      </td>
                      <td className="p-6">
                        <div
                          className={`inline-block p-2 rounded-[4px] text-xs font-semibold
                          ${getStatusClasses(campaign.status)}`}
                        >
                          {campaign.status}
                        </div>
                        <div className="text-xs text-[#637083] pt-3">
                          Last Updated {campaign.lastUpdated}
                        </div>
                      </td>
                      <td className="p-6">
                        <button
                          type="button"
                          onClick={() => handleInitiateClick(campaign.id)}
                          className="inline-block px-4 py-2 bg-[#7A5690] text-white border border-[#F1EAF6]
                                   rounded-[8px] text-sm font-semibold"
                        >
                          Initiate
                        </button>
                      </td>
                      <td className="p-6">
                        <button
                          type="button"
                          // onClick={() => handleViewClick(campaign.id)}
                          className="text-xs flex gap-2 items-center"
                        >
                          View
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M2.42012 12.7132C2.28394 12.4975 2.21584 12.3897 2.17772 12.2234C2.14909 12.0985 2.14909 11.9015 2.17772 11.7766C2.21584 11.6103 2.28394 11.5025 2.42012 11.2868C3.54553 9.50484 6.8954 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7766C21.8517 11.9015 21.8517 12.0985 21.8231 12.2234C21.785 12.3897 21.7169 12.4975 21.5807 12.7132C20.4553 14.4952 17.1054 19 12.0004 19C6.8954 19 3.54553 14.4952 2.42012 12.7132Z"
                              stroke="#637083"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.0004 15C13.6573 15 15.0004 13.6569 15.0004 12C15.0004 10.3431 13.6573 9 12.0004 9C10.3435 9 9.0004 10.3431 9.0004 12C9.0004 13.6569 10.3435 15 12.0004 15Z"
                              stroke="#637083"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
  
          {renderPagination()}
        </div>
      </DashboardLayout>
    );
  };
  
  export default CampaignTable;