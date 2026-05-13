

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// Inlined sample users and validation helpers to avoid import path issues during build
const sampleUsers = [
  {
    id: 1,
    name: "Dev Malik",
    email: "dev.malik@example.com",
    password: "password123",
    role: "researcher",
    accreditationType: "id",
    accreditationId: "NABL-12345",
    labName: "Central Water Research Lab",
    labAddress: "123 Research Avenue, Science District, Mumbai, Maharashtra 400001",
    labPhone: "+91-22-1234-5678",
    labEmail: "info@centralwaterlab.com"
  },
  {
    id: 2,
    name: "Dhruv",
    email: "dhruv@example.com",
    password: "password123",
    role: "researcher",
    accreditationType: "certificate",
    accreditationId: "NABL-12345",
    labName: "Environmental Monitoring Institute",
    labAddress: "456 Green Street, Eco Park, Delhi, Delhi 110001",
    labPhone: "+91-11-9876-5432",
    labEmail: "contact@emi.gov.in"
  },
  {
    id: 3,
    name: "Kanishka Bhatt",
    email: "kanishka.bhatt@example.com",
    password: "password123",
    role: "researcher",
    accreditationType: "id",
    accreditationId: "CPCB-20002",
    labName: "Water Technology Solutions",
    labAddress: "789 Innovation Hub, Tech City, Bangalore, Karnataka 560001",
    labPhone: "+91-80-5555-1234",
    labEmail: "research@watertech.com"
  },
  {
    id: 4,
    name: "Shruti Bhardwaj",
    email: "shruti.bhardwaj@example.com",
    password: "password123",
    role: "researcher",
    accreditationType: "id",
    accreditationId: "SPCB-30003",
    labName: "State Pollution Control Board Lab",
    labAddress: "321 Government Complex, Administrative Area, Chennai, Tamil Nadu 600001",
    labPhone: "+91-44-3333-7777",
    labEmail: "lab@spcb.tn.gov.in"
  },
  {
    id: 5,
    name: "Aahana Verma",
    email: "aahana.verma@example.com",
    password: "password123",
    role: "researcher",
    accreditationType: "certificate",
    accreditationId: "",
    labName: "University Environmental Research Center",
    labAddress: "654 Academic Block, University Campus, Pune, Maharashtra 411007",
    labPhone: "+91-20-2222-8888",
    labEmail: "environment@university.edu"
  },
  {
    id: 6,
    name: "Ritika Gupta",
    email: "ritika.gupta@example.com",
    password: "password123",
    role: "general",
    accreditationType: "",
    accreditationId: "",
    labName: "",
    labAddress: "",
    labPhone: "",
    labEmail: ""
  }
];

const findUserByEmail = (email) => {
  return sampleUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const validateResearcherLogin = (email, accreditationId, loginMethod) => {
  const user = findUserByEmail(email);

  if (!user || user.role !== "researcher") {
    return { success: false, message: "User not found or not a researcher." };
  }

  if (loginMethod === "id") {
    if (user.accreditationType !== "id" || user.accreditationId !== accreditationId) {
      return { success: false, message: "Invalid accreditation ID." };
    }
  } else if (loginMethod === "certificate") {
    if (user.accreditationType !== "certificate") {
      return { success: false, message: "No certificate found for this account." };
    }
  }

  return { success: true, user };
};

export const validateGeneralLogin = (email, password) => {
  const user = findUserByEmail(email);

  if (!user || user.role !== "general") {
    return { success: false, message: "User not found or not a general user." };
  }

  if (user.password !== password) {
    return { success: false, message: "Invalid password." };
  }

  return { success: true, user };
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accreditationId, setAccreditationId] = useState("");
  const [loginMethod, setLoginMethod] = useState("id");
  const [isLoading, setIsLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0); // 0,1,2 for staged loader
  const [loadingOrg, setLoadingOrg] = useState(""); // NABL/CPCB/SPCB based on ID

  // Auto-fill demo credentials on component mount
  useEffect(() => {
    setEmail("dev.malik@example.com");
    setPassword("password123");
    setAccreditationId("NABL-12345");
    setLoginMethod("id");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate immediately
    let validationResult;
    if (loginMethod === "id" || loginMethod === "certificate") {
      validationResult = validateResearcherLogin(email, accreditationId, loginMethod);
    } else {
      validationResult = validateGeneralLogin(email, password);
    }

    if (!validationResult.success) {
      alert(validationResult.message);
      setIsLoading(false);
      return;
    }

    // Determine organisation label for staged message (NABL/CPCB/SPCB)
    const upperId = (accreditationId || "").toUpperCase();
    let org = "accreditation";
    if (upperId.startsWith("NABL")) org = "NABL";
    else if (upperId.startsWith("CPCB")) org = "CPCB";
    else if (upperId.startsWith("SPCB")) org = "SPCB";
    setLoadingOrg(org);

    // Stage messages: 0->1->2 then navigate
    setStepIndex(0);
    setTimeout(() => {
      setStepIndex(1);
      setTimeout(() => {
        setStepIndex(2);
        setTimeout(() => {
          // Store user and navigate
          const user = validationResult.user;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("role", user.role);

          // Scroll to top before navigation
          window.scrollTo({ top: 0, behavior: "smooth" });

          if (user.role === "researcher") {
            navigate("/researcherDashboard");
          } else {
            navigate("/userDashboard");
          }
          setIsLoading(false);
        }, 900);
      }, 900);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-16">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 via-blue-800 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/20"></div>
          <div className="relative z-10 flex flex-col justify-start items-center text-white p-12 pt-20">
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/20">
                <img src="/logo.jpeg" alt="ToxiTrace Logo" className="h-16 w-16 rounded-full" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                ToxiTrace
              </h1>
              <p className="text-xl text-slate-200 mb-8 font-light">
                Advanced Groundwater Quality Assessment
              </p>
            </div>
            
            <div className="text-center max-w-md">
              <blockquote className="text-lg italic leading-relaxed mb-6 text-slate-100 font-light">
                "Every drop of water tells a story. As researchers, we are the storytellers who decode the silent cries of our planet, transforming data into hope, and science into solutions for a healthier tomorrow."
              </blockquote>
              <div className="text-sm text-slate-300">
                <p className="font-medium text-cyan-200">- ToxiTrace Research Community</p>
                <p className="mt-2 text-slate-400">Join us in protecting our most precious resource</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="lg:hidden w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/logo.jpeg" alt="ToxiTrace Logo" className="h-10 w-10 rounded-full" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Lab Researcher Login</h2>
              <p className="text-gray-300">Sign in with your accreditation credentials</p>
            </div>

            {/* Demo Credentials Notice */}
            <div className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-300 font-semibold mb-2 flex items-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Demo Credentials Pre-filled
              </h4>
              <div className="text-xs text-yellow-100 space-y-1">
                <p><strong>Email:</strong> dev.malik@example.com</p>
                <p><strong>Password:</strong> password123</p>
                <p><strong>Accreditation ID:</strong> NABL-12345</p>
                <p className="text-yellow-200 mt-1">All fields are auto-filled for demo purposes</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Login Method Selection for Researchers */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Login Method (for Lab Researchers)
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      value="id"
                      checked={loginMethod === "id"}
                      onChange={(e) => setLoginMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <span className="text-white font-medium">Accreditation ID</span>
                      <p className="text-sm text-gray-400">Enter your NABL/CPCB/SPCB Number</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      value="certificate"
                      checked={loginMethod === "certificate"}
                      onChange={(e) => setLoginMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <span className="text-white font-medium">Certificate Upload</span>
                      <p className="text-sm text-gray-400">Upload your accreditation certificate</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Dynamic Input based on login method */}
              {loginMethod === "id" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Accreditation ID
                  </label>
                  <input
                    type="text"
                    value={accreditationId}
                    onChange={(e) => setAccreditationId(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your NABL/CPCB/SPCB Number"
                  />
                  <p className="text-xs text-gray-400 mt-1">Example: NABL-12345, CPCB-67890, SPCB-54321</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Certificate
                  </label>
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-gray-300 mt-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF, PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>

          {/* Animated Sign In Button */}
          <div className="relative group">
            {/* Continuous pulsing ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg animate-pulse opacity-30"></div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Animated background circle */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Pulsing ring animation */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-75 group-hover:opacity-100 animate-ping"></div>
              
              {/* Content */}
              <div className="relative flex items-center justify-center">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <span className="mr-2">Sign In</span>
                    {/* Animated arrow */}
                    <div className="relative">
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" 
                        />
                      </svg>
                      {/* Arrow trail effect */}
                      <div className="absolute inset-0 bg-white/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                    </div>
                  </>
                )}
              </div>
            </button>
            
            {/* Floating animation circles */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-80"></div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
        </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staged Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md text-center shadow-2xl">
            <div className="mx-auto w-14 h-14 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"></div>
            <div className="space-y-2">
              {stepIndex === 0 && (
                <p className="text-white text-lg font-semibold">Fetching data...</p>
              )}
              {stepIndex === 1 && (
                <p className="text-white text-lg font-semibold">
                  Verifying {loadingOrg || 'accreditation'} ID...
                </p>
              )}
              {stepIndex === 2 && (
                <p className="text-white text-lg font-semibold">Logging you in...</p>
              )}
              <p className="text-gray-300 text-sm">Please wait</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
