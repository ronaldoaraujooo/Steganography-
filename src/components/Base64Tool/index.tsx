import React, { useState } from 'react';
import { Code, Copy, Check, Save, RotateCcw, Info, ArrowLeftRight } from 'lucide-react';
import styles from './Base64Tool.module.css';

interface Base64ToolProps {
  initialText?: string;
  onEncoded?: (encodedText: string) => void;
  onDecoded?: (decodedText: string) => void;
}

export const Base64Tool: React.FC<Base64ToolProps> = ({ 
  initialText = '', 
  onEncoded, 
  onDecoded 
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEncode = () => {
    if (!inputText) return;
    try {
      const encoded = btoa(inputText);
      setOutputText(encoded);
      setError(null);
    } catch (err) {
      setError('Erro ao codificar: texto contém caracteres especiais?');
    }
  };

  const handleDecode = () => {
    if (!inputText) return;
    try {
      const decoded = atob(inputText);
      setOutputText(decoded);
      setError(null);
    } catch (err) {
      setError('Erro ao decodificar: Base64 inválido!');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleApply = () => {
    if (!outputText) return;
    
    if (mode === 'encode' && onEncoded) {
      onEncoded(outputText);
    } else if (mode === 'decode' && onDecoded) {
      onDecoded(outputText);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapMode = () => {
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
    setOutputText('');
    setError(null);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  // Detectar se o input parece Base64
  const looksLikeBase64 = (text: string): boolean => {
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    return base64Regex.test(text) && text.length % 4 === 0;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Code size={20} />
          <h3>Base64 Converter</h3>
        </div>
        <button 
          className={styles.infoButton}
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info size={16} />
        </button>
      </div>

      {showInfo && (
        <div className={styles.info}>
          <p><strong>O que é Base64?</strong></p>
          <p>• Codifica dados binários em texto ASCII</p>
          <p>• Usado para enviar imagens/arquivos em texto</p>
          <p>• Aumenta o tamanho em ~33%</p>
          <p>• Muito usado em APIs e emails</p>
          <p className={styles.example}>
            Exemplo: "A" → "QQ=="
          </p>
        </div>
      )}

      <div className={styles.modeTabs}>
        <button 
          className={`${styles.modeTab} ${mode === 'encode' ? styles.active : ''}`}
          onClick={() => setMode('encode')}
        >
          <Code size={14} />
          Codificar (texto → Base64)
        </button>
        <button 
          className={`${styles.modeTab} ${mode === 'decode' ? styles.active : ''}`}
          onClick={() => setMode('decode')}
        >
          <Code size={14} />
          Decodificar (Base64 → texto)
        </button>
      </div>

      <div className={styles.editorArea}>
        {/* Input Column */}
        <div className={styles.inputColumn}>
          <div className={styles.columnHeader}>
            <label>
              {mode === 'encode' ? 'Texto original:' : 'Texto Base64:'}
            </label>
            {mode === 'decode' && inputText && looksLikeBase64(inputText) && (
              <span className={styles.validBadge}>✅ Base64 válido</span>
            )}
            {mode === 'decode' && inputText && !looksLikeBase64(inputText) && (
              <span className={styles.invalidBadge}>⚠️ Não parece Base64</span>
            )}
          </div>
          <textarea
            className={styles.textarea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encode' 
              ? "Digite o texto para codificar..." 
              : "Cole o Base64 para decodificar..."}
            rows={5}
          />
          <div className={styles.inputStats}>
            <span>{inputText.length} caracteres</span>
            {mode === 'decode' && (
              <button 
                className={styles.detectButton}
                onClick={() => {
                  if (looksLikeBase64(inputText)) {
                    handleDecode();
                  }
                }}
              >
                Detectar e decodificar
              </button>
            )}
          </div>
        </div>

        {/* Output Column */}
        <div className={styles.outputColumn}>
          <div className={styles.outputHeader}>
            <label>Resultado:</label>
            <div className={styles.outputActions}>
              <button 
                className={styles.iconButton}
                onClick={handleCopy}
                disabled={!outputText}
                title="Copiar"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button 
                className={`${styles.iconButton} ${saved ? styles.saved : ''}`}
                onClick={handleApply}
                disabled={!outputText}
                title="Salvar"
              >
                <Save size={14} />
              </button>
            </div>
          </div>
          <textarea
            className={`${styles.textarea} ${styles.readonly}`}
            value={outputText}
            readOnly
            placeholder="Resultado aparecerá aqui..."
            rows={5}
          />
          {outputText && (
            <div className={styles.outputStats}>
              <span>{outputText.length} caracteres</span>
              <span className={styles.sizeDiff}>
                {mode === 'encode' && inputText && (
                  <>↑ {Math.round((outputText.length / inputText.length) * 100 - 100)}% maior</>
                )}
                {mode === 'decode' && outputText && (
                  <>↓ {Math.round((1 - outputText.length / inputText.length) * 100)}% menor</>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.error}>
          <Info size={14} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.actionButtons}>
        <button 
          className={styles.processButton}
          onClick={handleProcess}
          disabled={!inputText}
        >
          <Code size={16} />
          {mode === 'encode' ? 'Codificar' : 'Decodificar'}
        </button>
        <button 
          className={styles.swapButton}
          onClick={swapMode}
          title="Trocar modo"
        >
          <ArrowLeftRight size={16} />
        </button>
        <button 
          className={styles.clearButton}
          onClick={clearAll}
          title="Limpar"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className={styles.footer}>
        <div className={styles.stats}>
          <span>{inputText.length} chars</span>
          <span></span>
          <span>{outputText.length} chars</span>
        </div>
        <div className={styles.tip}>
          💡 Base64 é reversível!
        </div>
      </div>
    </div>
  );
};