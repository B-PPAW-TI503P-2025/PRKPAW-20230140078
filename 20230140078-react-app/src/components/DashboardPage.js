// src/components/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// BENAR: Menggunakan Named Export
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
    const [userName, setUserName] = useState('Pengguna');
    const [userRole, setUserRole] = useState('...');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Jika tidak ada token, paksa user kembali ke login
            navigate('/login');
            return;
        }

        try {
            // Mengambil payload dari token
            const decoded = jwtDecode(token);
            setUserName(decoded.nama || decoded.email || 'Pengguna'); // Mengambil nama dari payload
            setUserRole(decoded.role || 'N/A');

        } catch (error) {
            console.error("Token tidak valid:", error);
            handleLogout(); // Hapus token jika rusak
        }
    }, [navigate]);

    // Implementasikan Fungsi Logout [cite: 1084-1086]
    const handleLogout = () => {
        localStorage.removeItem('token'); // Menghapus token dari localStorage [cite: 1085]
        navigate('/login'); // Mengarahkan pengguna kembali ke halaman /login [cite: 1086]
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
            <div className="bg-white p-10 rounded-lg shadow-xl text-center w-full max-w-lg">
                <h1 className="text-4xl font-extrabold text-indigo-600 mb-3">
                    Selamat Datang, {userName}!
                </h1>
                <p className="text-xl text-gray-700 mb-2">
                    Anda berhasil login sebagai **{userRole}**.
                </p>
                
                <div className="mt-8">
                    <p className="text-gray-500 mb-4">
                        Ini adalah halaman dashboard Anda yang sudah terautentikasi.
                    </p>
                </div>

                {/* Tombol Logout [cite: 1082] */}
                <button
                    onClick={handleLogout}
                    className="mt-6 py-2 px-6 bg-red-600 text-white font-semibold rounded-md shadow-lg hover:bg-red-700 transition duration-150"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default DashboardPage;