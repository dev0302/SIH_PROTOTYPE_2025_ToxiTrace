import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Papa from "papaparse";

export default function FileUpload() {
  const navigate = useNavigate();
  const [researchData, setResearchData] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("CSV Parsed Results:", results.data);
        
        const parsedData = results.data.map((row, index) => ({
          id: Date.now() + index,
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

        console.log("Processed Data:", parsedData);
        setResearchData([...parsedData, ...researchData]);
        setIsFileUploaded(true);
        // alert("CSV uploaded successfully! Click 'Generate Report' to proceed.");
      },
      error: function (err) {
        console.error("CSV Parse Error:", err);
        alert("Error parsing CSV: " + err.message);
      },
    });
  };

  const handleGenerateReport = () => {
    if (!isFileUploaded) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
      toast.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Please upload a CSV file first!</span>
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.remove('translate-x-full');
      }, 100);
      
      setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
      
      return;
    }

    // Start staged loader (3 steps)
    setIsLoading(true);
    setStepIndex(0);

    setTimeout(() => {
      setStepIndex(1);
      setTimeout(() => {
        setStepIndex(2);
        setTimeout(() => {
          // Persist data
          localStorage.setItem("researchData", JSON.stringify(researchData));
          localStorage.setItem("uploadedFileName", uploadedFile?.name || "research_data.csv");

          // Scroll to top and navigate
          window.scrollTo({ top: 0, behavior: 'smooth' });
          navigate("/researcherReport");
          setIsLoading(false);
        }, 900);
      }, 900);
    }, 900);
  };

  const handleBackToDashboard = () => {
    navigate("/researcherDashboard");
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white pt-16">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400">
            Upload Research Data
          </h1>
          <button
            onClick={handleBackToDashboard}
            className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>

        {/* CSV Upload Section */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
            Upload Groundwater Research CSV
          </h2>
          <div className="space-y-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="p-2 rounded-lg bg-gray-700 cursor-pointer w-full"
            />
            <p className="text-gray-400 text-sm">
              CSV columns: <b>SampleID, LocationName, Metal Concentrations, DateOfCollection</b>
            </p>
            
            {/* Sample CSV Download Section */}
            <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-green-300 font-semibold text-sm mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    📄 Sample CSV Template
                  </h4>
                  <p className="text-green-100 text-xs">Download our sample file to see the correct format and test the upload functionality</p>
                </div>
                <div className="relative group">
                  <button
                    onClick={() => {
                      // Create a comprehensive sample CSV content
                      const csvContent = `SampleID,LabCode,LabName,AccreditationID,CollectorName,DateOfCollection,TimeOfCollection,Depth,SourceType,LocationName,Latitude,Longitude,Photo,pH,EC,TDS,Temperature,Turbidity,Pb,As,Cd,Cr,Ni,Hg,Cu,Zn,Fe,Mn
S001,LAB001,Central Water Research Lab,NABL-12345,Dr. Dev Malik,2024-01-15,10:30,5m,Borewell,Paschim Vihar,28.7041,77.1025,sample1.jpg,7.2,450,320,25.5,2.1,0.045,0.025,0.008,0.12,0.015,0.002,0.08,0.12,0.15,0.08
S002,LAB001,Central Water Research Lab,NABL-12345,Dr. Dev Malik,2024-01-15,11:00,8m,Borewell,Paschim Vihar,28.7045,77.1030,sample2.jpg,7.1,480,340,26.0,1.8,0.042,0.028,0.009,0.115,0.018,0.0018,0.085,0.125,0.16,0.085
S003,LAB001,Central Water Research Lab,NABL-12345,Dr. Dev Malik,2024-01-15,11:30,6m,Borewell,Paschim Vihar,28.7038,77.1028,sample3.jpg,7.3,465,330,25.8,2.3,0.048,0.022,0.007,0.125,0.012,0.0022,0.075,0.115,0.14,0.075
S004,LAB001,Central Water Research Lab,NABL-12345,Dr. Dev Malik,2024-01-16,09:15,7m,Borewell,Punjabi Bagh,28.6500,77.1200,sample4.jpg,7.0,420,300,24.8,1.9,0.038,0.020,0.006,0.110,0.010,0.0015,0.070,0.110,0.135,0.070
S005,LAB001,Central Water Research Lab,NABL-12345,Dr. Dev Malik,2024-01-16,10:45,9m,Borewell,Dwarka,28.5920,77.0460,sample5.jpg,7.4,490,350,26.2,2.0,0.050,0.030,0.010,0.130,0.020,0.0025,0.090,0.130,0.170,0.090`;
                      
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'sample_research_data.csv';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    }}
                    className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center overflow-hidden"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Sample CSV
                    </div>
                  </button>
                  
                  {/* Floating animation circles */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-60"></div>
                  <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse opacity-80"></div>
                </div>
              </div>
            </div>
            
            {/* File Upload Status */}
            {isFileUploaded && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400 text-sm font-medium">
                    File uploaded successfully: {uploadedFile?.name}
                  </span>
                </div>
              </div>
            )}
            
            {/* Submit Button - Always visible */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {isFileUploaded ? "Ready to generate report" : "Upload a file to generate report"}
                </div>
                <div className="relative group">
                  <button
                    onClick={handleGenerateReport}
                    className={`relative font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
                      isFileUploaded 
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25" 
                        : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    }`}
                  >
                    {/* Animated background for active state */}
                    {isFileUploaded && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg opacity-75 group-hover:opacity-100 animate-ping"></div>
                      </>
                    )}
                    
                    {/* Content */}
                    <div className="relative flex items-center justify-center">
                      <span className="mr-2">Generate Report</span>
                      {/* Animated icon */}
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        {/* Icon trail effect */}
                        <div className="absolute inset-0 bg-white/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                      </div>
                    </div>
                  </button>
                  
                  {/* Floating animation circles - only show when file is uploaded */}
                  {isFileUploaded && (
                    <>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-bounce opacity-60"></div>
                      <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-80"></div>
                    </>
                  )}
                  
                  {/* Glow effect - only show when file is uploaded */}
                  {isFileUploaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Format Description */}
        <div className="bg-gradient-to-r from-slate-800 to-gray-800 p-6 rounded-2xl shadow-lg mb-8 border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Required File Format
          </h3>
          
          <div className="space-y-6 text-sm text-gray-300">
            {/* Sample Identification */}
            <div>
              <h4 className="font-semibold text-white mb-3 text-base">1. Sample Identification & Metadata</h4>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div><span className="text-cyan-300">Sample ID:</span> Unique identifier (text)</div>
                  <div><span className="text-cyan-300">Lab Code:</span> Laboratory code (text)</div>
                  <div><span className="text-cyan-300">Collector Name:</span> Full name (text)</div>
                  <div><span className="text-cyan-300">Date of Collection:</span> YYYY-MM-DD (date)</div>
                  <div><span className="text-cyan-300">Time of Collection:</span> HH:MM AM/PM (time)</div>
                  <div><span className="text-cyan-300">Depth:</span> meters (number)</div>
                  <div><span className="text-cyan-300">Source Type:</span> Borewell, hand pump, dug well (text)</div>
                  <div><span className="text-cyan-300">Location Name:</span> Village/Town/District (text)</div>
                  <div><span className="text-cyan-300">Latitude/Longitude:</span> Decimal degrees (number)</div>
                  <div><span className="text-cyan-300">Photo/Site Image:</span> File name (text)</div>
                </div>
              </div>
            </div>

            {/* Basic Water Quality */}
            <div>
              <h4 className="font-semibold text-white mb-3 text-base">2. Basic Water Quality Parameters</h4>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div><span className="text-cyan-300">pH:</span> — (dimensionless)</div>
                  <div><span className="text-cyan-300">Electrical Conductivity:</span> µS/cm (number)</div>
                  <div><span className="text-cyan-300">Total Dissolved Solids:</span> mg/L (number)</div>
                  <div><span className="text-cyan-300">Temperature:</span> °C (number)</div>
                  <div><span className="text-cyan-300">Turbidity:</span> NTU (number)</div>
                </div>
                <p className="text-xs text-gray-400 mt-2 italic">These parameters provide context for HMPI calculations</p>
              </div>
            </div>

            {/* Heavy Metal Data */}
            <div>
              <h4 className="font-semibold text-white mb-3 text-base">3. Heavy Metal Concentration Data (Core Section)</h4>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div><span className="text-cyan-300">Lead (Pb):</span> mg/L (number)</div>
                  <div><span className="text-cyan-300">Arsenic (As):</span> mg/L (number)</div>
                  <div><span className="text-cyan-300">Cadmium (Cd):</span> mg/L (number)</div>
                  <div><span className="text-cyan-300">Chromium (Cr):</span> mg/L (number)</div>
                  <div><span className="text-cyan-300">Nickel (Ni):</span> mg/L (number)</div>
                  <div><span className="text-cyan-300">Mercury (Hg):</span> mg/L (number)</div>
                  <div><span className="text-cyan-300">Copper (Cu):</span> mg/L (number)</div>
                  <div><span className="text-cyan-300">Zinc (Zn):</span> mg/L (number)</div>
                  <div><span className="text-cyan-300">Iron (Fe):</span> mg/L (number)</div>
                  <div><span className="text-cyan-300">Manganese (Mn):</span> mg/L (number)</div>
                </div>
                <p className="text-xs text-gray-400 mt-2 italic">Optional: Selenium (Se), Cobalt (Co) depending on study area</p>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-blue-900/20 border border-blue-700/30 p-4 rounded-lg">
              <div className="flex items-start">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs">
                  <p className="text-blue-300 font-medium mb-1">Important Notes:</p>
                  <ul className="text-gray-300 space-y-1">
                    <li>• All concentrations should be in mg/L or µg/L</li>
                    <li>• Include proper units for each measurement</li>
                    <li>• Ensure sample IDs are unique across your dataset</li>
                    <li>• Geo-coordinates enable heat map generation</li>
                    <li>• Missing values should be left blank or marked as "ND" (Not Detected)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Research Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Uploaded Research Data</h2>
          {researchData.length === 0 ? (
            <p className="text-gray-300">No research uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 border border-gray-700 rounded-xl">
                <thead>
                  <tr className="text-left text-teal-400 border-b border-gray-700">
                    <th className="px-4 py-2">Sample ID</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Pb (mg/L)</th>
                    <th className="px-4 py-2">As (mg/L)</th>
                    <th className="px-4 py-2">HMPI</th>
                  </tr>
                </thead>
                <tbody>
                  {researchData.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition"
                    >
                      <td className="px-4 py-2">{r.SampleID}</td>
                      <td className="px-4 py-2">{r.LocationName}</td>
                      <td className="px-4 py-2">{r.DateOfCollection}</td>
                      <td className="px-4 py-2">{r.Pb}</td>
                      <td className="px-4 py-2">{r.As}</td>
                      <td className="px-4 py-2">N/A</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Staged Loader Overlay during report generation */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md text-center shadow-2xl">
            <div className="mx-auto w-14 h-14 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-6"></div>
            <div className="space-y-2">
              {stepIndex === 0 && (
                <p className="text-white text-lg font-semibold">Uploading and parsing CSV...</p>
              )}
              {stepIndex === 1 && (
                <p className="text-white text-lg font-semibold">Fetching Previous Data...</p>
              )}
              {stepIndex === 2 && (
                <p className="text-white text-lg font-semibold">Preparing your report...</p>
              )}
              <p className="text-gray-300 text-sm">Please wait</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
