import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  calculateHMPI, 
  getWaterQualityCategory, 
  getRecommendations, 
  calculateTrend,
  calculateLocationTrend,
  aggregateLocationData,
  STANDARD_LIMITS,
  UNIT_WEIGHTS,
  BIS_QUALITY_CATEGORIES
} from "../utils/hmpiCalculations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { generatePDFReport } from '../utils/pdfReportGenerator';

export default function ResearcherReport() {
  const navigate = useNavigate();
  const [researchData, setResearchData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processedSamples, setProcessedSamples] = useState([]);
  const [locationAggregates, setLocationAggregates] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [chartData, setChartData] = useState([]);
  const [metalChartData, setMetalChartData] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const storedData = localStorage.getItem("researchData");
    const storedFileName = localStorage.getItem("uploadedFileName");
    
    console.log("Stored Data from localStorage:", storedData); // Debug log
    
    if (storedData) {
      const rawData = JSON.parse(storedData);
      console.log("Parsed Raw Data:", rawData); // Debug log
      setResearchData(rawData);
      
      // Process samples with HMPI calculations
      const processed = rawData.map(sample => {
        console.log("Processing sample:", sample); // Debug log
        
        // Ensure all metal fields are numbers
        const processedSample = {
          ...sample,
          Pb: parseFloat(sample.Pb) || 0,
          As: parseFloat(sample.As) || 0,
          Cd: parseFloat(sample.Cd) || 0,
          Cr: parseFloat(sample.Cr) || 0,
          Ni: parseFloat(sample.Ni) || 0,
          Hg: parseFloat(sample.Hg) || 0,
          Cu: parseFloat(sample.Cu) || 0,
          Zn: parseFloat(sample.Zn) || 0,
          Fe: parseFloat(sample.Fe) || 0,
          Mn: parseFloat(sample.Mn) || 0,
        };
        
        const hmpiResult = calculateHMPI(processedSample);
        console.log("HMPI Result:", hmpiResult); // Debug log
        
        const quality = getWaterQualityCategory(hmpiResult.hmpi);
        const recommendations = getRecommendations(hmpiResult.hmpi, hmpiResult.metalCalculations);
        
        return {
          ...processedSample,
          hmpiResult,
          quality,
          recommendations,
          trend: calculateTrend(hmpiResult.hmpi, null) // No historical data for now
        };
      });
      
      setProcessedSamples(processed);
      
      // Group by location for aggregate analysis
      const locationGroups = {};
      processed.forEach(sample => {
        const location = sample.location || 'Unknown';
        if (!locationGroups[location]) {
          locationGroups[location] = [];
        }
        locationGroups[location].push(sample);
      });
      
      // Calculate aggregates for each location
      const aggregates = {};
      Object.entries(locationGroups).forEach(([location, samples]) => {
        aggregates[location] = aggregateLocationData(samples);
      });
      
              setLocationAggregates(aggregates);
              
              // Prepare chart data for the main location
              const mainLocation = Object.keys(aggregates)[0];
              if (mainLocation && aggregates[mainLocation]) {
                const locationData = aggregates[mainLocation];
                if (locationData.trendAnalysis) {
                  // HMPI trend chart data
                  const trendData = locationData.trendAnalysis.dates.map((date, index) => ({
                    date: new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                    hmpi: locationData.trendAnalysis.hmpiValues[index],
                    year: new Date(date).getFullYear()
                  }));
                  setChartData(trendData);
                  
                  // Metal concentration chart data (latest sample)
                  const latestSample = locationData.samples[locationData.samples.length - 1];
                  if (latestSample && latestSample.hmpiResult && latestSample.hmpiResult.metalCalculations) {
                    const metalData = Object.entries(latestSample.hmpiResult.metalCalculations).map(([metal, data]) => ({
                      metal,
                      concentration: data.concentration,
                      subIndex: data.subIndex,
                      standardLimit: data.standardLimit
                    }));
                    setMetalChartData(metalData);
                  }
                }
              }
            }
            
            if (storedFileName) {
              setFileName(storedFileName);
            }
            
            setIsLoading(false);
  }, []);

  const handleBackToDashboard = () => {
    navigate("/researcherDashboard");
  };

  const handleDownloadPDF = async () => {
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("user")) || {
        name: "EnviroLab Pvt Ltd",
        accreditationId: "NABL-001"
      };

      // Show loading message
      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed top-20 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
      loadingToast.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Generating PDF report...</span>
        </div>
      `;
      document.body.appendChild(loadingToast);
      
      setTimeout(() => {
        loadingToast.classList.remove('translate-x-full');
      }, 100);

      // Generate PDF report
      await generatePDFReport(researchData, fileName, userData);

      // Remove loading toast
      setTimeout(() => {
        loadingToast.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(loadingToast);
        }, 300);
      }, 2000);

      // Show success message
      const successToast = document.createElement('div');
      successToast.className = 'fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
      successToast.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>PDF report downloaded successfully!</span>
        </div>
      `;
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        successToast.classList.remove('translate-x-full');
      }, 100);
      
      setTimeout(() => {
        successToast.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(successToast);
        }, 300);
      }, 3000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Show error message
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
      errorToast.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Error generating PDF report. Please try again.</span>
        </div>
      `;
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        errorToast.classList.remove('translate-x-full');
      }, 100);
      
      setTimeout(() => {
        errorToast.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(errorToast);
        }, 300);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white pt-16">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">
              Research Analysis Report
            </h1>
            <p className="text-gray-300">
              Generated from: <span className="text-cyan-300">{fileName}</span>
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleBackToDashboard}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
            {/* Animated Download PDF Button */}
            <div className="relative group">
              {/* Continuous pulsing ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg animate-pulse opacity-30"></div>
              
              <button
                onClick={handleDownloadPDF}
                className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Animated background circle */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Pulsing ring animation */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-75 group-hover:opacity-100 animate-ping"></div>
                
                {/* Content */}
                <div className="relative flex items-center justify-center">
                  <span className="mr-2">Download PDF Report</span>
                  {/* Animated download icon */}
                  <div className="relative">
                    <svg 
                      className="w-5 h-5 transform group-hover:translate-y-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    {/* Download trail effect */}
                    <div className="absolute inset-0 bg-white/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                  </div>
                </div>
              </button>
              
              {/* Floating animation circles */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-60"></div>
              <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-80"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        {processedSamples.length === 0 && (
          <div className="bg-yellow-900/20 border border-yellow-700/30 p-4 rounded-lg mb-6">
            <h3 className="text-yellow-400 font-semibold mb-2">Debug Information</h3>
            <p className="text-yellow-300 text-sm mb-2">No processed samples found. Raw data:</p>
            <pre className="text-xs text-gray-300 bg-gray-800 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(researchData, null, 2)}
            </pre>
          </div>
        )}

        {/* Report Content */}
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-200 mb-2">Total Samples</h3>
              <p className="text-3xl font-bold text-white">{processedSamples.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-900 to-green-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-green-200 mb-2">Unique Locations</h3>
              <p className="text-3xl font-bold text-white">{Object.keys(locationAggregates).length}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-200 mb-2">Avg HMPI</h3>
              <p className="text-3xl font-bold text-white">
                {processedSamples.length > 0 
                  ? (processedSamples.reduce((sum, s) => sum + (s.hmpiResult?.hmpi || 0), 0) / processedSamples.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-900 to-red-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-orange-200 mb-2">Critical Samples</h3>
              <p className="text-3xl font-bold text-white">
                {processedSamples.filter(s => s.quality?.category === 'Critical').length}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("samples")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "samples"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Per-Sample Analysis
              </button>
              <button
                onClick={() => setActiveTab("locations")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "locations"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Location-Level Analysis
              </button>
              <button
                onClick={() => setActiveTab("charts")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "charts"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Graphical Analysis
              </button>
              <button
                onClick={() => setActiveTab("formula")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "formula"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                HMPI Formula
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Report Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Dataset Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Samples:</span>
                        <span className="text-white font-semibold">{processedSamples.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Unique Locations:</span>
                        <span className="text-white font-semibold">{Object.keys(locationAggregates).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Average HMPI:</span>
                        <span className="text-white font-semibold">
                          {processedSamples.length > 0 
                            ? (processedSamples.reduce((sum, s) => sum + (s.hmpiResult?.hmpi || 0), 0) / processedSamples.length).toFixed(1)
                            : '0.0'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Critical Samples:</span>
                        <span className="text-red-400 font-semibold">
                          {processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) > 75).length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Quality Distribution</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Safe (HMPI &lt; 50):</span>
                        <span className="text-green-400 font-semibold">
                          {processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) < 50).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Moderate (50-100):</span>
                        <span className="text-yellow-400 font-semibold">
                          {processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 50 && (s.hmpiResult?.hmpi || 0) < 100).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Polluted (100-150):</span>
                        <span className="text-orange-400 font-semibold">
                          {processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 100 && (s.hmpiResult?.hmpi || 0) < 150).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Critical (&ge; 150):</span>
                        <span className="text-red-400 font-semibold">
                          {processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 150).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "samples" && (
              <div>
                <h2 className="text-2xl font-semibold text-indigo-400 mb-6">Per-Sample HMPI Analysis</h2>
                {processedSamples.length === 0 ? (
                  <p className="text-gray-300 text-center py-8">No data available</p>
                ) : (
                  <div className="space-y-6">
                {[...processedSamples]
                  .sort((a, b) => new Date(b.DateOfCollection || b.date) - new Date(a.DateOfCollection || a.date))
                  .map((sample, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    {/* Sample Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {sample.SampleID || `Sample ${index + 1}`} - {sample.LocationName || sample.location}
                        </h3>
                        <p className="text-gray-400">Date: {sample.DateOfCollection || sample.date}</p>
                        {(sample.LabName || sample.LabCode) && (
                          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/40">
                            <span className="text-xs text-blue-300 font-semibold">Uploaded by</span>
                            <span className="text-xs text-blue-200">{sample.LabName || 'Unknown Lab'}</span>
                            {sample.LabCode && (
                              <span className="text-[10px] text-blue-300">({sample.LabCode})</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                          sample.quality?.color === 'green' ? 'bg-green-600 text-white' :
                          sample.quality?.color === 'yellow' ? 'bg-yellow-600 text-white' :
                          sample.quality?.color === 'orange' ? 'bg-orange-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          HMPI: {sample.hmpiResult?.hmpi || 'N/A'}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {sample.quality?.category || 'Unknown'} - {sample.quality?.status || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Metal Concentrations Table */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-3">Metal Concentrations & Sub-Indices</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-700 rounded-lg">
                                  <thead>
                                    <tr className="text-left text-gray-300 border-b border-gray-600">
                                      <th className="px-3 py-2">Metal</th>
                                      <th className="px-3 py-2">Concentration (mg/L)</th>
                                      <th className="px-3 py-2">BIS Limit (mg/L)</th>
                                      <th className="px-3 py-2">BIS Quality Category</th>
                                      <th className="px-3 py-2">Sub-Index (Q_i)</th>
                                      <th className="px-3 py-2">Unit Weight (W_i)</th>
                                      <th className="px-3 py-2">Weighted Sub-Index</th>
                                    </tr>
                                  </thead>
                          <tbody>
                            {sample.hmpiResult?.metalCalculations ? Object.entries(sample.hmpiResult.metalCalculations).map(([metal, data]) => (
                              <tr key={metal} className="border-b border-gray-600">
                                <td className="px-3 py-2 font-medium text-white">{metal}</td>
                                <td className="px-3 py-2 text-gray-300">{data?.concentration || 'N/A'}</td>
                                <td className="px-3 py-2 text-gray-300">{data?.standardLimit || 'N/A'}</td>
                                <td className="px-3 py-2">
                                  <div className="flex flex-col">
                                    <span className={`text-xs font-semibold ${
                                      data?.bisQuality?.category === 'excellent' ? 'text-green-400' :
                                      data?.bisQuality?.category === 'good' ? 'text-blue-400' :
                                      data?.bisQuality?.category === 'acceptable' ? 'text-yellow-400' :
                                      data?.bisQuality?.category === 'poor' ? 'text-orange-400' :
                                      data?.bisQuality?.category === 'critical' ? 'text-red-400' :
                                      'text-gray-400'
                                    }`}>
                                      {data?.bisQuality?.category?.toUpperCase() || 'N/A'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {data?.bisQuality?.range || 'N/A'}
                                    </span>
                                  </div>
                                </td>
                                <td className={`px-3 py-2 font-semibold ${
                                  (data?.subIndex || 0) > 100 ? 'text-red-400' : 
                                  (data?.subIndex || 0) > 50 ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                  {data?.subIndex || 'N/A'}
                                </td>
                                <td className="px-3 py-2 text-gray-300">{data?.unitWeight || 'N/A'}</td>
                                <td className="px-3 py-2 text-gray-300">{data?.weightedSubIndex || 'N/A'}</td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan="7" className="px-3 py-2 text-center text-gray-400">
                                  No HMPI calculations available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-400 mb-3">Recommended Actions</h4>
                      <ul className="space-y-2">
                        {sample.recommendations && sample.recommendations.length > 0 ? sample.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-gray-300">
                            <span className="text-cyan-400 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        )) : (
                          <li className="text-gray-400">No recommendations available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "locations" && (
              <div>
                <h2 className="text-2xl font-semibold text-indigo-400 mb-6">Location Analysis - Paschim Vihar</h2>
                {Object.keys(locationAggregates).length === 0 ? (
                  <p className="text-gray-300 text-center py-8">No location data available</p>
                ) : (
                  <div className="space-y-6">
                {Object.entries(locationAggregates).map(([location, aggregate]) => (
                  <div key={location} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{location}</h3>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">Avg HMPI: {aggregate.avgHMPI}</p>
                        <p className="text-sm text-gray-400">{aggregate.sampleCount} samples</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-green-400 font-semibold mb-2">Best HMPI</h4>
                        <p className="text-2xl font-bold text-white">{aggregate.minHMPI}</p>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-red-400 font-semibold mb-2">Worst HMPI</h4>
                        <p className="text-2xl font-bold text-white">{aggregate.maxHMPI}</p>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-yellow-400 font-semibold mb-2">Highest Concern</h4>
                        <p className="text-lg font-bold text-white">{aggregate.highestConcernMetal.metal}</p>
                        <p className="text-sm text-gray-400">Weighted Index: {aggregate.highestConcernMetal.totalWeightedSubIndex}</p>
                      </div>
                    </div>

                    {/* Trend Analysis */}
                    {aggregate.trendAnalysis ? (
                      <div className="space-y-4">
                        {/* Overall Trend */}
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-cyan-400 font-semibold mb-3">Overall Trend Analysis</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-400">Overall Change</p>
                              <p className={`text-lg font-bold ${
                                aggregate.trendAnalysis.overallTrend.direction === 'increasing' ? 'text-red-400' :
                                aggregate.trendAnalysis.overallTrend.direction === 'decreasing' ? 'text-green-400' :
                                'text-yellow-400'
                              }`}>
                                {aggregate.trendAnalysis.overallTrend.trend}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-400">Average Change/Period</p>
                              <p className={`text-lg font-bold ${
                                aggregate.trendAnalysis.avgChange > 0 ? 'text-red-400' :
                                aggregate.trendAnalysis.avgChange < 0 ? 'text-green-400' :
                                'text-yellow-400'
                              }`}>
                                {aggregate.trendAnalysis.avgChange > 0 ? '+' : ''}{aggregate.trendAnalysis.avgChange}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-400">Trend Direction</p>
                              <p className={`text-lg font-bold ${
                                aggregate.trendAnalysis.overallTrend.direction === 'increasing' ? 'text-red-400' :
                                aggregate.trendAnalysis.overallTrend.direction === 'decreasing' ? 'text-green-400' :
                                'text-yellow-400'
                              }`}>
                                {aggregate.trendAnalysis.overallTrend.direction.charAt(0).toUpperCase() + 
                                 aggregate.trendAnalysis.overallTrend.direction.slice(1)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Period-by-Period Changes */}
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-cyan-400 font-semibold mb-3">Period-by-Period Changes</h4>
                          <div className="space-y-2">
                            {aggregate.trendAnalysis.periodChanges.map((change, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-gray-600 p-3 rounded">
                                <div>
                                  <p className="text-sm text-gray-300">{change.period}</p>
                                </div>
                                <div className="text-right">
                                  <p className={`font-semibold ${
                                    change.direction === 'increasing' ? 'text-red-400' :
                                    change.direction === 'decreasing' ? 'text-green-400' :
                                    'text-yellow-400'
                                  }`}>
                                    {change.change > 0 ? '+' : ''}{change.change} ({change.percentChange > 0 ? '+' : ''}{change.percentChange}%)
                                  </p>
                                  <p className="text-xs text-gray-400 capitalize">{change.direction}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* HMPI Values Timeline */}
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-cyan-400 font-semibold mb-3">HMPI Timeline</h4>
                          <div className="space-y-2">
                            {aggregate.trendAnalysis.dates.map((date, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-gray-300 text-sm">{date}</span>
                                <span className="text-white font-semibold">
                                  HMPI: {aggregate.trendAnalysis.hmpiValues[idx]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-cyan-400 font-semibold mb-3">HMPI Trend Over Time</h4>
                        <div className="h-32 bg-gray-600 rounded flex items-center justify-center">
                          <p className="text-gray-400">Insufficient data for trend analysis (need at least 2 samples)</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "charts" && (
              <div>
                <h2 className="text-2xl font-semibold text-indigo-400 mb-6">Graphical Analysis - Paschim Vihar</h2>
                
                {/* HMPI Trend Chart */}
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">HMPI Trend Over Time</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          fontSize={12}
                          label={{ value: 'HMPI Value', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151', 
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                          formatter={(value) => [value, 'HMPI']}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="hmpi" 
                          stroke="#06B6D4" 
                          strokeWidth={3}
                          dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#06B6D4', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-sm text-gray-300">
                    <p>📈 <strong>Trend Analysis:</strong> Shows the progression of HMPI values over time, indicating water quality improvement or degradation.</p>
                  </div>
                </div>

                {/* Metal Concentrations Chart */}
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">Heavy Metal Concentrations (Latest Sample)</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metalChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="metal" 
                          stroke="#9CA3AF"
                          fontSize={12}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          fontSize={12}
                          label={{ value: 'Concentration (mg/L)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151', 
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                          formatter={(value, name) => [value, name === 'concentration' ? 'Concentration (mg/L)' : 'Standard Limit (mg/L)']}
                        />
                        <Legend />
                        <Bar 
                          dataKey="concentration" 
                          fill="#EF4444" 
                          name="Concentration (mg/L)"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="standardLimit" 
                          fill="#10B981" 
                          name="BIS Limit (mg/L)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-sm text-gray-300">
                    <p>🔴 <strong>Red Bars:</strong> Actual concentrations | 🟢 <strong>Green Bars:</strong> WHO/BIS standard limits</p>
                  </div>
                </div>

                {/* Water Quality Distribution */}
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">Water Quality Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Safe', value: processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) < 25).length, color: '#10B981' },
                              { name: 'Moderate', value: processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 25 && (s.hmpiResult?.hmpi || 0) < 50).length, color: '#F59E0B' },
                              { name: 'Polluted', value: processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 50 && (s.hmpiResult?.hmpi || 0) < 75).length, color: '#F97316' },
                              { name: 'Critical', value: processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 75).length, color: '#EF4444' }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                            outerRadius={70}
                            innerRadius={20}
                            fill="#8884d8"
                            dataKey="value"
                            labelStyle={{ 
                              fontSize: '12px', 
                              fill: '#F9FAFB',
                              fontWeight: 'bold'
                            }}
                          >
                            {[
                              { name: 'Safe', value: processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) < 25).length, color: '#10B981' },
                              { name: 'Moderate', value: processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 25 && (s.hmpiResult?.hmpi || 0) < 50).length, color: '#F59E0B' },
                              { name: 'Polluted', value: processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 50 && (s.hmpiResult?.hmpi || 0) < 75).length, color: '#F97316' },
                              { name: 'Critical', value: processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 75).length, color: '#EF4444' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151', 
                              borderRadius: '8px',
                              color: '#F9FAFB'
                            }}
                            formatter={(value, name) => [value, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Quality Categories</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-gray-300">Safe (HMPI &lt; 25): {processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) < 25).length} samples</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          <span className="text-gray-300">Moderate (25-50): {processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 25 && (s.hmpiResult?.hmpi || 0) < 50).length} samples</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-orange-500 rounded"></div>
                          <span className="text-gray-300">Polluted (50-75): {processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 50 && (s.hmpiResult?.hmpi || 0) < 75).length} samples</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          <span className="text-gray-300">Critical (&gt;75): {processedSamples.filter(s => (s.hmpiResult?.hmpi || 0) >= 75).length} samples</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "formula" && (
              <div>
                <h2 className="text-2xl font-semibold text-indigo-400 mb-6">HMPI Calculation Formula</h2>
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                  <p className="text-white font-mono text-lg mb-2">HMPI = Σ(W_i × Q_i) / Σ(W_i)</p>
                  <p className="text-gray-300 text-sm mb-2">Where:</p>
                  <ul className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>• W_i = Unit weight for metal i</li>
                    <li>• Q_i = Sub-index for metal i = (C_i / S_i) × 100</li>
                    <li>• C_i = Concentration of metal i (mg/L)</li>
                    <li>• S_i = Standard limit for metal i (mg/L)</li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h4 className="text-cyan-400 font-semibold mb-4">BIS Standard Limits (IS 10500:2012)</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      {Object.entries(STANDARD_LIMITS).map(([metal, limit]) => (
                        <div key={metal} className="flex justify-between">
                          <span>{metal}:</span>
                          <span className="font-semibold">{limit} mg/L</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3 italic">
                      Based on Bureau of Indian Standards Drinking Water Specifications
                    </p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h4 className="text-cyan-400 font-semibold mb-4">Unit Weights (Toxicity Based)</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      {Object.entries(UNIT_WEIGHTS).map(([metal, weight]) => (
                        <div key={metal} className="flex justify-between">
                          <span>{metal}:</span>
                          <span className="font-semibold">{weight}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3 italic">
                      Higher weights indicate greater toxicity and health risk
                    </p>
                  </div>
                </div>

                {/* BIS Quality Categories Explanation */}
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h4 className="text-cyan-400 font-semibold mb-4">BIS Quality Categories Explained</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 font-semibold text-sm">EXCELLENT</span>
                      </div>
                      <p className="text-xs text-gray-300">Well below BIS permissible limits. Safe for consumption without treatment.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-400 font-semibold text-sm">GOOD</span>
                      </div>
                      <p className="text-xs text-gray-300">Within BIS permissible limits. Safe for drinking water standards.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-yellow-400 font-semibold text-sm">ACCEPTABLE</span>
                      </div>
                      <p className="text-xs text-gray-300">Slightly above BIS limits. May require basic treatment.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-orange-400 font-semibold text-sm">POOR</span>
                      </div>
                      <p className="text-xs text-gray-300">Significantly above BIS limits. Requires immediate treatment.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-400 font-semibold text-sm">CRITICAL</span>
                      </div>
                      <p className="text-xs text-gray-300">Dangerously high levels. Not safe for consumption.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
