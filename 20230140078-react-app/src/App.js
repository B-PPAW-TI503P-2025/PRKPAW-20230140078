import React, { useState } from 'react';

function App() {
  // Definisikan state untuk menyimpan input nama
  const [name, setName] = useState(''); 

  // Handler untuk memperbarui state setiap kali input diubah
  const handleNameChange = (event) => {
    setName(event.target.value); 
  };

  return (
    <div>
      {/* Ini adalah bagian yang menyelesaikan Tugas 1: Menampilkan Hello, [nama]! */}
      <h1>Hello, {name || '[nama]'}!</h1> 
      
      <p>Masukkan nama Anda:</p>
      <input
        type="text"
        value={name}
        onChange={handleNameChange} // Hubungkan input dengan handler
        placeholder="Ketik nama di sini"
      />
    </div>
  );
}

export default App;