import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('mahasiswa'); // Default role
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            // Mengirim data ke endpoint POST /api/auth/register
            const response = await axios.post('http://localhost:3001/api/auth/register', {
                nama,
                email,
                password,
                role
            });
            
            setSuccess(response.data.message);
            // Setelah berhasil register, arahkan pengguna ke halaman /login [cite: 1079]
            setTimeout(() => navigate('/login'), 2000); 

        } catch (err) {
            setError(err.response ? err.response.data.message : 'Registrasi gagal.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Input Nama [cite: 1077] */}
                    <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama:</label>
                        <input id="nama" type="text" value={nama} onChange={(e) => setNama(e.target.value)} required
                            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    
                    {/* Input Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    
                    {/* Input Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>

                    {/* Input Role [cite: 1077] */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role:</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700">
                        Register
                    </button>
                </form>

                {success && (<p className="text-green-600 text-sm mt-4 text-center">{success}</p>)}
                {error && (<p className="text-red-600 text-sm mt-4 text-center">{error}</p>)}
                
                <p className="mt-4 text-center text-sm text-gray-600">
                    Sudah punya akun? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">Login di sini</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;