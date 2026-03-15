import React, { useState } from 'react';
import { Code, Copy, Check, Save, Key, RotateCcw, Info } from 'lucide-react';
import styles from './XorCipher.module.css';

interface XorCipherProps {
  initialText?: string;
  onEncrypt?: (encryptedText: string) => void;
  onDecrypt?: (decryptedText: string) => void;
}

export const XorCipher: React.FC<XorCipherProps> = ({ 
  initialText = '', 
  onEncrypt, 
  onDecrypt 
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState('');
  const [key, setKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Função XOR (é a mesma para encriptar e decriptar!)
  const xorCipher = (text: string, key: string): string => {
    if (!text || !key) return '';
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyCode = key.charCodeAt(i % key.length);
      // XOR bit a bit
      result += String.fromCharCode(charCode ^ keyCode);
    }
    return result;
  };

  const handleProcess = () => {
    if (!inputText || !key) return;
    
    const result = xorCipher(inputText, key);
    setOutputText(result);
  };

  const handleApply = () => {
    if (!outputText) return;
    
    if (mode === 'encrypt' && onEncrypt) {
      onEncrypt(outputText);
    } else if (mode === 'decrypt' && onDecrypt) {
      onDecrypt(outputText);
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
    setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt');
    setOutputText('');
  };

  const generateRandomKey = (length: number = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let newKey = '';
    for (let i = 0; i < length; i++) {
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKey(newKey);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Code size={20} />
          <h3>XOR Cipher</h3>
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
          <p><strong>🔐 XOR (Exclusive OR)</strong></p>
          <p>• A mesma função serve para encriptar e decriptar!</p>
          <p>• A chave pode ter qualquer tamanho</p>
          <p>• Quanto maior a chave, mais segura</p>
          <p>• Exemplo: "A" (65) XOR chave = caracter diferente</p>
        </div>
      )}

      <div className={styles.modeTabs}>
        <button 
          className={`${styles.modeTab} ${mode === 'encrypt' ? styles.active : ''}`}
          onClick={() => setMode('encrypt')}
        >
          <Code size={14} />
          Criptografar
        </button>
        <button 
          className={`${styles.modeTab} ${mode === 'decrypt' ? styles.active : ''}`}
          onClick={() => setMode('decrypt')}
        >
          <Code size={14} />
          Descriptografar
        </button>
      </div>

      <div className={styles.keySection}>
        <div className={styles.keyHeader}>
          <label>
            <Key size={14} />
            Chave XOR
          </label>
          <button 
            className={styles.generateButton}
            onClick={() => generateRandomKey(16)}
          >
            <RotateCcw size={12} />
            Gerar
          </button>
        </div>
        <div className={styles.keyInputGroup}>
          <input
            type="text"
            className={styles.keyInput}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Digite a chave secreta..."
          />
        </div>
      </div>

      <div className={styles.editorArea}>
        <div className={styles.inputColumn}>
          <label>Texto {mode === 'encrypt' ? 'original' : 'cifrado'}:</label>
          <textarea
            className={styles.textarea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encrypt' 
              ? "Digite o texto para criptografar..." 
              : "Digite o texto cifrado..."}
            rows={4}
          />
        </div>

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
            placeholder="Clique em PROCESSAR..."
            rows={4}
          />
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button 
          className={styles.processButton}
          onClick={handleProcess}
          disabled={!inputText || !key}
        >
          <Code size={16} />
          {mode === 'encrypt' ? 'Criptografar' : 'Descriptografar'}
        </button>
        <button 
          className={styles.swapButton}
          onClick={swapMode}
          title="Trocar modo"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className={styles.footer}>
        <div className={styles.stats}>
          <span>Texto: {inputText.length} chars</span>
          <span>|</span>
          <span>Chave: {key.length} chars</span>
        </div>
        <div className={styles.warning}>
          ⚠️ XOR é seguro, mas use chave forte!
        </div>
      </div>
    </div>
  );
};