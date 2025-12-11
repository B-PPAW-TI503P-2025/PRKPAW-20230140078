import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // 1. STATE UNTUK MODAL (Menyimpan URL foto yang sedang diklik)
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const url = query 
        ? `http://localhost:3001/api/reports/daily?nama=${query}` 
        : "http://localhost:3001/api/reports/daily";
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(response.data.data);
    } catch (err) {
      setReports([]);
      setError(err.response ? err.response.data.message : "Gagal mengambil data");
    }
  };

  useEffect(() => {
    fetchReports("");
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  // Helper function untuk URL Gambar
  const getPhotoUrl = (filename) => {
    return `http://localhost:3001/uploads/${filename}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Presensi Harian</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Cari
        </button>
      </form>

      {error && <p className="text-red-600 mb-4 bg-red-100 p-3 rounded">{error}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama</th>
              {/* KOLOM BUKTI FOTO */}
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Bukti Foto</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Check-In</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Check-Out</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Lokasi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length > 0 ? (
              reports.map((presensi) => (
                <tr key={presensi.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {presensi.user ? presensi.user.nama : "N/A"}
                  </td>
                  
                  {/* 2. TAMPILAN THUMBNAIL (FOTO KECIL) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {presensi.buktiFoto ? (
                      <div className="relative group w-12 h-12">
                        <img 
                          src={getPhotoUrl(presensi.buktiFoto)} 
                          alt="Bukti" 
                          className="h-12 w-12 object-cover rounded border border-gray-300 cursor-pointer shadow-sm hover:scale-105 transition-transform"
                          // Event Saat Klik: Set URL ke state Modal
                          onClick={() => setSelectedPhoto(getPhotoUrl(presensi.buktiFoto))}
                        />
                        {/* Tooltip kecil saat hover */}
                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs p-1 rounded whitespace-nowrap">
                            Klik untuk perbesar
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic bg-gray-100 px-2 py-1 rounded">No Photo</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(presensi.checkIn).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {presensi.checkOut ? new Date(presensi.checkOut).toLocaleString("id-ID") : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {presensi.latitude}, {presensi.longitude}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Data tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. MODAL / POPUP FOTO UKURAN PENUH */}
      {selectedPhoto && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 transition-opacity backdrop-blur-sm" 
            // Klik area hitam untuk menutup
            onClick={() => setSelectedPhoto(null)}
        >
            <div className="relative bg-white p-2 rounded-lg shadow-2xl max-w-3xl max-h-full overflow-hidden animate-fade-in">
                {/* Tombol Close (X) */}
                <button 
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-red-700 transition shadow-md"
                    title="Tutup"
                >
                    &times;
                </button>
                
                {/* Gambar Utama */}
                <img 
                    src={selectedPhoto} 
                    alt="Bukti Full Size" 
                    className="max-w-full max-h-[85vh] object-contain rounded block mx-auto" 
                />
                <p className="text-center text-gray-500 text-sm mt-2">Bukti Kehadiran</p>
            </div>
        </div>
      )}

    </div>
  );
}

export default ReportPage;