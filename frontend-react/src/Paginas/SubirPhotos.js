// UploadPhoto.js
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { MyThemeProvider, uploadPhotoStyles } from '../Estilos/SubirPhotos'; // Importa MyThemeProvider y uploadPhotoStyles desde el archivo de estilos

export default function UploadPhoto() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadPhoto = async () => {
    try {
      if (!selectedFile) {
        throw new Error('No se ha seleccionado ningún archivo.');
      }

      console.log('selectedFile:', selectedFile);

      const formData = new FormData();
      formData.append('photo', selectedFile);

      console.log('formData:', formData);

      const response = await fetch('http://localhost:80/cargar-fotos', {
        method: 'POST',
        body: formData,
      }); 

      console.log('Response:', response);
      if (!response.ok) {
        throw new Error('Error al subir la foto.');
      }
    } catch (error) {
      console.error('Error al subir la foto:', error.message);
    }
  };

  return (
    <MyThemeProvider> {/* Usa MyThemeProvider para envolver tu componente */}
      <div
        style={uploadPhotoStyles} // Usa el objeto de estilos para aplicar los estilos al contenedor principal
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="upload-photo-input"
        />
        <label htmlFor="upload-photo-input">
          <Button variant="contained" component="span" style={{ marginBottom: '20px' }}>
            Seleccionar foto
          </Button>
        </label>
        {selectedFile && (
          <p style={{ marginTop: '20px' }}>
            Archivo seleccionado: {selectedFile.name}
          </p>
        )}
        <Button
          variant="contained"
          onClick={handleUploadPhoto}
          disabled={!selectedFile}
          style={{ marginTop: '20px' }}
        >
          Subir foto
        </Button>
        <Link to="/photos" style={{ marginTop: '20px' }}>
          <Button variant="contained">
            Volver a página principal
          </Button>
        </Link>
      </div>
    </MyThemeProvider>
  );
}
