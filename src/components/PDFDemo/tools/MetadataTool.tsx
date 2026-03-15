import React, { useState } from 'react';
import { Shield, X, AlertTriangle, Save } from 'lucide-react';
import styles from './MetadataTool.module.css';

interface MetadataToolProps {
  onClose: () => void;
  onInject: (metadata: any) => void;
}

export const MetadataTool: React.FC<MetadataToolProps> = ({ onClose, onInject }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [custom, setCustom] = useState('');

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Shield size={20} />
            <h3>Metadados do PDF</h3>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.section}>
            <label>Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do documento"
            />
          </div>

          <div className={styles.section}>
            <label>Autor</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nome do autor"
            />
          </div>

          <div className={styles.section}>
            <label>Assunto</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto do documento"
            />
          </div>

          <div className={styles.section}>
            <label>Palavras-chave</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="separadas por vírgula"
            />
          </div>

          <div className={styles.section}>
            <label>Metadados customizados (JSON)</label>
            <textarea
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder='{"propriedade": "valor"}'
              rows={3}
            />
          </div>

          <div className={styles.warning}>
            <AlertTriangle size={16} />
            <div>
              <strong>ℹ️ Informação</strong>
              <p>Metadados são visíveis nas propriedades do PDF.</p>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button 
            className={styles.injectButton}
            onClick={() => onInject({ title, author, subject, keywords, custom })}
          >
            <Save size={16} />
            Salvar Metadados
          </button>
        </div>
      </div>
    </div>
  );
};