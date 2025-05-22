import React from "react";
import UserProfile from "../auth/UserProfile";

interface HeaderProps {
  onNewApplication: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewApplication }) => {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              JobTracker
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onNewApplication}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Nouvelle candidature
            </button>

            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
