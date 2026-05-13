import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                <img src="/logo.jpeg" alt="Logo" className="h-8 w-8 rounded-full" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ToxiTrace
              </span>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {["/", "/our-vision", "/heatmap", "/reports"].map((path, idx) => {
                const names = ["Home", "Our Vision", "HMPI Heat Map", "Reports"];
                
                // Special animated styling for HMPI Heat Map (index 2)
                if (idx === 2) {
                  return (
                    <div key={idx} className="relative group inline-block">
                      {/* Continuous pulsing ring - positioned to not affect height */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md animate-pulse opacity-20 pointer-events-none"></div>
                      
                      <NavLink
                        to={path}
                        className={({ isActive }) =>
                          `relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 overflow-hidden inline-block ${
                            isActive
                              ? "text-blue-400 bg-blue-400/10"
                              : "text-gray-300 hover:text-cyan-400 hover:bg-blue-400/5"
                          }`
                        }
                      >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Content */}
                        <div className="relative flex items-center">
                          <span className="mr-1">{names[idx]}</span>
                          {/* Animated heat map icon */}
                          <div className="relative">
                            <svg 
                              className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                              />
                            </svg>
                            {/* Icon trail effect */}
                            <div className="absolute inset-0 bg-cyan-400/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                          </div>
                        </div>
                      </NavLink>
                      
                      {/* Glow effect - positioned to not affect height */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none"></div>
                    </div>
                  );
                }
                
                // Regular styling for other nav items
                return (
                  <NavLink
                    key={idx}
                    to={path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-blue-400 bg-blue-400/10"
                          : "text-gray-300 hover:text-cyan-400 hover:bg-blue-400/5"
                      }`
                    }
                  >
                    {names[idx]}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/login"
              className="px-4 py-2 text-sm font-medium border border-blue-400 text-blue-400 rounded-md hover:bg-blue-400 hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-400/20"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
            >
              Register
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-cyan-400 hover:bg-blue-400/10 focus:outline-none transition duration-200">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (hidden by default) */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1E293B]">
          {["/", "/our-vision", "/heatmap", "/reports"].map((path, idx) => {
            const names = ["Home", "Our Vision", "HMPI Heat Map", "Reports"];
            
            // Special animated styling for HMPI Heat Map (index 2) in mobile
            if (idx === 2) {
              return (
                <div key={idx} className="relative group">
                  {/* Continuous pulsing ring - positioned to not affect height */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md animate-pulse opacity-20 pointer-events-none"></div>
                  
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `relative block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 overflow-hidden ${
                        isActive
                          ? "text-blue-400 bg-blue-400/10"
                          : "text-gray-300 hover:text-cyan-400 hover:bg-blue-400/5"
                      }`
                    }
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative flex items-center">
                      <span className="mr-1">{names[idx]}</span>
                      {/* Animated heat map icon */}
                      <div className="relative">
                        <svg 
                          className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                          />
                        </svg>
                        {/* Icon trail effect */}
                        <div className="absolute inset-0 bg-cyan-400/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                      </div>
                    </div>
                  </NavLink>
                  
                  {/* Glow effect - positioned to not affect height */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none"></div>
                </div>
              );
            }
            
            // Regular styling for other nav items in mobile
            return (
              <NavLink
                key={idx}
                to={path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-400 bg-blue-400/10"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-blue-400/5"
                  }`
                }
              >
                {names[idx]}
              </NavLink>
            );
          })}
          <div className="pt-4 pb-3 border-t border-gray-700 space-y-3">
            <NavLink
              to="/login"
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-200"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-blue-500/30 transition-all duration-200"
            >
              Register
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


