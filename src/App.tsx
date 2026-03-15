import React, { useState } from 'react';
import './App.css';
import Swal from 'sweetalert2';
import { ToolsMenu } from './components/ToolsMenu';
import { CaesarCipher } from './components/CaesarCipher';
import { VigenereCipher } from './components/VigenereCipher';
import { ImageConverter } from './components/ImageConverter';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  Terminal,
  HardDrive,
  MessageSquare,
  Settings,
  BarChart3,
  Cpu,
  Menu as MenuIcon,
  X,
  ShieldCheck,
  Key,
  Code,
  RotateCcw
} from 'lucide-react';
import { Steganography } from './utils/steganography';
import { MetadataCleaner } from './utils/metadataCleaner';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [secretText, setSecretText] = useState('');
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  const [loading, setLoading] = useState(false);
  const [capacity, setCapacity] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

const tools = [
  { id: 'converter', name: 'Conversor de Imagens', icon: <ImageIcon size={18} /> },
  { id: 'caesar', name: 'Caesar Cipher', icon: <Lock size={18} /> },
  { id: 'vigenere', name: 'Vigenère Cipher', icon: <Key size={18} /> },
  { id: 'xor', name: 'XOR Cipher', icon: <Code size={18} /> },
  { id: 'base64', name: 'Base64', icon: <Code size={18} /> },
  { id: 'reverse', name: 'Reverse Text', icon: <RotateCcw size={18} /> },
];

  const handleApplyEncrypted = (text: string) => {
    setSecretText(text);
    setSelectedTool(null); // Volta pra esteganografia depois de aplicar
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
     if (!file.type.includes('png')) {
    Swal.fire({
      title: '⚠️ Formato inválido',
      html: `
        <p>A imagem deve ser <strong>PNG</strong>.</p>
        <p>JPG não funciona porque destrói a mensagem escondida.</p>
        <p>Use nossa ferramenta de conversor, menu de ferramentas.</p>
      `,
      icon: 'warning',
      background: '#1a1e24',
      color: '#fff',
      confirmButtonColor: '#3b82f6',
    });
    return;
  }

    setSelectedFile(file);
    setSecretText('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
     setSelectedFile(file);
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
      const fileToProcess = await MetadataCleaner.stripMetadata(selectedFile);
      const { imageUrl, metadata } = await Steganography.encode(fileToProcess, secretText);

      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = MetadataCleaner.randomizeFilename(selectedFile.name);
      link.click();

      Swal.fire({
        title: '✅ Imagem Gerada!',
        html: `
          <div style="text-align: left; background: #2d3748; padding: 16px; border-radius: 12px; margin: 16px 0; color: white;">
            <p><strong style="color: #3b82f6;">📁 Arquivo:</strong> ${metadata.cleanName}</p>
            <p><strong style="color: #3b82f6;">📝 Mensagem:</strong> ${secretText.length} caracteres</p>
            <p><strong style="color: #3b82f6;">🔒 Metadados:</strong> Limpos automaticamente</p>
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
        title: '❌ Erro',
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
      const decodedMessage = await Steganography.decodeRaw(selectedFile);
      setSecretText(decodedMessage);

      Swal.fire({
        title: '🔓 Mensagem Extraída!',
        html: `
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 24px; border-radius: 16px; margin: 16px 0;">
            <p style="font-size: 18px; color: white; font-weight: 500; word-break: break-word;">"${decodedMessage}"</p>
          </div>
          <p style="color: #9ca3af; font-size: 14px;">Mensagem bruta extraída</p>
          <p style="color: #f59e0b; font-size: 12px;">💡 Use o menu lateral para criptografar/descriptografar</p>
        `,
        icon: 'success',
        background: '#1a1e24',
        color: '#fff',
        confirmButtonColor: '#8b5cf6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      Swal.fire({
        title: '❌ Erro',
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

  // Renderizar ferramenta selecionada
 // Renderizar ferramenta selecionada
const renderToolContent = () => {
  if (!selectedTool) return null;

  switch(selectedTool) {
    case 'converter':
      return (
        <ImageConverter
          onConverted={(file, preview) => {
            // Usar a imagem convertida na esteganografia
            setSelectedFile(file);
            setPreviewUrl(preview);
            // Calcular capacidade da nova imagem
            Steganography.calculateCapacity(file).then(cap => {
              setCapacity(cap);
            });
            setSelectedTool(null); // Volta pra esteganografia
          }}
        />
      );
    case 'caesar':
      return (
        <CaesarCipher
          initialText={secretText}
          onEncrypt={handleApplyEncrypted}
          onDecrypt={handleApplyEncrypted}
        />
      );
    case 'vigenere':
      return (
        <VigenereCipher
          initialText={secretText}
          onEncrypt={(encrypted, key) => {
            handleApplyEncrypted(encrypted);
            Swal.fire({
              title: '🔑 Chave gerada!',
              text: `Chave: ${key}\nGuarde esta chave para descriptografar!`,
              icon: 'info',
              background: '#1a1e24',
              color: '#fff',
              confirmButtonColor: '#8b5cf6',
            });
          }}
          onDecrypt={handleApplyEncrypted}
        />
      );
    default:
      return (
        <div className="tool-placeholder">
          <p>Ferramenta em desenvolvimento...</p>
        </div>
      );
  }
};

  return (
    <div className={`container ${!isMenuOpen ? 'menu-collapsed' : ''}`}>
      {/* Tools Menu (flutuante) - fora do grid */}
      <ToolsMenu 
        onApplyEncrypted={handleApplyEncrypted}
        currentText={secretText}
      />

      {/* HEADER */}
      <div className="header">
        <div className="logo-section">
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
          <div className="logo-icon">
            <Shield size={24} />
          </div>
          <div className="logo-text">
            <h1>Steganography CMS</h1>
          </div>
        </div>

        <div className="header-tabs">
          <button 
            className={`tab-button encode ${activeTab === 'encode' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('encode');
              setSelectedTool(null);
            }}
          >
            <Lock size={14} />
            Esconder
          </button>
          <button 
            className={`tab-button decode ${activeTab === 'decode' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('decode');
              setSelectedTool(null);
            }}
          >
            <Unlock size={14} />
            Extrair
          </button>
        </div>
      </div>

      {/* MENU LATERAL (agora com ferramentas!) */}
      <div className="menu">
        <div className="menu-header">
          <h3>Ferramentas</h3>
        </div>
        <div className="menu-items">
          {/* Botão da ferramenta principal */}
          <button
            className={`menu-item ${!selectedTool ? 'active' : ''}`}
            onClick={() => setSelectedTool(null)}
          >
            <span className="menu-icon"><ImageIcon size={18} /></span>
            <span className="menu-name">Esteganografia</span>
          </button>

          {/* Ferramentas de criptografia */}
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`menu-item ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <span className="menu-icon">{tool.icon}</span>
              <span className="menu-name">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* NAVBAR INFERIOR */}
      <div className="NavbarInferior">
        <div className="stat-item">
          <HardDrive size={20} />
          <div className="stat-info">
            <span className="stat-label">Imagem</span>
            <span className="stat-value">{selectedFile ? formatFileSize(selectedFile.size) : '0 KB'}</span>
          </div>
        </div>
        <div className="stat-item">
          <Cpu size={20} />
          <div className="stat-info">
            <span className="stat-label">Capacidade</span>
            <span className="stat-value">{capacity > 0 ? `${capacity} chars` : '0 chars'}</span>
          </div>
        </div>
        <div className="stat-item">
          <MessageSquare size={20} />
          <div className="stat-info">
            <span className="stat-label">Mensagem</span>
            <span className="stat-value">{secretText.length} chars</span>
          </div>
        </div>
        <div className="stat-item">
          <ShieldCheck size={20} />
          <div className="stat-info">
            <span className="stat-label">Metadados</span>
            <span className="stat-value">Limpos ✓</span>
          </div>
        </div>
        <div className="stat-item">
          <BarChart3 size={20} />
          <div className="stat-info">
            <span className="stat-label">Status</span>
            <span className="stat-value">{selectedFile ? 'Pronto' : 'Aguardando'}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">
        {selectedTool ? (
          // Mostra ferramenta selecionada
          <div className="tool-content full-height">
            {renderToolContent()}
          </div>
        ) : (
          // Mostra esteganografia normal
          <div className="stego-content">
            {/* Left Panel - Input */}
            <div className="card">
              <div className="card-header">
                <Terminal size={18} />
                <h2>Carregar Imagem</h2>
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
                    <ImageIcon size={40} />
                    <p>Selecione uma imagem</p>
                    <span className="upload-hint">PNG • Máx 10MB</span>
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

            {/* Right Panel - Output */}
            <div className="card">
              <div className="card-header">
                <Settings size={18} />
                <h2>{activeTab === 'encode' ? 'Esconder Mensagem' : 'Extrair Mensagem'}</h2>
              </div>
              <div className="card-content">
                {activeTab === 'encode' && previewUrl && (
                  <div className="input-container">
                    <div className="input-header">
                      <label>
                        <MessageSquare size={14} />
                        Mensagem
                      </label>
                      <span className={`char-count ${secretText.length > capacity ? 'text-red-500' : ''}`}>
                        {secretText.length} / {capacity}
                      </span>
                    </div>
                    <textarea
                      placeholder="Digite a mensagem para esconder..."
                      value={secretText}
                      onChange={(e) => setSecretText(e.target.value.slice(0, capacity))}
                      disabled={loading}
                      rows={4}
                    />
                    {secretText.length > capacity && (
                      <p className="warning-text">⚠️ Mensagem muito grande</p>
                    )}
                  </div>
                )}

                {activeTab === 'encode' && previewUrl && (
                  <div className="info-message">
                    <ShieldCheck size={14} />
                    <span>Metadados serão limpos automaticamente</span>
                  </div>
                )}

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
                    <span>Processando...</span>
                  ) : (
                    <>
                      {activeTab === 'encode' ? <Lock size={16} /> : <Unlock size={16} />}
                      {activeTab === 'encode' ? 'Esconder na Imagem' : 'Extrair da Imagem'}
                    </>
                  )}
                </button>

                {loading && <div className="loading-spinner" />}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Overlay para mobile quando menu está aberto - ADICIONE ISSO AQUI! */}
    {!isMenuOpen && ( // Só mostra quando o menu está ABERTO (isMenuOpen = false)
      <div 
        className="menu-overlay" 
        onClick={() => setIsMenuOpen(true)} // Volta para true (fecha o menu)
        onTouchEnd={() => setIsMenuOpen(true)}
      />
    )}
    </div>
  );
}

export default App;