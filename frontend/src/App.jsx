import React, { useState } from 'react';
import axios from 'axios';

// Konfigurasi Base URL API Backend Laravel Anda
const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [formData, setFormData] = useState({
    crewName: '',
    crewId: '',
    flightNumber: '',
    flightDate: '',
    aircraftType: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper untuk mengubah YYYY-MM-DD (input date) ke DD-MM-YYYY (kebutuhan backend)
  const formatDateToBackend = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessData(null);

    const formattedDate = formatDateToBackend(formData.flightDate);

    try {
      // 1. Flow Langkah 1: POST /api/check
      const checkResponse = await axios.post(`${API_BASE_URL}/check`, {
        flightNumber: formData.flightNumber,
        date: formattedDate
      });

      if (checkResponse.data.exists) {
        setError('Vouchers have already been generated for this flight and date.');
        setLoading(false);
        return;
      }

      // 2. Flow Langkah 2: POST /api/generate
      const generateResponse = await axios.post(`${API_BASE_URL}/generate`, {
        name: formData.crewName,
        id: formData.crewId,
        flightNumber: formData.flightNumber,
        date: formattedDate,
        aircraft: formData.aircraftType
      });

      if (generateResponse.data.success) {
        setSuccessData({
          seats: generateResponse.data.seats,
          summary: { ...formData }
        });
      } else {
        setError('Failed to generate vouchers. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred connection to the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setFormData({
      crewName: '',
      crewId: '',
      flightNumber: '',
      flightDate: '',
      aircraftType: ''
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white text-center py-12 px-4 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-700/30 via-transparent to-transparent"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-blue-800/60 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3 backdrop-blur-sm border border-blue-700/50">
            ✈ Flight Operations
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Airline Voucher Seat Assignment
          </h1>
          <p className="text-blue-200 text-sm md:text-base max-w-xl mx-auto font-light">
            Generate 3 unique seat vouchers for flight crew based on aircraft type specifications.
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Panel: Input Form */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 md:p-8 transition-all">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              👤 Crew & Flight Information
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Fill in the operational details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Crew Name</label>
              <input
                type="text"
                name="crewName"
                required
                value={formData.crewName}
                onChange={handleChange}
                placeholder="e.g., Sarah"
                className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Crew ID</label>
              <input
                type="text"
                name="crewId"
                required
                value={formData.crewId}
                onChange={handleChange}
                placeholder="e.g., 98123"
                className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Flight Number</label>
                <input
                  type="text"
                  name="flightNumber"
                  required
                  value={formData.flightNumber}
                  onChange={handleChange}
                  placeholder="e.g., GA102"
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Flight Date</label>
                <input
                  type="date"
                  name="flightDate"
                  required
                  value={formData.flightDate}
                  onChange={handleChange}
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Aircraft Type</label>
              <select
                name="aircraftType"
                required
                value={formData.aircraftType}
                onChange={handleChange}
                className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-colors"
              >
                <option value="">-- Select Aircraft Type --</option>
                <option value="ATR">ATR (Rows 1-18, Seats A-C-D-F)</option>
                <option value="Airbus 320">Airbus 320 (Rows 1-32, Seats A-F)</option>
                <option value="Boeing 737 Max">Boeing 737 Max (Rows 1-32, Seats A-F)</option>
              </select>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-lg flex items-start gap-2 mt-2">
                <span className="mt-0.5">⚠️</span>
                <div>
                  <span className="font-bold">Error:</span> {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-sm font-semibold text-white py-3 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 mt-4 transition-all ${
                loading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>🎟 Generate Vouchers</>
              )}
            </button>
          </form>

          {/* Info Banner */}
          <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-lg p-3.5 text-xs text-blue-700 flex gap-2.5">
            <span className="text-base">ℹ️</span>
            <p>
              <strong>How it works:</strong> System checks if vouchers already exist for the selected flight number and date. If clear, 3 random non-repeating valid seats will be assigned.
            </p>
          </div>
        </div>

        {/* Right Panel: Conditional Results Display */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 md:p-8 flex flex-col justify-between min-h-[400px]">
          {!successData ? (
            <div className="flex flex-col items-center justify-center text-center my-auto p-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-4 border border-dashed border-slate-200">
                🎫
              </div>
              <h3 className="text-sm font-bold text-slate-700">No Vouchers Generated</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Fill out the crew and flight operations form on the left to allocate unique seats.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  🎟 Voucher Result
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-light">Your generated seat allocations</p>
              </div>

              {/* Success Notification Alert */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-lg flex items-center gap-3">
                <span className="text-emerald-500 text-lg">✅</span>
                <div>
                  <p className="font-bold">Vouchers generated successfully!</p>
                  <p className="text-emerald-600/90">3 unique seats have been assigned for this specific flight schedule.</p>
                </div>
              </div>

              {/* Seat Ticket Badges Grid */}
              <div className="grid grid-cols-3 gap-3">
                {successData.seats.map((seat, index) => (
                  <div key={index} className="bg-gradient-to-b from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl p-4 text-center shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                    <span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Seat {index + 1}</span>
                    <span className="block text-2xl md:text-3xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{seat}</span>
                    <div className="w-2 h-2 rounded-full bg-slate-200 absolute -left-1 top-1/2 -translate-y-1/2"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-200 absolute -right-1 top-1/2 -translate-y-1/2"></div>
                  </div>
                ))}
              </div>

              {/* Data Summary Section */}
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 pb-1.5 border-b border-slate-200/60">
                  Flight Summary
                </h4>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between"><dt className="text-slate-400">Crew Name</dt><dd className="font-semibold text-slate-700">{successData.summary.crewName}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Crew ID</dt><dd className="font-mono bg-slate-200/50 px-1.5 py-0.5 rounded text-slate-600">{successData.summary.crewId}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Flight Number</dt><dd className="font-bold text-blue-600">{successData.summary.flightNumber}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Flight Date</dt><dd className="font-semibold text-slate-700">{formatDateToBackend(successData.summary.flightDate)}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Aircraft Type</dt><dd className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium text-[11px]">{successData.summary.aircraftType}</dd></div>
                </dl>
              </div>

              {/* Reset / Generate Another Action */}
              <button
                onClick={handleReset}
                className="w-full text-xs font-bold text-slate-500 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 py-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5"
              >
                🔄 Generate Another Assignment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-400 mt-12 space-y-1">
        <p>✈️ Airline Voucher System</p>
        <p className="font-light">© 2026 All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;