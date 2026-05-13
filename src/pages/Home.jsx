import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate();
  const [showResearcherModal, setShowResearcherModal] = useState(false);

  const handleGetStarted = () => {
    navigate('/user');
  };

  const handleResearcherClick = () => {
    setShowResearcherModal(true);
  };

  const handleCloseModal = () => {
    setShowResearcherModal(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setShowResearcherModal(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setShowResearcherModal(false);
  };

  return (
    <div className='w-full min-h-screen'>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Heavy Metal Pollution
                  <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Index Calculator
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Advanced groundwater quality assessment through integrated heavy metal concentration analysis, 
                  geo-coordinate mapping, and comprehensive reporting for researchers and policymakers.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Animated User Button */}
                <div className="relative group">
                  {/* Continuous pulsing ring */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg animate-pulse opacity-30"></div>
                  
                <button 
                  onClick={handleGetStarted}
                    className="relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Animated background circle */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Pulsing ring animation */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-75 group-hover:opacity-100 animate-ping"></div>
                    
                    {/* Content */}
                    <div className="relative flex items-center justify-center">
                      <span className="mr-2">Get Started as User</span>
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
                    </div>
                </button>
                  
                  {/* Floating animation circles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-80"></div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                
                {/* Animated Researcher Button */}
                <div className="relative group">
                  {/* Continuous pulsing ring */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg animate-pulse opacity-30"></div>
                  
                <button 
                  onClick={handleResearcherClick}
                    className="relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Animated background circle */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Pulsing ring animation */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-75 group-hover:opacity-100 animate-ping"></div>
                    
                    {/* Content */}
                    <div className="relative flex items-center justify-center">
                      <span className="mr-2">Get Started as Researcher</span>
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
                    </div>
                </button>
                  
                  {/* Floating animation circles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-80"></div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-white font-medium">Real-time Analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-white font-medium">Interactive Maps</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-white font-medium">PDF Reports</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-4 mt-6">
                    <p className="text-sm text-gray-300">
                      Upload CSV data • Generate heat maps • Export detailed reports
                    </p>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-blue-900/50 rounded-lg border border-blue-700/30">
                    <p className="text-xs text-gray-400 italic leading-relaxed">
                      "Our vision is not just about research. It is about empowering India with data, shaping future technologies, and ensuring that safe, clean water becomes a guaranteed right, not a luxury. This is more than a platform—it is the beginning of a movement, where research meets innovation, and innovation meets impact."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features for Groundwater Analysis
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools designed for researchers, scientists, and policymakers to assess groundwater quality efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-8 rounded-xl border border-blue-700/50 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">CSV Data Integration</h3>
              <p className="text-gray-300">
                Seamlessly upload and process heavy metal concentration datasets with geo-coordinates for comprehensive analysis.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 p-8 rounded-xl border border-green-700/50 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Interactive Heat Maps</h3>
              <p className="text-gray-300">
                Generate dynamic heat maps visualizing heavy metal pollution distribution across geographical regions.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 p-8 rounded-xl border border-purple-700/50 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">PDF Report Generation</h3>
              <p className="text-gray-300">
                Create professional, categorized reports on groundwater quality based on heavy metal presence analysis.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 p-8 rounded-xl border border-orange-700/50 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Location-Based Analysis</h3>
              <p className="text-gray-300">
                Get instant HMPI reports for specific locations with nearby groundwater quality assessments.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-900/50 to-cyan-900/50 p-8 rounded-xl border border-teal-700/50 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Dual Interface</h3>
              <p className="text-gray-300">
                Separate interfaces for researchers (data upload) and users (location-based queries) with role-specific features.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 p-8 rounded-xl border border-indigo-700/50 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Automated Processing</h3>
              <p className="text-gray-300">
                Reduce manual efforts and errors with automated data processing and intelligent analysis algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                About HMPI Calculator
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The Heavy Metal Pollution Index (HMPI) Calculator is a comprehensive web-based platform designed to revolutionize groundwater quality assessment through advanced data integration and visualization.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Our platform addresses the critical need for efficient, accurate, and user-friendly tools in environmental monitoring, providing researchers, scientists, and policymakers with the tools they need to make informed decisions about groundwater quality.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-white">Scientific Accuracy</h3>
                    <p className="text-gray-300">Based on established heavy metal pollution assessment methodologies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-white">User-Friendly Design</h3>
                    <p className="text-gray-300">Intuitive interfaces for both technical and non-technical users</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold text-white">Comprehensive Reporting</h3>
                    <p className="text-gray-300">Detailed PDF reports with actionable insights and recommendations</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Key Capabilities</h3>
                    <p className="text-gray-300">Advanced groundwater analysis tools</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-900/50 rounded-lg border border-blue-700/50">
                      <span className="font-medium text-white">Data Integration</span>
                      <span className="text-blue-400 font-semibold">✓</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-900/50 rounded-lg border border-green-700/50">
                      <span className="font-medium text-white">Heat Map Generation</span>
                      <span className="text-green-400 font-semibold">✓</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-900/50 rounded-lg border border-purple-700/50">
                      <span className="font-medium text-white">PDF Reports</span>
                      <span className="text-purple-400 font-semibold">✓</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-900/50 rounded-lg border border-orange-700/50">
                      <span className="font-medium text-white">Location Analysis</span>
                      <span className="text-orange-400 font-semibold">✓</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4 text-white text-center">
                    <p className="font-semibold">Ready to get started?</p>
                    <p className="text-sm opacity-90">Join researchers worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interface Preview Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Two Powerful Interfaces
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Designed for different user needs with specialized tools and workflows
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-2xl p-8 border border-blue-700/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Researcher Interface</h3>
                <p className="text-gray-300">Advanced tools for data analysis and research</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">CSV file upload with geo-coordinates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Advanced data processing algorithms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Heat map generation and visualization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Comprehensive data export options</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-2xl p-8 border border-green-700/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">User Interface</h3>
                <p className="text-gray-300">Simple access to location-based information</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Location-based HMPI reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Interactive map exploration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Nearby groundwater quality data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Easy-to-understand visualizations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Groundwater Analysis?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join researchers and policymakers worldwide in advancing groundwater quality assessment with our comprehensive HMPI calculator platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Your Analysis
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300">
              View Documentation
            </button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-300">Data Points Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-300">Research Institutions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-300">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Researcher Modal */}
      {showResearcherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Researcher Access</h3>
              <p className="text-gray-300">Choose your preferred access method</p>
            </div>
            
            <div className="space-y-4 mb-6">
              {/* Animated Login Button */}
              <div className="relative group">
                {/* Continuous pulsing ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg animate-pulse opacity-30"></div>
                
              <button
                onClick={handleLogin}
                  className="relative w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  {/* Animated background circle */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Pulsing ring animation */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-75 group-hover:opacity-100 animate-ping"></div>
                  
                  {/* Content */}
                  <div className="relative flex items-center justify-center">
                    <span className="mr-2">Login to Dashboard</span>
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
                  </div>
              </button>
                
                {/* Floating animation circles */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-80"></div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              
              <button
                onClick={handleRegister}
                className="w-full px-6 py-3 border-2 border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Register New Account
              </button>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-200 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-600">
              <div className="text-xs text-gray-400 text-center space-y-1">
                <p><strong className="text-gray-300">Researcher Features:</strong></p>
                <p>• CSV data upload & processing</p>
                <p>• Advanced HMPI calculations</p>
                <p>• Heat map generation</p>
                <p>• Professional PDF reports</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home