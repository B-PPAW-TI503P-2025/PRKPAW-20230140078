import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import 'leaflet/dist/leaflet.css';
import Webcam from 'react-webcam'; // Pastikan install: npm install react-webcam

// Konfigurasi Icon Leaflet
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
  const [coords, setCoords] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State & Ref untuk Kamera
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const getToken = () => localStorage.getItem("token");

  // Fungsi Capture Foto dari Webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // Fungsi Mendapatkan Lokasi GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (err) => {
          setError(`Gagal mendapatkan lokasi: ${err.message}`);
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation tidak didukung browser ini.");
      setIsLoading(false);
    }
  }, []);

  const handleCheckIn = async () => {
    if (!coords) return setError("Lokasi belum didapatkan.");
    if (!image) return setError("Wajib ambil foto selfie!");

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      // 1. Ubah Base64 Image menjadi Blob/File
      const blob = await (await fetch(image)).blob();

      // 2. Gunakan FormData untuk kirim file + data teks
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('image', blob, 'selfie.jpg'); // 'image' harus sesuai dengan backend (upload.single('image'))

      const response = await axios.post(
  "http://localhost:3001/api/presensi/check-in",
  formData,
  {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      // Jangan tulis Content-Type di sini!
    },
  }
);

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    if (!coords) return setError("Lokasi diperlukan.");
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        { latitude: coords.lat, longitude: coords.lng },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-out gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-10 px-4 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Presensi Harian</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* KOTAK KIRI: PETA */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">Lokasi Anda</h3>
          {isLoading ? (
            <p className="animate-pulse text-gray-500">Mencari lokasi...</p>
          ) : coords ? (
            <div className="h-64 rounded-lg overflow-hidden border">
              <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>Posisi Anda</Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <p className="text-red-500">{error}</p>
          )}
        </div>

        {/* KOTAK KANAN: KAMERA & AKSI */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-indigo-700">Ambil Foto Selfie</h3>
          
          <div className="w-full bg-black rounded-lg overflow-hidden mb-4 relative" style={{ minHeight: '250px' }}>
            {image ? (
              <img src={image} alt="Selfie" className="w-full h-full object-cover" />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex w-full gap-2 mb-6">
            {!image ? (
              <button onClick={capture} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">📸 Ambil Foto</button>
            ) : (
              <button onClick={() => setImage(null)} className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600">🔄 Foto Ulang</button>
            )}
          </div>

          {message && <p className="text-green-600 mb-2 font-medium">{message}</p>}
          {error && <p className="text-red-600 mb-2 font-medium">{error}</p>}

          <div className="flex w-full gap-4">
            <button onClick={handleCheckIn} disabled={isSubmitting} className="flex-1 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400">
              Check-In
            </button>
            <button onClick={handleCheckOut} disabled={isSubmitting} className="flex-1 bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 disabled:bg-gray-400">
              Check-Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;