import React, { useState } from 'react';
import axios from 'axios';

// Sesuaikan Base URL dengan port server Laravel Anda
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

  // Helper untuk mengubah format YYYY-MM-DD (HTML5) ke DD-MM-YYYY (Spesifikasi Backend)
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
    // 1. Panggilan Pertama: POST /api/check
    const checkResponse = await axios.post(`${API_BASE_URL}/check`, {
      flightNumber: formData.flightNumber,
      date: formattedDate
    });

    if (checkResponse.data.exists) {
      setError('Vouchers have already been generated for this flight and date.');
      setLoading(false);
      return;
    }

    // 2. Panggilan Kedua: POST /api/generate
    const generateResponse = await axios.post(`${API_BASE_URL}/generate`, {
      name: formData.crewName,
      id: formData.crewId,
      flightNumber: formData.flightNumber,
      date: formattedDate,
      aircraft: formData.aircraftType
    });

    // --- PERBAIKAN DI SINI ---
    // Backend Anda mengembalikan { success: true, data: { seats: [...], ... } }
    if (generateResponse.data.success) {
      const responseData = generateResponse.data.data; // Ambil objek 'data' di dalam response
      
      setSuccessData({
        seats: responseData.seats, // Sekarang membaca array ["16D", "13A", "30F"] dengan benar
        summary: {
          crewName: responseData.crewName,
          crewId: responseData.crewId,
          flightNumber: responseData.flightNumber,
          flightDate: formData.flightDate, // Tetap gunakan input lokal agar format date di UI konsisten
          aircraftType: responseData.aircraft
        }
      });
    } else {
      setError('Failed to generate vouchers. Please try again.');
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      setError(err.response.data.message);
    } else {
      setError('Could not connect to the server. Make sure your backend is running.');
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
          <span className="inline-flex items-center gap-1.5 bg-blue-800/60 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-blue-700/50">
            ✈ Flight Operations
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Airline Voucher Seat Assignment
          </h1>
          <p className="text-blue-200 text-sm md:text-base max-w-xl mx-auto font-light">
            Generate 3 unique seat vouchers for flight crew based on aircraft type[cite: 1].
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Panel Kiri: Form Input */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              👤 Crew & Flight Information
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Fill in the details below to generate seat vouchers[cite: 1]</p>
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
                placeholder="Sarah"
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
                placeholder="98123"
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
                  placeholder="GA102"
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
                <option value="ATR">ATR</option>
                <option value="Airbus 320">Airbus 320</option>
                <option value="Boeing 737 Max">Boeing 737 Max</option>
              </select>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-lg flex items-start gap-2 mt-2">
                <span>⚠️</span>
                <div><span className="font-bold">Error:</span> {error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-sm font-semibold text-white py-3 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 mt-4 transition-all ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
              }`}
            >
              {loading ? 'Processing...' : '🎟 Generate Vouchers'}
            </button>
          </form>

          <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-lg p-3.5 text-xs text-blue-700 flex gap-2.5">
            <span>ℹ️</span>
            <p><strong>How it works:</strong> We'll check if vouchers already exist for this flight. If not, 3 unique seats will be generated automatically based on the selected aircraft[cite: 1].</p>
          </div>
        </div>

        {/* Panel Kanan: Hasil Voucher */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 md:p-8 flex flex-col justify-between min-h-[400px]">
          {!successData ? (
            <div className="flex flex-col items-center justify-center text-center my-auto p-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-4 border border-dashed border-slate-200">🎫</div>
              <h3 className="text-sm font-bold text-slate-700">No Vouchers Generated</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">Fill out the crew and flight information form to allocate unique seats.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">🎟 Voucher Result</h2>
                <p className="text-xs text-slate-400 mt-0.5">Your generated seat vouchers</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-lg flex items-center gap-3">
                <span className="text-emerald-500 text-lg">✅</span>
                <div>
                  <p className="font-bold">Vouchers generated successfully!</p>
                  <p className="text-emerald-600/90">3 unique seats have been assigned for this flight[cite: 1].</p>
                </div>
              </div>

              {/* Tampilan 3 Tiket Kursi */}
              <div className="grid grid-cols-3 gap-3">
                {successData.seats.map((seat, index) => (
                  <div key={index} className="bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 text-center shadow-sm relative overflow-hidden">
                    <span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Seat {index + 1}</span>
                    <span className="block text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{seat}</span>
                    <div className="w-2 h-4 rounded-r-full bg-slate-200 absolute left-0 top-1/2 -translate-y-1/2"></div>
                    <div className="w-2 h-4 rounded-l-full bg-slate-200 absolute right-0 top-1/2 -translate-y-1/2"></div>
                  </div>
                ))}
              </div>

              {/* Flight Summary ringkasan */}
              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 pb-1.5 border-b border-slate-200/60">Flight Summary</h4>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between"><dt className="text-slate-400">Crew Name</dt><dd className="font-semibold text-slate-700">{successData.summary.crewName}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Crew ID</dt><dd className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">{successData.summary.crewId}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Flight Number</dt><dd className="font-bold text-blue-600">{successData.summary.flightNumber}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Flight Date</dt><dd className="font-semibold text-slate-700">{formatDateToBackend(successData.summary.flightDate)}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Aircraft Type</dt><dd className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium text-[11px]">{successData.summary.aircraftType}</dd></div>
                </dl>
              </div>

              <button
                onClick={handleReset}
                className="w-full text-xs font-bold text-slate-500 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 py-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5"
              >
                🔄 Generate Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;