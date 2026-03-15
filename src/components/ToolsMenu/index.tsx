import React, { useState } from 'react';
import { Wrench, X, Lock, ChevronRight, ChevronLeft, Code, RotateCcw, Key } from 'lucide-react';
import { CaesarCipher } from '../CaesarCipher';
import { VigenereCipher } from '../VigenereCipher';
import styles from './ToolsMenu.module.css';

interface ToolsMenuProps {
  onApplyEncrypted: (text: string) => void;
  currentText?: string;
}

export const ToolsMenu: React.FC<ToolsMenuProps> = ({ onApplyEncrypted, currentText = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'caesar',
      name: 'Caesar Cipher',
      description: 'Cifra simples com deslocamento',
      icon: <Lock size={18} />,
    },
    {
      id: 'vigenere',
      name: 'Vigenère Cipher',
      description: 'Cifra polialfabética com chave',
      icon: <Key size={18} />,
    },
    {
      id: 'base64',
      name: 'Base64',
      description: 'Codificação/decodificação',
      icon: <Code size={18} />,
    },
    {
      id: 'reverse',
      name: 'Reverse Text',
      description: 'Inverte a ordem do texto',
      icon: <RotateCcw size={18} />,
    },
  ];

  const getToolComponent = () => {
    switch(selectedTool) {
      case 'caesar':
        return (
          <CaesarCipher
            initialText={currentText}
            onEncrypt={(encrypted) => {
              onApplyEncrypted(encrypted);
              setSelectedTool(null);
              setIsOpen(false);
            }}
            onDecrypt={(decrypted) => {
              onApplyEncrypted(decrypted);
              setSelectedTool(null);
              setIsOpen(false);
            }}
          />
        );
      case 'vigenere':
        return (
          <VigenereCipher
            initialText={currentText}
            onEncrypt={(encrypted, key) => {
              onApplyEncrypted(encrypted);
              // 🔥 AGORA USA A KEY! Mostra pra usuário
              alert(`🔑 Chave usada: ${key}\nGuarde esta chave para descriptografar!`);
              setSelectedTool(null);
              setIsOpen(false);
            }}
            onDecrypt={(decrypted) => {
              onApplyEncrypted(decrypted);
              setSelectedTool(null);
              setIsOpen(false);
            }}
          />
        );
      default:
        return (
          <div className={styles.comingSoon}>
            <p>Ferramenta em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <>
      <button 
        className={`${styles.toggle} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Wrench size={24} />}
      </button>

      <div className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h3>Ferramentas Extras</h3>
          <button onClick={() => setIsOpen(false)}>
            <ChevronRight size={20} />
          </button>
        </div>

        {!selectedTool ? (
          <div className={styles.list}>
            {tools.map(tool => (
              <button
                key={tool.id}
                className={styles.item}
                onClick={() => setSelectedTool(tool.id)}
              >
                <span className={styles.icon}>{tool.icon}</span>
                <div className={styles.info}>
                  <span className={styles.name}>{tool.name}</span>
                  <span className={styles.desc}>{tool.description}</span>
                </div>
                <ChevronRight size={16} className={styles.arrow} />
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <button onClick={() => setSelectedTool(null)}>
                <ChevronLeft size={16} />
                Voltar
              </button>
              <h4>{tools.find(t => t.id === selectedTool)?.name}</h4>
            </div>
            <div className={styles.panelContent}>
              {getToolComponent()}
            </div>
          </div>
        )}
      </div>
    </>
  );
};