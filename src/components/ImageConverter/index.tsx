import React, { useState } from 'react';
import { Image as ImageIcon, Download, AlertCircle, X, Upload } from 'lucide-react';
import styles from './ImageConverter.module.css';

interface ImageConverterProps {
  onConverted?: (file: File, preview: string) => void;
}

export const ImageConverter: React.FC<ImageConverterProps> = ({ onConverted }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalInfo, setOriginalInfo] = useState<{ width: number; height: number; size: number } | null>(null);
  const [convertedInfo, setConvertedInfo] = useState<{ width: number; height: number; size: number } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setConvertedUrl(null);
    setError(null);

    // Preview da imagem original
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      
      // Pegar informações da imagem
      const img = new Image();
      img.onload = () => {
        setOriginalInfo({
          width: img.width,
          height: img.height,
          size: file.size
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const convertToPNG = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          // Criar canvas com as dimensões originais
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setError('Erro ao criar contexto');
            setLoading(false);
            return;
          }

          // Desenhar imagem
          ctx.drawImage(img, 0, 0);

          // Converter para PNG
          const pngUrl = canvas.toDataURL('image/png');
          setConvertedUrl(pngUrl);

          // Informações da imagem convertida
          setConvertedInfo({
            width: img.width,
            height: img.height,
            size: Math.round(pngUrl.length * 0.75) // Aproximação do tamanho
          });

          // Se tiver callback, retorna o arquivo
          if (onConverted) {
            canvas.toBlob((blob) => {
              if (blob) {
                const pngFile = new File(
                  [blob],
                  selectedFile.name.replace(/\.[^/.]+$/, '') + '.png',
                  { type: 'image/png' }
                );
                onConverted(pngFile, pngUrl);
              }
            }, 'image/png');
          }

          setLoading(false);
        };

        img.onerror = () => {
          setError('Erro ao carregar imagem');
          setLoading(false);
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        setError('Erro ao ler arquivo');
        setLoading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError('Erro durante a conversão');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!convertedUrl) return;

    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = selectedFile?.name.replace(/\.[^/.]+$/, '') + '.png' || 'converted.png';
    link.click();
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedUrl(null);
    setError(null);
    setOriginalInfo(null);
    setConvertedInfo(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <ImageIcon size={20} />
          <h3>Conversor de Imagens</h3>
        </div>
      </div>

      <div className={styles.content}>
        {/* Upload Area */}
        {!previewUrl ? (
          <div 
            className={styles.uploadArea}
            onClick={() => document.getElementById('converter-file-input')?.click()}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              id="converter-file-input"
              hidden
            />
            <Upload size={40} />
            <p>Selecione uma imagem para converter</p>
            <span className={styles.hint}>Qualquer formato → PNG</span>
          </div>
        ) : (
          <>
            {/* Preview Area */}
            <div className={styles.previewSection}>
              <div className={styles.previewHeader}>
                <span>Imagem Original</span>
                <button onClick={clearAll} className={styles.clearButton}>
                  <X size={16} />
                </button>
              </div>
              <div className={styles.previewContent}>
                <img src={previewUrl} alt="Preview" />
                {originalInfo && (
                  <div className={styles.imageInfo}>
                    <span>{originalInfo.width} x {originalInfo.height}</span>
                    <span>{formatBytes(originalInfo.size)}</span>
                    <span className={styles.format}>{selectedFile?.type}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Botão de conversão */}
            {!convertedUrl && !loading && (
              <button 
                className={styles.convertButton}
                onClick={convertToPNG}
              >
                <ImageIcon size={16} />
                Converter para PNG
              </button>
            )}

            {/* Loading */}
            {loading && (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Convertendo...</p>
              </div>
            )}

            {/* Resultado */}
            {convertedUrl && convertedInfo && (
              <div className={styles.resultSection}>
                <div className={styles.previewHeader}>
                  <span>Imagem Convertida (PNG)</span>
                </div>
                <div className={styles.previewContent}>
                  <img src={convertedUrl} alt="Converted" />
                  <div className={styles.imageInfo}>
                    <span>{convertedInfo.width} x {convertedInfo.height}</span>
                    <span>{formatBytes(convertedInfo.size)}</span>
                    <span className={styles.format}>image/png</span>
                  </div>
                </div>

                {/* Comparação de tamanho */}
                {originalInfo && (
                  <div className={styles.comparison}>
                    <div className={styles.comparisonItem}>
                      <span>Original</span>
                      <strong>{formatBytes(originalInfo.size)}</strong>
                    </div>
                    <div className={styles.comparisonArrow}>→</div>
                    <div className={styles.comparisonItem}>
                      <span>PNG</span>
                      <strong>{formatBytes(convertedInfo.size)}</strong>
                    </div>
                    <div className={styles.comparisonDiff}>
                      {convertedInfo.size > originalInfo.size ? (
                        <span className={styles.increase}>
                          +{((convertedInfo.size - originalInfo.size) / originalInfo.size * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className={styles.decrease}>
                          -{((originalInfo.size - convertedInfo.size) / originalInfo.size * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button 
                  className={styles.downloadButton}
                  onClick={handleDownload}
                >
                  <Download size={16} />
                  Baixar PNG
                </button>

                <div className={styles.warning}>
                  <AlertCircle size={14} />
                  <span>PNG é o único formato que preserva mensagens escondidas!</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className={styles.error}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};