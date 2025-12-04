import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // BENAR: Menggunakan Named Export

function DashboardPage() {
    const [userName, setUserName] = useState('Pengguna');
    const [userRole, setUserRole] = useState('...');
    const navigate = useNavigate();

    // Fungsi Logout (tetap sama)
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            // Tambahkan pengecekan exp (kedaluwarsa)
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                console.warn("Token telah kedaluwarsa.");
                handleLogout();
                return;
            }
            
            setUserName(decoded.nama || decoded.email || 'Pengguna');
            setUserRole(decoded.role || 'N/A');

        } catch (error) {
            console.error("Token tidak valid:", error);
            handleLogout();
        }
    }, [navigate]);

    // Tentukan apakah user adalah mahasiswa atau admin
    const isMahasiswa = userRole.toLowerCase() === 'mahasiswa';
    const isAdmin = userRole.toLowerCase() === 'admin';

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
            <div className="bg-white p-12 rounded-xl shadow-2xl text-center w-full max-w-md">
                <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
                    Selamat Datang, <br className="md:hidden" />**{userName}**!
                </h1>
                <p className="text-lg text-gray-600 mb-6 border-b pb-4">
                    Anda berhasil login sebagai <span className="font-bold uppercase text-indigo-500">{userRole}</span>.
                </p>
                
                <div className="mt-6">
                    <p className="text-gray-500 mb-6 text-sm italic">
                        Silakan pilih aksi yang ingin Anda lakukan.
                    </p>
                </div>

                {/* Tombol Aksi: Absensi (mahasiswa) atau Report (admin) */}
                <div className="flex flex-col space-y-4 mt-8">
                    
                    {/* Tombol Absensi untuk MAHASISWA */}
                    {isMahasiswa && (
                        <button
                            onClick={() => navigate('/presensi')} 
                            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 transform hover:scale-[1.01]"
                        >
                            📍 Lakukan Presensi / Absensi
                        </button>
                    )}

                    {/* Tombol Report untuk ADMIN */}
                    {isAdmin && (
                        <button
                            onClick={() => navigate('/reports')} // <--- Navigasi ke rute reports
                            className="w-full py-3 px-6 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-150 transform hover:scale-[1.01]"
                        >
                            📈 Lihat Report Presensi
                        </button>
                    )}

                    {/* Tombol Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 px-6 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-150"
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;