// src/components/ImageUpload.js
import React, { useState, useRef } from 'react';
import { uploadMultipleImages, validateImageFiles } from '../firebase/imageUploadService';

const ImageUpload = ({ selectedFiles, setSelectedFiles, maxImages = 10 }) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setError('');

    // Validar archivos
    const validation = validateImageFiles(files);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    // Limitar cantidad de imágenes
    if (files.length > maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    // Actualizar archivos seleccionados en el componente padre
    setSelectedFiles(files);

    // Crear previews
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };


  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Seleccionar Imágenes</h3>
      
      <div style={styles.uploadArea}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={styles.fileInput}
        />
        <div style={styles.uploadText}>
          <p>📷 Haz clic para seleccionar imágenes</p>
          <p style={styles.uploadSubtext}>
            Máximo {maxImages} imágenes • JPG, PNG, WEBP • 5MB por imagen
          </p>
          <p style={styles.uploadSubtext}>
            Las imágenes se subirán al guardar la propiedad
          </p>
        </div>
      </div>

      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}

      {previewUrls.length > 0 && (
        <div style={styles.previewContainer}>
          <div style={styles.previewHeader}>
            <span>Vista previa ({previewUrls.length} imágenes)</span>
            <button 
              onClick={clearAll}
              style={styles.clearButton}
            >
              Limpiar todo
            </button>
          </div>
          
          <div style={styles.previewGrid}>
            {previewUrls.map((url, index) => (
              <div key={index} style={styles.previewItem}>
                <img 
                  src={url} 
                  alt={`Preview ${index + 1}`}
                  style={styles.previewImage}
                />
                <button
                  onClick={() => removeFile(index)}
                  style={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

const styles = {
  container: {
    margin: '20px 0',
    padding: '20px',
    border: '2px dashed #e0e0e0',
    borderRadius: '10px',
    backgroundColor: '#fafafa',
  },
  title: {
    margin: '0 0 15px 0',
    color: '#0b1f44',
    fontSize: '18px',
    fontWeight: '600',
  },
  uploadArea: {
    position: 'relative',
    textAlign: 'center',
    padding: '20px',
    border: '2px dashed #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  uploadText: {
    margin: 0,
    color: '#666',
  },
  uploadSubtext: {
    fontSize: '12px',
    margin: '5px 0 0 0',
    color: '#999',
  },
  errorMessage: {
    background: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '6px',
    margin: '10px 0',
    fontSize: '14px',
    border: '1px solid #ffcdd2',
  },
  previewContainer: {
    marginTop: '15px',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    background: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '10px',
  },
  previewItem: {
    position: 'relative',
    aspectRatio: '1',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '2px solid #e0e0e0',
  },
  removeButton: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default ImageUpload;

