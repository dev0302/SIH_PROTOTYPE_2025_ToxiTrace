import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Papa from "papaparse";
import sampleHMPI from "../data/sample_hmpi_data.csv?url";
import { searchIndianCities } from "../data/indianCities";

export default function ResearcherDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Show welcome toast for registered lab dashboard
    showWelcomeToast();
  }, []);

  const showWelcomeToast = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 transform transition-all duration-500 translate-x-full border border-blue-400/30';
    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-blue-100 mb-1">Welcome to EnviroLab Dashboard</h4>
          <p class="text-sm text-blue-200 leading-relaxed">
            This is the dashboard of a registered NABL-accredited laboratory showcasing sample data and analysis capabilities. All displayed information represents a professional demonstration of our HMPI analysis platform.
          </p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 text-blue-200 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentNode) document.body.removeChild(toast);
      }, 500);
    }, 8000);
  };

  const handleUploadFile = () => {
    navigate("/fileUpload");
  };

  const handleViewPreviousFiles = () => {
    navigate("/previousFiles");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentNode) document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length >= 2) {
      const results = searchIndianCities(value);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setSearchQuery(city.city);
    setShowSuggestions(false);
  };

  const handleSearchAnalyze = () => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      showToast('Please enter a location to search.');
      return;
    }
    
    // Check if it's a supported demo location
    const supportedLocations = [
      'paschim vihar', 'punjabi bagh', 'rajouri garden', 'janakpuri', 
      'vikaspuri', 'uttam nagar', 'dwarka', 'rohini', 'pitampura',
      'shalimar bagh', 'azadpur', 'model town', 'civil lines',
      'kashmere gate', 'chandni chowk', 'connaught place', 'cp',
      'karol bagh', 'paharganj', 'lajpat nagar', 'greater kailash',
      'gk', 'saket', 'malviya nagar', 'hauz khas', 'green park',
      'vasant kunj', 'vasant vihar', 'defence colony', 'jangpura',
      'nizamuddin', 'kalkaji', 'nehru place', 'okhla', 'jamia nagar',
      'shaheen bagh', 'jasola', 'sarita vihar', 'mayur vihar',
      'preet vihar', 'vivek vihar', 'shahdara', 'seelampur',
      'gokulpuri', 'karawal nagar', 'yamuna vihar', 'dilshad garden',
      'ghaziabad', 'noida', 'gurgaon', 'gurugram', 'faridabad'
    ];
    
    if (!supportedLocations.includes(normalized)) {
      showToast(`Currently supported demo locations include: Paschim Vihar, Punjabi Bagh, Rajouri Garden, Dwarka, Rohini, and other Delhi areas.`);
      return;
    }

    setIsLoading(true);
    Papa.parse(sampleHMPI, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parsedData = results.data.map((row, index) => ({
          SampleID: row.SampleID || `S${index + 1}`,
          LabCode: row.LabCode || "N/A",
          LabName: row.LabName || "N/A",
          AccreditationID: row.AccreditationID || "N/A",
          CollectorName: row.CollectorName || "N/A",
          DateOfCollection: row.DateOfCollection || new Date().toISOString().split('T')[0],
          TimeOfCollection: row.TimeOfCollection || "N/A",
          Depth: row.Depth || "N/A",
          SourceType: row.SourceType || "N/A",
          LocationName: row.LocationName || "Unknown",
          Latitude: row.Latitude || "N/A",
          Longitude: row.Longitude || "N/A",
          Photo: row.Photo || "N/A",
          pH: row.pH || "N/A",
          EC: row.EC || "N/A",
          TDS: row.TDS || "N/A",
          Temperature: row.Temperature || "N/A",
          Turbidity: row.Turbidity || "N/A",
          Pb: row.Pb || 0,
          As: row.As || 0,
          Cd: row.Cd || 0,
          Cr: row.Cr || 0,
          Ni: row.Ni || 0,
          Hg: row.Hg || 0,
          Cu: row.Cu || 0,
          Zn: row.Zn || 0,
          Fe: row.Fe || 0,
          Mn: row.Mn || 0,
          location: row.LocationName || "Unknown",
          date: row.DateOfCollection || new Date().toISOString().split('T')[0],
        }));

        localStorage.setItem("researchData", JSON.stringify(parsedData));
        localStorage.setItem("uploadedFileName", "sample_hmpi_data.csv (Paschim Vihar)");
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate("/researcherReport");
      },
      error: function (err) {
        console.error("CSV Parse Error:", err);
        setIsLoading(false);
        showToast("Error loading sample data: " + err.message);
      },
    });
  };

  // Sample lab data - in a real app, this would come from the user's profile
  const labData = {
    name: "EnviroLab Pvt Ltd",
    accreditationId: "NABL-001",
    address: "123 Research Park, Delhi - 110001",
    phone: "+91-11-2345-6789",
    email: "info@envirolab.com",
    established: "2015",
    certifications: ["NABL", "ISO 17025", "CPCB Approved"],
    specialties: ["Water Quality Testing", "Heavy Metal Analysis", "Environmental Monitoring"]
  };

  const stats = {
    totalUploads: 6,
    totalSamples: 209,
    avgHMPI: 68.2,
    criticalSamples: 2
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white pt-16">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-teal-400 mb-2">
              Researcher Dashboard
            </h1>
            <p className="text-gray-300">
              Welcome back, {user?.name || "Researcher"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Lab Information Card */}
        <div className="bg-gradient-to-r from-slate-800 to-gray-800 p-8 rounded-2xl shadow-lg mb-8 border border-slate-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-lg rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                <img src="/logo.jpeg" alt="Lab Logo" className="h-12 w-12 rounded-full" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{labData.name}</h2>
                <p className="text-cyan-400 font-semibold mb-1">Accreditation: {labData.accreditationId}</p>
                <p className="text-gray-300 text-sm">{labData.address}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span>📞 {labData.phone}</span>
                  <span>✉️ {labData.email}</span>
                  <span>📅 Est. {labData.established}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-2">
                Active Lab
              </div>
              <p className="text-gray-400 text-sm">Last Activity: Today</p>
            </div>
          </div>
          
          {/* Certifications and Specialties */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {labData.certifications.map((cert, index) => (
                  <span key={index} className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-600/30">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {labData.specialties.map((specialty, index) => (
                  <span key={index} className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-600/30">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-200 mb-2">Total Uploads</h3>
                <p className="text-3xl font-bold text-white">{stats.totalUploads}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-900 to-green-800 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-200 mb-2">Total Samples</h3>
                <p className="text-3xl font-bold text-white">{stats.totalSamples}</p>
              </div>
              <div className="w-12 h-12 bg-green-600/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-200 mb-2">Avg HMPI</h3>
                <p className="text-3xl font-bold text-white">{stats.avgHMPI}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-900 to-red-800 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-orange-200 mb-2">Critical Samples</h3>
                <p className="text-3xl font-bold text-white">{stats.criticalSamples}</p>
              </div>
              <div className="w-12 h-12 bg-red-600/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Upload New File Card */}
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group relative">
            {/* Floating animation circles */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-80"></div>
            
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Upload New Data</h3>
                <p className="text-gray-400">Upload CSV files for HMPI analysis</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Upload your groundwater research data in CSV format. Our system will automatically calculate HMPI values, generate comprehensive reports, and provide detailed analysis with trend tracking.
            </p>
            
            <button
              onClick={handleUploadFile}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              Upload CSV File
            </button>
          </div>

          {/* View Previous Files Card */}
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group relative">
            {/* Floating animation circles */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-80"></div>
            
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Previous Files</h3>
                <p className="text-gray-400">View and manage uploaded datasets</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Access all your previously uploaded research files, view generated reports, download PDFs, and track the progress of your environmental monitoring projects.
            </p>
            <button
              onClick={handleViewPreviousFiles}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              View All Files
            </button>
          </div>

          {/* Search by Location Card */}
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Search by Location</h3>
                <p className="text-gray-400">Type a location to analyze demo data</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Try entering any Delhi area like <span className="text-emerald-400 font-semibold">Paschim Vihar</span>, <span className="text-emerald-400 font-semibold">Punjabi Bagh</span>, <span className="text-emerald-400 font-semibold">Dwarka</span>, or <span className="text-emerald-400 font-semibold">Rohini</span> to load sample HMPI data and see the full analysis without uploading a file.
            </p>
            <div className="relative">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Enter location (e.g., Paschim Vihar)"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {suggestions.map((city, index) => (
                        <div
                          key={index}
                          onClick={() => handleSuggestionClick(city)}
                          className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                        >
                          <div className="text-white font-medium">{city.city}</div>
                          <div className="text-gray-400 text-sm">{city.district}, {city.state}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSearchAnalyze}
                  disabled={isLoading}
                  className="sm:w-40 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-400">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Report Generated</p>
                  <p className="text-gray-400 text-sm">Delhi_Groundwater_Study_2024.csv</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">2 hours ago</p>
                <p className="text-green-400 text-sm font-semibold">Completed</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">File Uploaded</p>
                  <p className="text-gray-400 text-sm">Gurgaon_Industrial_Area_2024.csv</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">1 day ago</p>
                <p className="text-blue-400 text-sm font-semibold">Processing</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">PDF Downloaded</p>
                  <p className="text-gray-400 text-sm">Noida_Residential_2024_Report.pdf</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">3 days ago</p>
                <p className="text-purple-400 text-sm font-semibold">Downloaded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}