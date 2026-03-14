import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Key, Copy, Check, ArrowLeftRight, Info, Save } from 'lucide-react';
import styles from './CaesarCipher.module.css';

interface CaesarCipherProps {
  onEncrypt?: (encryptedText: string) => void;
  onDecrypt?: (decryptedText: string) => void;
  initialText?: string;
}

export const CaesarCipher: React.FC<CaesarCipherProps> = ({ 
  onEncrypt, 
  onDecrypt, 
  initialText = '' 
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [shiftKey, setShiftKey] = useState<number>(0);
  const [manualKey, setManualKey] = useState<string>('');

  const caesarCipher = (text: string, shift: number): string => {
    if (!text) return '';
    
    return text.split('').map(char => {
      if (char.match(/[A-Z]/)) {
        const code = char.charCodeAt(0);
        return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
      }
      else if (char.match(/[a-z]/)) {
        const code = char.charCodeAt(0);
        return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
      }
      else if (char.match(/[0-9]/)) {
        const code = char.charCodeAt(0);
        return String.fromCharCode(((code - 48 + shift + 10) % 10) + 48);
      }
      return char;
    }).join('');
  };

  useEffect(() => {
    if (mode === 'encrypt' && inputText) {
      const shift = inputText.length;
      setShiftKey(shift);
      const result = caesarCipher(inputText, shift);
      setOutputText(result);
    }
  }, [inputText, mode]);

  const handleDecrypt = () => {
    if (!inputText || !manualKey) return;
    
    const shift = parseInt(manualKey);
    if (isNaN(shift)) {
      alert('Chave inválida! Digite um número.');
      return;
    }
    
    const result = caesarCipher(inputText, -shift);
    setOutputText(result);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(shiftKey.toString());
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyOutput = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const handleSave = () => {
    if (!outputText) return;
    
    if (mode === 'encrypt') {
      if (onEncrypt) onEncrypt(outputText);
    } else {
      if (onDecrypt) onDecrypt(outputText);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const swapMode = () => {
    setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt');
    setInputText('');
    setOutputText('');
    setManualKey('');
    setShiftKey(0);
  };

  return (
    <div className={styles.container}>
      {/* Header Fixo */}
      <div className={styles.header}>
        <div className={styles.title}>
          <Key />
          <h3>Caesar Cipher</h3>
        </div>
        <button 
          className={styles.infoButton}
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info size={16} />
        </button>
      </div>

      {/* Info Panel (opcional, pode ser colapsado) */}
      {showInfo && (
        <div className={styles.info}>
          <p><strong>🔐 Como usar:</strong> Criptografar: digite → chave gerada. Descriptografar: texto + chave.</p>
        </div>
      )}

      {/* Mode Tabs Fixo */}
      <div className={styles.modeTabs}>
        <button 
          className={`${styles.modeTab} ${mode === 'encrypt' ? styles.active : ''}`}
          onClick={() => setMode('encrypt')}
        >
          <Lock size={14} />
          Criptografar
        </button>
        <button 
          className={`${styles.modeTab} ${mode === 'decrypt' ? styles.active : ''}`}
          onClick={() => setMode('decrypt')}
        >
          <Unlock size={14} />
          Descriptografar
        </button>
      </div>

      {/* Editor Area - CRESCENTE */}
      <div className={styles.editorArea}>
        {/* Coluna Esquerda - Input */}
        <div className={styles.inputColumn}>
          <label>
            {mode === 'encrypt' ? '📝 Texto original:' : '🔐 Texto cifrado:'}
          </label>
          <textarea
            className={styles.textarea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encrypt' 
              ? "Digite o texto..." 
              : "Cole o texto cifrado..."}
          />
        </div>

        {/* Coluna Direita - Output */}
        <div className={styles.outputColumn}>
          <div className={styles.outputHeader}>
            <label>
              {mode === 'encrypt' ? '📤 Texto cifrado:' : '📥 Texto descriptografado:'}
            </label>
            <div className={styles.outputActions}>
              <button 
                className={styles.iconButton}
                onClick={handleCopyOutput}
                disabled={!outputText}
                title="Copiar texto"
              >
                {copiedOutput ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button 
                className={`${styles.iconButton} ${saved ? styles.saved : ''}`}
                onClick={handleSave}
                disabled={!outputText}
                title="Salvar no app"
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
          />
        </div>
      </div>

      {/* Key Management - Fixo embaixo */}
      <div className={styles.keySection}>
        {mode === 'encrypt' ? (
          <div className={styles.keyArea}>
            <div className={styles.keyHeader}>
              <span className={styles.keyLabel}>
                <Key size={14} /> Chave: <strong>{shiftKey}</strong>
              </span>
              <button 
                className={styles.iconButton}
                onClick={handleCopyKey}
                disabled={!shiftKey}
              >
                {copiedKey ? <Check size={14} /> : <Copy size={14} />}
                {copiedKey ? 'Copiada' : 'Copiar chave'}
              </button>
            </div>
            <div className={styles.keyHint}>
              ⚠️ Compartilhe esta chave com quem vai descriptografar!
            </div>
          </div>
        ) : (
          <div className={styles.keyArea}>
            <div className={styles.keyInputGroup}>
              <input
                type="number"
                className={styles.keyInput}
                value={manualKey}
                onChange={(e) => setManualKey(e.target.value)}
                placeholder="Digite a chave..."
                min="1"
              />
              <button 
                className={styles.decryptButton}
                onClick={handleDecrypt}
                disabled={!inputText || !manualKey}
              >
                <Unlock size={14} />
                Descriptografar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Fixo */}
      <div className={styles.footer}>
        <button 
          className={styles.iconButton}
          onClick={swapMode}
        >
          <ArrowLeftRight size={14} />
          Trocar modo
        </button>
        <div className={styles.stats}>
          <span>In: {inputText.length}</span>
          <span>|</span>
          <span>Out: {outputText.length}</span>
        </div>
      </div>
    </div>
  );
};