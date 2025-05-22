import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    if (!user) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar seul */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-10 h-10 rounded-full border-2 border-orange-200 hover:border-orange-400 transition-all overflow-hidden"
      >
        <img
          src={user.avatarUrl || "https://via.placeholder.com/40"}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Menu dropdown */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-orange-200 py-1 z-50">
          <div className="px-4 py-3 border-b border-orange-100">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>

          <button
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
