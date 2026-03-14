import React, { useState } from 'react';
import './App.css';
import Swal from 'sweetalert2';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Image, 
  Terminal,
  HardDrive,
  MessageSquare,
  Settings,
  Key,
  BarChart3,
  Cpu
} from 'lucide-react';
import { Steganography } from './utils/steganography';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [secretText, setSecretText] = useState('');
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  const [loading, setLoading] = useState(false);
  const [capacity, setCapacity] = useState<number>(0);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setSecretText('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Calcular capacidade
    try {
      const cap = await Steganography.calculateCapacity(file);
      setCapacity(cap);
    } catch (error) {
      console.error('Erro ao calcular capacidade:', error);
    }
  };

  const handleEncode = async () => {
    if (!selectedFile || !secretText) return;
    
    setLoading(true);
    
    try {
      const encodedImageUrl = await Steganography.encode(selectedFile, secretText);
      
            const link = document.createElement('a');
      link.href = encodedImageUrl;
      link.download = 'encoded_image.png';
      link.click();

      Swal.fire({
        title: 'Encode Complete!',
        html: `
          <div style="text-align: left; background: #2d3748; padding: 16px; border-radius: 12px; margin: 16px 0; color: white;">
            <p style="margin: 8px 0;"><strong style="color: #3b82f6;">File:</strong> ${selectedFile.name}</p>
            <p style="margin: 8px 0;"><strong style="color: #3b82f6;">Message:</strong> ${secretText.length} caracteres</p>
            <p style="margin: 8px 0;"><strong style="color: #3b82f6;">Status:</strong> Mensagem escondida com sucesso!</p>
          </div>
        `,
        icon: 'success',
        background: '#1a1e24',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      Swal.fire({
        title: 'Erro',
        text: error instanceof Error ? error.message : 'Erro ao esconder mensagem',
        icon: 'error',
        background: '#1a1e24',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecode = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    
    try {
      const decodedMessage = await Steganography.decode(selectedFile);
      
      Swal.fire({
        title: ' Message Revealed!',
        html: `
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 24px; border-radius: 16px; margin: 16px 0;">
            <p style="font-size: 18px; color: white; font-weight: 500; word-break: break-word;">"${decodedMessage}"</p>
          </div>
          <p style="color: #9ca3af; font-size: 14px;">LSB Decode v2.1 • Mensagem recuperada com sucesso!</p>
        `,
        icon: 'success',
        background: '#1a1e24',
        color: '#fff',
        confirmButtonColor: '#8b5cf6',
        confirmButtonText: 'Legal!',
      });
    } catch (error) {
      Swal.fire({
        title: ' Erro',
        text: error instanceof Error ? error.message : 'Nenhuma mensagem encontrada',
        icon: 'error',
        background: '#1a1e24',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSecretText('');
    setCapacity(0);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 KB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div className="app">
      
      <nav className="navbar">
        <div className="logo-section">
          <div className="logo-icon">
            <Shield size={20} />
          </div>
          <div className="logo-text">
            <h1>Steganography CMS</h1>
          </div>
        </div>

        <div className="tab-container">
          <button 
            className={`tab-button encode ${activeTab === 'encode' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('encode');
              setSecretText('');
            }}
          >
            <Lock size={14} />
            Encode
          </button>
          <button 
            className={`tab-button decode ${activeTab === 'decode' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('decode');
              setSecretText('');
            }}
          >
            <Unlock size={14} />
            Decode
          </button>
      
        </div>
      </nav>

      <div className="stats-bar">
        <div className="stat-item">
      
          <HardDrive size={24} />
      
          <div className="stat-info">
      
            <span className="stat-label">Image Size</span>
            <span className="stat-value">{selectedFile ? formatFileSize(selectedFile.size) : '0 KB'}</span>
      
          </div>
      
        </div>
        <div className="stat-item">
      
          <Cpu size={24} />
      
          <div className="stat-info">
      
            <span className="stat-label">Capacity</span>
            <span className="stat-value">{capacity > 0 ? `${capacity} chars` : '0 chars'}</span>
      
          </div>
      
        </div>
        <div className="stat-item">
          <Key size={24} />
          <div className="stat-info">
            <span className="stat-label">Mode</span>
            <span className="stat-value">{activeTab === 'encode' ? 'LSB-256' : 'LSB-DEC'}</span>
          </div>
        </div>
        <div className="stat-item">
      
          <MessageSquare size={24} />
      
          <div className="stat-info">
      
            <span className="stat-label">Message</span>
            <span className="stat-value">{secretText.length} chars</span>
      
          </div>
      
        </div>
        <div className="stat-item">
          <BarChart3 size={24} />
          <div className="stat-info">
            <span className="stat-label">Progress</span>
            <span className="stat-value">{selectedFile ? (secretText.length > 0 ? 'Ready' : 'Idle') : 'Waiting'}</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* Left Panel */}
        <div className="card">
          <div className="card-header">
            <Terminal size={18} />
            <h2>Input Configuration</h2>
          </div>
          <div className="card-content">
            {!previewUrl ? (
              <div 
                className="upload-area"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  id="file-input"
                  hidden
                />
                <Image />
                <p>Select image file</p>
                <span className="upload-hint">PNG, JPG • Max 10MB</span>
              </div>
            ) : (
              <div className="preview-container">
                <div className="preview-header">
                  
                  <span>📁 {selectedFile?.name}</span>
                  
                  <button onClick={clearImage}>✕</button>
                
                </div>
                
                <div className="preview-image">
                 
                  <img src={previewUrl} alt="Preview" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="card">
          <div className="card-header">
            <Settings size={18} />
            <h2>Output Console</h2>
          </div>
          <div className="card-content">
            {/* esse é o primeiro button ,  */}
            <button 
              className={`action-button ${activeTab}`}
              onClick={activeTab === 'encode' ? handleEncode : handleDecode}
              disabled={
                !selectedFile || 
                (activeTab === 'encode' && (!secretText || secretText.length > capacity)) || 
                loading
              }
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  {activeTab === 'encode' ? <Lock size={16} /> : <Unlock size={16} />}
                  {activeTab === 'encode' ? 'Encode Message' : 'Decode Message'}
                </>
              )}
            </button>

            {/* Input DEPOIS do botão ( só aparece no encode ) */}
            {activeTab === 'encode' && previewUrl && (

              <div className="input-container">
              
                <div className="input-header">
              
                  <label>
                    <MessageSquare size={14} />
                    Secret Message
                  </label>
              
                  <span className={`char-count ${secretText.length > capacity ? 'text-red-500' : ''}`}>
                    {secretText.length} / {capacity}
                  </span>
              
                </div>
              
                <textarea
                  
                  placeholder="Enter message to hide..."
                  value={secretText}
                  onChange={
                    (e) => setSecretText(
                      e.target.value.slice(
                        0, capacity
                      )
                    )}
                
                  disabled={loading}
                
                />
                {secretText.length > capacity && (
                  <p style={{ 
                   // é só uma gambiarra   
                    color: '#ef4444', 
                      fontSize: '12px', 
                      padding: '8px 16px' 
                  }}>
                     Mensagem excede a capacidade da imagem
                  </p>
                )}
              </div>
            )}

            {loading && <div className="loading-spinner" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;