import React, { useState } from 'react';
import { 
  Search, 
  Image as ImageIcon, 
  Link, 
  Upload,
  AlertCircle,
  Loader,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import styles from './ImageSearch.module.css';

const IMGBB_API_KEY = '092513b15f8ab4fec42bf8290b6bc579';

interface SearchResult {
  engine: string;
  name: string;
  getUrl: (imageUrl: string) => string;
  icon: string;
  description: string;
  color: string;
}

export const ImageSearch: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedEngines, setSelectedEngines] = useState<string[]>(['google-lens', 'yandex', 'tineye']);

  // 🔥 Buscadores com cores personalizadas
  const searchEngines: SearchResult[] = [
    {
      engine: 'google-lens',
      name: 'Google Lens',
      getUrl: (url: string) => `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`,
      icon: '🔍',
      description: 'Mais preciso para imagens',
      color: '#4285F4'
    },
    {
      engine: 'google',
      name: 'Google Images',
      getUrl: (url: string) => `https://www.google.com/searchbyimage?image_url=${encodeURIComponent(url)}`,
      icon: '🔎',
      description: 'Busca clássica do Google',
      color: '#34A853'
    },
    {
      engine: 'yandex',
      name: 'Yandex',
      getUrl: (url: string) => `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(url)}`,
      icon: '🇷🇺',
      description: 'Excelente para origens',
      color: '#FF0000'
    },
    {
      engine: 'tineye',
      name: 'TinEye',
      getUrl: (url: string) => `https://www.tineye.com/search?url=${encodeURIComponent(url)}`,
      icon: '👁️',
      description: 'Encontra a versão mais antiga',
      color: '#00A67E'
    },
    {
      engine: 'bing',
      name: 'Bing',
      getUrl: (url: string) => `https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIVSP&sbisrc=UrlPaste&q=imgurl:${encodeURIComponent(url)}`,
      icon: '🅱️',
      description: 'Buscador da Microsoft',
      color: '#008373'
    },
    {
      engine: 'baidu',
      name: 'Baidu',
      getUrl: (url: string) => `https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=-1&cs=&pn=0&rn=1&di=&ln=1962&fr=&fmq=&ic=0&s=&se=&sme=&tab=0&width=&height=&face=0&fb=0&ofr=&cg=&bdtype=0&objurl=${encodeURIComponent(url)}`,
      icon: '🇨🇳',
      description: 'Buscador chinês',
      color: '#DE2910'
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo 32MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setUploadedUrl(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || 'Erro no upload');
      }
    } catch (error) {
      console.error('Erro no ImgBB:', error);
      throw new Error('Falha no upload. Tente novamente.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const publicUrl = await uploadToImgBB(selectedFile);
      setUploadedUrl(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setUploading(false);
    }
  };

  const handleSearchIn = (engine: SearchResult) => {
    const urlToSearch = uploadedUrl || imageUrl;
    if (!urlToSearch) {
      setError('Faça upload ou insira uma URL primeiro');
      return;
    }
    window.open(engine.getUrl(urlToSearch), '_blank');
  };

  const handleSearchAll = () => {
    const urlToSearch = uploadedUrl || imageUrl;
    if (!urlToSearch) {
      setError('Faça upload ou insira uma URL primeiro');
      return;
    }

    selectedEngines.forEach(engineId => {
      const engine = searchEngines.find(e => e.engine === engineId);
      if (engine) {
        window.open(engine.getUrl(urlToSearch), '_blank');
      }
    });
  };

  const toggleEngine = (engineId: string) => {
    setSelectedEngines(prev => 
      prev.includes(engineId)
        ? prev.filter(id => id !== engineId)
        : [...prev, engineId]
    );
  };

  const handleCopyUrl = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedUrl(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      {/* LAYOUT DE DOIS PAINÉIS */}
      <div className={styles.twoColumnLayout}>
        {/* PAINEL DIREITO - Upload e Preview */}
        <div className={styles.rightPanel}>
          <div className={styles.panelHeader}>
            <h3>Imagem para buscar</h3>
          </div>

          <div className={styles.uploadContent}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'upload' ? styles.active : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <Upload size={14} />
                Upload
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'url' ? styles.active : ''}`}
                onClick={() => setActiveTab('url')}
              >
                <Link size={14} />
                URL
              </button>
            </div>

            {activeTab === 'upload' ? (
              <div className={styles.uploadArea}>
                {!previewUrl ? (
                  <div className={styles.uploadBox}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      id="image-search-file"
                      hidden
                    />
                    <label htmlFor="image-search-file" className={styles.uploadLabel}>
                      <ImageIcon size={40} />
                      <p>Clique para selecionar</p>
                      <span className={styles.uploadHint}>
                        PNG, JPG, GIF até 32MB
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className={styles.previewBox}>
                    <div className={styles.previewHeader}>
                      <span>Preview</span>
                      <button onClick={clearImage} className={styles.clearButton}>
                        ✕
                      </button>
                    </div>
                    <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                    
                    {!uploadedUrl ? (
                      <button 
                        className={styles.uploadButton}
                        onClick={handleUpload}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <Loader className={styles.spinner} size={16} />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Enviar para ImgBB
                          </>
                        )}
                      </button>
                    ) : (
                      <div className={styles.urlResult}>
                        <div className={styles.urlDisplay}>
                          <code className={styles.urlCode}>{uploadedUrl}</code>
                          <button 
                            className={styles.iconButton}
                            onClick={handleCopyUrl}
                          >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className={styles.urlNote}>
                          URL copiada! Agora busque no painel esquerdo
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.urlArea}>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className={styles.urlInput}
                />
                <p className={styles.urlHint}>
                  Cole a URL direta de uma imagem
                </p>
              </div>
            )}

            {error && (
              <div className={styles.error}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* PAINEL ESQUERDO - Buscadores */}
        <div className={styles.leftPanel}>
          <div className={styles.panelHeader}>
            <h3>Buscar em</h3>
            <button 
              className={styles.searchAllButton}
              onClick={handleSearchAll}
              disabled={!uploadedUrl && !imageUrl}
              title="Buscar em todos os selecionados"
            >
              <Search size={16} />
              Buscar todos
            </button>
          </div>

          <div className={styles.enginesList}>
            {searchEngines.map((engine) => (
              <div 
                key={engine.engine} 
                className={`${styles.engineItem} ${selectedEngines.includes(engine.engine) ? styles.selected : ''}`}
                style={{ '--engine-color': engine.color } as React.CSSProperties}
              >
                <label className={styles.engineCheckbox}>
                  <input
                    type="checkbox"
                    checked={selectedEngines.includes(engine.engine)}
                    onChange={() => toggleEngine(engine.engine)}
                  />
                  <span className={styles.checkmark}></span>
                </label>
                
                <button
                  className={styles.engineButton}
                  onClick={() => handleSearchIn(engine)}
                  disabled={!uploadedUrl && !imageUrl}
                >
                  <span className={styles.engineIcon}>{engine.icon}</span>
                  <div className={styles.engineInfo}>
                    <span className={styles.engineName}>{engine.name}</span>
                    <span className={styles.engineDesc}>{engine.description}</span>
                  </div>
                  <ExternalLink size={14} className={styles.externalIcon} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.panelFooter}>
            <p className={styles.tip}>
              <strong>💡 Dica:</strong> Selecione múltiplos e clique em "Buscar todos"
            </p>
          </div>
        </div>

       
      </div>
    </div>
  );
};