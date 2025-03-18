import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  MessageCircle,
  User,
  TrendingUp,
  Briefcase,
  Folder,
  Wallet,
  Compass
} from "lucide-react";
import Person from "../../assets/images/person.webp";

const Sidebar = ({ name, picture }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-[90px] max-sm:hidden">
    <motion.div
      className="fixed top-0 left-0 h-screen px-4 bg-white shadow-md overflow-hidden flex flex-col"
      initial={{ minWidth: "90px" }}
      animate={{
        minWidth: expanded ? "285px" : "90px",
        maxWidth: expanded ? "285px" : "90px"
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-col py-4">
        <div
          className={`flex items-center gap-3 px-2 py-2 cursor-pointer rounded-lg ${
            expanded ? "border-gray-300 border" : "border-transparent border"
          }`}
        >
          <img
            src={picture?(picture):(Person)}
            alt="Profile"
            className="rounded-full w-[38px] h-[38px] shrink-0"
          />
          <motion.div
            className={`flex-1 min-w-0 truncate transition-opacity ${expanded ? "visible opacity-100" : "invisible opacity-0"}`}
          >
            <p className="font-medium text-sm">Independent Workspace</p>
            <p className="text-sm text-gray-500">{name ? (name):("Emilia")}</p>
          </motion.div>
        </div>

        <nav className="w-full mt-6">
          {[
            { icon: User, label: "Community" },
            { icon: Home, label: "Dashboard" },
            { icon: MessageCircle, label: "Messages" }
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-4 cursor-pointer hover:bg-[#F1EAF6] rounded-lg"
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
              <span
                className={`flex-1 min-w-0 truncate transition-opacity ${expanded ? "visible opacity-100" : "invisible opacity-0"}`}
              >
                {label}
              </span>
            </div>
          ))}
        </nav>

        <div className="relative flex h-8 items-center px-3 mt-6">
          <span
            className={`text-gray-500 text-xs uppercase transition-opacity ${expanded ? "visible opacity-100" : "invisible hidden opacity-0"}`}
          >
            Identity
          </span>
          <div 
            className={`flex-1 border-t border-gray-300 ${expanded ? "ml-2 w-16" : "w-full"}`}
            ></div>
        </div>
        <nav className="w-full mt-2">
          {[
            { icon: User, label: "Profile" },
            { icon: TrendingUp, label: "Analytics" }
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-4 px-3 py-4 cursor-pointer hover:bg-[#F1EAF6] rounded-lg"
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
              <span
                className={`flex-1 min-w-0 truncate transition-opacity ${expanded ? "visible opacity-100" : "invisible opacity-0"}`}
              >
                {label}
              </span>
            </div>
          ))}
        </nav>
        <div className="relative flex items-center h-8 px-3 mt-6">
          <span
             className={`text-gray-500 text-xs uppercase transition-opacity ${expanded ? "visible opacity-100" : "invisible hidden opacity-0"}`}
          >
            Lead
          </span>
          <div className={`flex-1 border-t border-gray-300 ${expanded ? "ml-2 w-16" : "w-full"}`}></div>
        </div>
        <nav className="w-full mt-2">
          {[
            { icon: Compass, label: "Discover" },
            { icon: Briefcase, label: "Jobs" },
            { icon: Folder, label: "Project & Invoices" },
            { icon: Wallet, label: "Wallet" }
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-4 px-3 py-4 cursor-pointer hover:bg-[#F1EAF6] rounded-lg"
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
              <span
                className={`flex-1 min-w-0 truncate transition-opacity ${expanded ? "visible opacity-100" : "invisible opacity-0"}`}
              >
                {label}
              </span>
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
    </div>
  );
};

export default Sidebar;
