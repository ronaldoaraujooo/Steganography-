import React, { useState } from 'react';
import { 
  FileText, 
  MapPin, 
  Calendar, 
  Camera, 
  User,
  AlertCircle,
  Copy,
  Check,
  Image as ImageIcon,
  Globe,
  Download
} from 'lucide-react';
import styles from './MetadataExtractor.module.css';
import exifr from 'exifr';
import JSZip from 'jszip';

interface Metadata {
  fileName: string;
  fileSize: string;
  fileType: string;
  creationDate?: string;
  modificationDate?: string;
  gps?: {
    latitude: number;
    longitude: number;
  };
  camera?: {
    make?: string;
    model?: string;
    software?: string;
  };
  author?: string;
  title?: string;
  description?: string;
  location?: string;
  pdfInfo?: {
    pages?: number;
    creator?: string;
    producer?: string;
    version?: string;
  };
  hasExif: boolean; // Indicador se tem EXIF
}

export const MetadataExtractor: React.FC = () => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'exif' | 'gps' | 'pdf'>('info');

  const extractMetadata = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📁 Processando arquivo:', file.name);
      
      const baseInfo: Metadata = {
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2) + ' KB',
        fileType: file.type || 'Desconhecido',
        hasExif: false,
      };

      // Para imagens, extrair EXIF
      if (file.type.startsWith('image/')) {
        console.log('🖼️ Imagem detectada, extraindo EXIF...');
        
        const exifData = await exifr.parse(file, {
          tiff: true,
          exif: true,
          gps: true,
          iptc: true,
          xmp: true,
          icc: true,
          interop: true,
        });

        console.log('📊 Dados EXIF brutos:', exifData);

        if (exifData && Object.keys(exifData).length > 0) {
          baseInfo.hasExif = true;
          
          // Data de criação
          const dateTime = exifData.DateTimeOriginal || exifData.CreateDate || exifData.ModifyDate;
          if (dateTime) {
            try {
              baseInfo.creationDate = new Date(dateTime).toLocaleString('pt-BR');
            } catch {
              baseInfo.creationDate = String(dateTime);
            }
          }

          // GPS
          if (exifData.latitude !== undefined && exifData.longitude !== undefined) {
            baseInfo.gps = {
              latitude: exifData.latitude,
              longitude: exifData.longitude,
            };
          }

          // Câmera
          if (exifData.Make || exifData.Model) {
            baseInfo.camera = {
              make: exifData.Make,
              model: exifData.Model,
              software: exifData.Software,
            };
          }

          // Autor
          if (exifData.Artist || exifData.Copyright) {
            baseInfo.author = exifData.Artist || exifData.Copyright;
          }

          // Descrição
          if (exifData.ImageDescription) {
            baseInfo.description = exifData.ImageDescription;
          }
        } else {
          console.log('ℹ️ Nenhum dado EXIF encontrado (imagem sem metadados)');
        }
      }

      // Para PDF, extrair metadados
      if (file.type === 'application/pdf') {
        console.log('📄 PDF detectado, extraindo metadados...');
        
        try {
          const zip = await JSZip.loadAsync(file);
          const zipComment = (zip as any).comment;
          
          baseInfo.pdfInfo = {
            pages: 1,
            creator: 'Desconhecido',
            producer: 'Desconhecido',
          };

          const files = Object.keys(zip.files);
          if (files.length > 0) {
            const pdfContent = await zip.file(files[0])?.async('string');
            
            if (pdfContent) {
              const authorMatch = pdfContent.match(/\/Author\(([^)]+)\)/);
              if (authorMatch) baseInfo.author = authorMatch[1];
              
              const titleMatch = pdfContent.match(/\/Title\(([^)]+)\)/);
              if (titleMatch) baseInfo.title = titleMatch[1];
              
              const pagesMatch = pdfContent.match(/\/Count (\d+)/);
              if (pagesMatch) baseInfo.pdfInfo.pages = parseInt(pagesMatch[1]);
            }
          }
          
          if (zipComment) {
            baseInfo.description = zipComment;
          }
        } catch (zipError) {
          console.log('PDF não é ZIP válido, ignorando...');
        }
      }

      console.log('✅ Metadados extraídos:', baseInfo);
      setMetadata(baseInfo);
      
    } catch (err) {
      console.error('❌ Erro ao extrair metadados:', err);
      setError('Não foi possível extrair metadados deste arquivo');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      extractMetadata(file);
    }
  };

  const handleCopyMetadata = () => {
    if (metadata) {
      navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMetadata = () => {
    if (metadata) {
      const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${metadata.fileName.replace(/\.[^/.]+$/, '')}_metadata.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const openInGoogleMaps = () => {
    if (metadata?.gps) {
      const url = `https://www.google.com/maps?q=${metadata.gps.latitude},${metadata.gps.longitude}`;
      window.open(url, '_blank');
    }
  };

  const openInGoogleMapsStreetView = () => {
    if (metadata?.gps) {
      const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${metadata.gps.latitude},${metadata.gps.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Extrator de Metadados</h3>
        <p>Descubra informações ocultas em imagens e documentos</p>
      </div>

      <div className={styles.uploadArea}>
        <input
          type="file"
          accept="image/*,.pdf,.docx,.xlsx"
          onChange={handleFileSelect}
          id="metadata-file"
          hidden
        />
        <label htmlFor="metadata-file" className={styles.uploadLabel}>
          <ImageIcon size={32} />
          <p>Clique para selecionar um arquivo</p>
          <span className={styles.uploadHint}>
            Imagens, PDFs, documentos Office
          </span>
        </label>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Extraindo metadados...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {metadata && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h4>Metadados Encontrados</h4>
            <div className={styles.resultsActions}>
              <button 
                className={styles.copyButton}
                onClick={handleCopyMetadata}
                title="Copiar metadados"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button 
                className={styles.downloadButton}
                onClick={handleDownloadMetadata}
                title="Baixar metadados"
              >
                <Download size={16} />
              </button>
            </div>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <FileText size={14} />
              Informações
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'exif' ? styles.active : ''}`}
              onClick={() => setActiveTab('exif')}
              disabled={!metadata.hasExif}
            >
              <Camera size={14} />
              EXIF {!metadata.hasExif && <span className={styles.disabledBadge}>⛔</span>}
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'gps' ? styles.active : ''}`}
              onClick={() => setActiveTab('gps')}
              disabled={!metadata.gps}
            >
              <MapPin size={14} />
              Geolocalização {!metadata.gps && <span className={styles.disabledBadge}>⛔</span>}
            </button>
            {metadata.pdfInfo && (
              <button
                className={`${styles.tab} ${activeTab === 'pdf' ? styles.active : ''}`}
                onClick={() => setActiveTab('pdf')}
              >
                <FileText size={14} />
                PDF
              </button>
            )}
          </div>

          <div className={styles.metadataContent}>
            {activeTab === 'info' && (
              <div className={styles.metadataGrid}>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Nome do arquivo</span>
                  <span className={styles.value}>{metadata.fileName}</span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Tamanho</span>
                  <span className={styles.value}>{metadata.fileSize}</span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Tipo</span>
                  <span className={styles.value}>{metadata.fileType}</span>
                </div>
                {metadata.creationDate && (
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Data de criação</span>
                    <span className={styles.value}>
                      <Calendar size={12} />
                      {metadata.creationDate}
                    </span>
                  </div>
                )}
                {metadata.author && (
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Autor</span>
                    <span className={styles.value}>
                      <User size={12} />
                      {metadata.author}
                    </span>
                  </div>
                )}
                {metadata.title && (
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Título</span>
                    <span className={styles.value}>{metadata.title}</span>
                  </div>
                )}
                {metadata.description && (
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Descrição</span>
                    <span className={styles.value}>{metadata.description}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'exif' && (
              <div className={styles.metadataGrid}>
                {metadata.camera?.make && (
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Fabricante</span>
                    <span className={styles.value}>{metadata.camera.make}</span>
                  </div>
                )}
                {metadata.camera?.model && (
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Modelo</span>
                    <span className={styles.value}>{metadata.camera.model}</span>
                  </div>
                )}
                {metadata.camera?.software && (
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Software</span>
                    <span className={styles.value}>{metadata.camera.software}</span>
                  </div>
                )}
                {!metadata.hasExif && (
                  <div className={styles.noData}>
                    <Camera size={24} />
                    <p>Esta imagem não contém dados EXIF</p>
                    <span className={styles.noDataHint}>
                      Imagens da internet geralmente não têm metadados
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gps' && metadata.gps && (
              <div className={styles.gpsSection}>
                <div className={styles.metadataGrid}>
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Latitude</span>
                    <span className={styles.value}>{metadata.gps.latitude.toFixed(6)}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Longitude</span>
                    <span className={styles.value}>{metadata.gps.longitude.toFixed(6)}</span>
                  </div>
                </div>
                
                <div className={styles.mapButtons}>
                  <button 
                    className={styles.mapButton}
                    onClick={openInGoogleMaps}
                  >
                    <MapPin size={16} />
                    Ver no Google Maps
                  </button>
                  <button 
                    className={styles.mapButton}
                    onClick={openInGoogleMapsStreetView}
                  >
                    <Globe size={16} />
                    Street View
                  </button>
                </div>

                <div className={styles.mapPlaceholder}>
                  <iframe
                    title="Localização"
                    width="100%"
                    height="200"
                    frameBorder="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${metadata.gps.longitude-0.01},${metadata.gps.latitude-0.01},${metadata.gps.longitude+0.01},${metadata.gps.latitude+0.01}&layer=mapnik&marker=${metadata.gps.latitude},${metadata.gps.longitude}`}
                  />
                </div>
              </div>
            )}

            {activeTab === 'gps' && !metadata.gps && (
              <div className={styles.noData}>
                <MapPin size={24} />
                <p>Nenhuma informação de geolocalização encontrada</p>
                <span className={styles.noDataHint}>
                  Tire fotos com o celular para ter dados GPS
                </span>
              </div>
            )}

            {activeTab === 'pdf' && metadata.pdfInfo && (
              <div className={styles.metadataGrid}>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Páginas</span>
                  <span className={styles.value}>{metadata.pdfInfo.pages}</span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Criador</span>
                  <span className={styles.value}>{metadata.pdfInfo.creator}</span>
                </div>
                <div className={styles.metadataItem}>
                  <span className={styles.label}>Produtor</span>
                  <span className={styles.value}>{metadata.pdfInfo.producer}</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.warning}>
            <AlertCircle size={14} />
            <span>
              Metadados podem revelar informações sensíveis. Remova-os antes de compartilhar!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};