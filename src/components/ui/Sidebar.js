import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Home,
  MessageCircle,
  BarChart2,
  Compass,
  Briefcase,
  Folder,
  CreditCard,
} from "lucide-react";
import Person from "../../assets/images/person.webp"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: User, label: "Community" },
    { icon: Home, label: "Dashboard" },
    { icon: MessageCircle, label: "Messages" },
    { icon: User, label: "Profile", category: "Identity" },
    { icon: BarChart2, label: "Analytics", category: "Identity" },
    { icon: Compass, label: "Discover", category: "Lead" },
    { icon: Briefcase, label: "Jobs", category: "Lead" },
    { icon: Folder, label: "Project & Invoices", category: "Lead" },
    { icon: CreditCard, label: "Wallet", category: "Lead" },
  ];

  return (
    <div className="w-[60px]">
      <motion.div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="fixed top-0 left-0 bottom-0 bg-white shadow-lg flex flex-col overflow-hidden"
        animate={{ width: isOpen ? 250 : 60 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`flex items-center py-4 border-b whitespace-nowrap ${
                    isOpen ? "px-4" : "justify-center"
                  }`}>
          <motion.img
            src={Person}
            alt="User"
            className="rounded-full w-10 h-10"
            animate={{ opacity: isOpen ? 1 : 1 }}
          />
          {isOpen && (
            <motion.div
              className="ml-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h4 className="text-sm font-semibold">Independent</h4>
              <p className="text-xs text-gray-500">Emilia</p>
            </motion.div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.category && (
                <motion.div
                  className={`text-sm px-4 py-2 whitespace-nowrap ${
                    isOpen ? "text-gray-500" : "text-white"
                  }`}
                >
                  <p>{item.category}</p>
                </motion.div>
              )}
              <div className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer whitespace-nowrap">
                <item.icon className="w-5 h-5 text-gray-600" />
                {isOpen && (
                  <p className="ml-3 text-sm font-medium">{item.label}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      </div>
  );
}