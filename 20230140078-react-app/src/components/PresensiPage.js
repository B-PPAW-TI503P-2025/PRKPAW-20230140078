import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import 'leaflet/dist/leaflet.css'; // Pastikan CSS Leaflet diimpor

// Mengatur ikon Leaflet secara global
L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null); // {lat, lng}
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk mencegah double-click

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Fungsi untuk mendapatkan lokasi pengguna
  const getLocation = () => {
    setError(""); // Reset error saat mencoba lokasi
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
          setMessage("Lokasi Anda berhasil dideteksi.");
        },
        (error) => {
          // Gagal mendapatkan lokasi
          setError(`Gagal mendapatkan lokasi: ${error.message}. Mohon izinkan akses lokasi.`);
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Memuat lokasi saat komponen dimuat
    getLocation();
  }, []);

  const handleCheckIn = async () => {
    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }
    if (isSubmitting) return; // Mencegah double click
    
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in", // Pastikan rute presensi di sini
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      // Menangani error dari backend (400, 401, 403, 500)
      let errorMessage = "Check-in gagal: Terjadi kesalahan koneksi.";
      if (err.response) {
        // Ambil pesan error dari data respons backend
        errorMessage = err.response.data.message || `Server Error: ${err.response.status}`;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    if (!coords) {
      setError("Lokasi belum didapatkan. Check-out memerlukan lokasi.");
      return;
    }
    if (isSubmitting) return; 

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };
      
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out", // Sesuaikan rute check-out
        {
            latitude: coords.lat, // Mengirim lokasi untuk check-out juga
            longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      let errorMessage = "Check-out gagal: Terjadi kesalahan koneksi.";
      if (err.response) {
        errorMessage = err.response.data.message || `Server Error: ${err.response.status}`;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Menentukan class tombol berdasarkan status
  const buttonClass = (baseColor) => 
    `w-full py-3 px-4 text-white font-semibold rounded-md shadow-sm transition duration-150 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : baseColor}`;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-10 font-sans">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Halaman Presensi</h1>

        {/* Kotak Status dan Peta */}
        <div className="bg-white p-4 rounded-xl shadow-lg w-full mb-8 px-8 max-w-6xl">
            <h3 className="text-xl font-semibold mb-2 text-indigo-700">
                Lokasi Terdeteksi:
            </h3>

            {isLoading ? (
                <div className="text-center py-10">
                    <p className="text-xl font-semibold text-blue-600 animate-pulse">
                        Memuat Peta dan Mendeteksi Lokasi...
                    </p>
                    {error && <p className="text-red-600 mt-4">{error}</p>}
                </div>
            ) : (
                <>
                    <div className="text-sm text-gray-500 mb-2">
                        Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}
                    </div>
                    
                    <div className="my-4 border rounded-lg overflow-hidden shadow-inner">
                        <MapContainer
                            center={[coords.lat, coords.lng]}
                            zoom={15}
                            scrollWheelZoom={false}
                            style={{ height: "400px", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[coords.lat, coords.lng]}>
                                <Popup>Lokasi Presensi Anda</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </>
            )}
        </div>
        
        {/* Kotak Aksi Presensi */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Lakukan Aksi
            </h2>

            {message && <p className="text-green-600 mb-4 font-medium">{message}</p>}
            {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

            <div className="flex space-x-4">
                <button
                    onClick={handleCheckIn}
                    disabled={isLoading || isSubmitting}
                    className={buttonClass('bg-green-600 hover:bg-green-700')}
                >
                    {isSubmitting ? 'Memproses...' : 'Check-In'}
                </button>

                <button
                    onClick={handleCheckOut}
                    disabled={isLoading || isSubmitting}
                    className={buttonClass('bg-red-600 hover:bg-red-700')}
                >
                    {isSubmitting ? 'Memproses...' : 'Check-Out'}
                </button>
            </div>
            
             <p className="mt-4 text-xs text-gray-400">Tombol dinonaktifkan saat lokasi sedang dimuat.</p>
        </div>
    </div>
  );
}

export default AttendancePage;