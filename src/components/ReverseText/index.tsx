import React, { useState } from 'react';
import { RotateCcw, Copy, Check, Save, Info, ArrowLeftRight, Type, AlignLeft, Hash, WrapText } from 'lucide-react';
import styles from './ReverseText.module.css';

interface ReverseTextProps {
  initialText?: string;
  onReverse?: (reversedText: string) => void;
}

export const ReverseText: React.FC<ReverseTextProps> = ({ 
  initialText = '', 
  onReverse 
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'chars' | 'words' | 'lines' | 'palindrome'>('chars');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // ========== FUNÇÕES DE REVERSÃO ==========
  
  // 1️⃣ Inverter caracteres
  const reverseCharacters = (text: string): string => {
    return text.split('').reverse().join('');
  };

  // 2️⃣ Inverter palavras (mantém ordem dos caracteres nas palavras)
  const reverseWords = (text: string): string => {
    return text.split(' ').reverse().join(' ');
  };

  // 3️⃣ Inverter linhas
  const reverseLines = (text: string): string => {
    return text.split('\n').reverse().join('\n');
  };

  // 4️⃣ Criar palíndromo (texto + reverso)
  const createPalindrome = (text: string): string => {
    const reversed = text.split('').reverse().join('');
    return text + reversed;
  };

  // Processar baseado no modo selecionado
  const handleProcess = () => {
    if (!inputText) return;
    
    let result = '';
    
    switch(mode) {
      case 'chars':
        result = reverseCharacters(inputText);
        break;
      case 'words':
        result = reverseWords(inputText);
        break;
      case 'lines':
        result = reverseLines(inputText);
        break;
      case 'palindrome':
        result = createPalindrome(inputText);
        break;
      default:
        result = inputText;
    }
    
    setOutputText(result);
  };

  const handleApply = () => {
    if (!outputText) return;
    
    if (onReverse) {
      onReverse(outputText);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapInputOutput = () => {
    setInputText(outputText);
    setOutputText('');
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

 

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <RotateCcw size={20} />
          <h3>Reverse Text</h3>
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
          <p><strong>4 Modos de Reversão:</strong></p>
          <p>• <strong>Caracteres:</strong> "Hello" → "olleH"</p>
          <p>• <strong>Palavras:</strong> "Hello World" → "World Hello"</p>
          <p>• <strong>Linhas:</strong> "A\nB\nC" → "C\nB\nA"</p>
          <p>• <strong>Palíndromo:</strong> "Hello" → "HelloolleH"</p>
        </div>
      )}

      {/* Seletor de Modo */}
      <div className={styles.modeSelector}>
        <button 
          className={`${styles.modeButton} ${mode === 'chars' ? styles.active : ''}`}
          onClick={() => setMode('chars')}
        >
          <Type size={16} />
          Caracteres
        </button>
        <button 
          className={`${styles.modeButton} ${mode === 'words' ? styles.active : ''}`}
          onClick={() => setMode('words')}
        >
          <AlignLeft size={16} />
          Palavras
        </button>
        <button 
          className={`${styles.modeButton} ${mode === 'lines' ? styles.active : ''}`}
          onClick={() => setMode('lines')}
        >
          <WrapText size={16} />
          Linhas
        </button>
        <button 
          className={`${styles.modeButton} ${mode === 'palindrome' ? styles.active : ''}`}
          onClick={() => setMode('palindrome')}
        >
          <Hash size={16} />
          Palíndromo
        </button>
      </div>

      <div className={styles.editorArea}>
        {/* Input Column */}
        <div className={styles.inputColumn}>
          <label>Texto original:</label>
          <textarea
            className={styles.textarea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite o texto..."
            rows={5}
          />
          <div className={styles.inputStats}>
            <span>{inputText.length} caracteres</span>
            <span>{inputText.split(' ').filter(w => w).length} palavras</span>
            <span>{inputText.split('\n').length} linhas</span>
          </div>
        </div>

        {/* Output Column */}
        <div className={styles.outputColumn}>
          <div className={styles.outputHeader}>
            <label>Resultado ({mode}):</label>
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
              {mode === 'palindrome' && (
                <span className={styles.palindromeInfo}>
                  {outputText.length} = {inputText.length} × 2
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button 
          className={styles.processButton}
          onClick={handleProcess}
          disabled={!inputText}
        >
          <RotateCcw size={16} />
          {mode === 'chars' && 'Inverter Caracteres'}
          {mode === 'words' && 'Inverter Palavras'}
          {mode === 'lines' && 'Inverter Linhas'}
          {mode === 'palindrome' && 'Criar Palíndromo'}
        </button>
        <button 
          className={styles.swapButton}
          onClick={swapInputOutput}
          disabled={!outputText}
          title="Usar resultado como entrada"
        >
          <ArrowLeftRight size={16} />
        </button>
        <button 
          className={styles.clearButton}
          onClick={clearAll}
          title="Limpar tudo"
        >
          <RotateCcw size={16} />
        </button>
      </div>


      <div className={styles.footer}>
        <div className={styles.stats}>
          <span>Original: {inputText.length} chars</span>
          <span></span>
          <span>Resultado: {outputText.length} chars</span>
        </div>
        <div className={styles.tip}>
          {mode === 'chars' && ' Inverte a ordem de todos os caracteres'}
          {mode === 'words' && ' Mantém a ordem das letras, inverte as palavras'}
          {mode === 'lines' && ' Inverte a ordem das linhas'}
          {mode === 'palindrome' && ' Cria um espelho do texto'}
        </div>
      </div>
    </div>
  );
};