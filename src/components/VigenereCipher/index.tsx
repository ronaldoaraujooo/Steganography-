import React, { useState } from 'react';
import { Lock, Unlock, Key, Copy, Check, Info, Save, Shuffle } from 'lucide-react';
import { Cipher } from '../../utils/cipher';
import styles from './VigenereCipher.module.css';

interface VigenereCipherProps {
  onEncrypt?: (encryptedText: string, key: string) => void;
  onDecrypt?: (decryptedText: string) => void;
  initialText?: string;
}

export const VigenereCipher: React.FC<VigenereCipherProps> = ({ 
  onEncrypt,  
  initialText = '' 
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState('');
  const [key, setKey] = useState('');
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleEncrypt = () => {
    if (!inputText || !key) return;
    const result = Cipher.vigenere(inputText, key);
    setOutputText(result);
  };

  const handleDecrypt = () => {
    if (!inputText || !key) return;
    const result = Cipher.vigenere(inputText, key, true);
    setOutputText(result);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(key);
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
    if (onEncrypt) onEncrypt(outputText, key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const generateStrongKey = () => {
    setKey(Cipher.generateStrongKey(12));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Key />
          <h3>Vigenère Cipher</h3>
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
          <p><strong>Cifra de Vigenère</strong> - Muito mais forte que César!</p>
          <p>Use uma <strong>chave (palavra ou frase)</strong> para criptografar</p>
          <p>Exemplo: "segredo" + chave "casa" → resultado complexo</p>
          <p>⚠️ A MESMA CHAVE é necessária para descriptografar!</p>
        </div>
      )}

      <div className={styles.keySection}>
        <div className={styles.keyHeader}>
          <label>Chave de criptografia:</label>
          <button 
            className={styles.iconButton}
            onClick={generateStrongKey}
            title="Gerar chave forte"
          >
            <Shuffle size={14} />
            Gerar
          </button>
        </div>
        <div className={styles.keyInputGroup}>
          <input
            type="text"
            className={styles.keyInput}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Digite sua chave secreta..."
          />
          <button 
            className={styles.iconButton}
            onClick={handleCopyKey}
            disabled={!key}
            title="Copiar chave"
          >
            {copiedKey ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className={styles.editorArea}>
        <div className={styles.inputColumn}>
          <label>Texto original:</label>
          <textarea
            className={styles.textarea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite o texto..."
            rows={4}
          />
          <div className={styles.actionButtons}>
            <button 
              className={styles.primaryButton}
              onClick={handleEncrypt}
              disabled={!inputText || !key}
            >
              <Lock size={14} />
              Criptografar
            </button>
          </div>
        </div>

        <div className={styles.outputColumn}>
          <div className={styles.outputHeader}>
            <label>Resultado:</label>
            <div className={styles.outputActions}>
              <button 
                className={styles.iconButton}
                onClick={handleCopyOutput}
                disabled={!outputText}
              >
                {copiedOutput ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button 
                className={`${styles.iconButton} ${saved ? styles.saved : ''}`}
                onClick={handleSave}
                disabled={!outputText}
              >
                <Save size={14} />
                {saved ? 'Salvo' : 'Salvar'}
              </button>
            </div>
          </div>
          <textarea
            className={`${styles.textarea} ${styles.readonly}`}
            value={outputText}
            readOnly
            placeholder="Resultado aparecerá aqui..."
            rows={4}
          />
          <div className={styles.actionButtons}>
            <button 
              className={styles.secondaryButton}
              onClick={handleDecrypt}
              disabled={!inputText || !key}
            >
              <Unlock size={14} />
              Descriptografar
            </button>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.stats}>
          <span>Texto: {inputText.length} chars</span>
          <span>|</span>
          <span>Chave: {key.length} chars</span>
        </div>
        <div className={styles.warning}>
          ⚠️ Guarde sua chave! Sem ela, não há descriptografia.
        </div>
      </div>
    </div>
  );
};