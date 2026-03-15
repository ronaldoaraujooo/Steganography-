import React, { useState } from 'react';
import { Eye, EyeOff, X, AlertTriangle, FileText } from 'lucide-react';
import styles from './HiddenTextTool.module.css';

interface HiddenTextToolProps {
  onClose: () => void;
  onInject: (hiddenText: { text: string; position: string; visible: boolean }) => void;
}

export const HiddenTextTool: React.FC<HiddenTextToolProps> = ({ onClose, onInject }) => {
  const [hiddenText, setHiddenText] = useState('');
  const [position, setPosition] = useState('metadata');
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <EyeOff size={20} />
            <h3>Inserir Texto Oculto</h3>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.section}>
            <label>Texto Oculto</label>
            <textarea
              className={styles.textarea}
              value={hiddenText}
              onChange={(e) => setHiddenText(e.target.value)}
              placeholder="Digite o texto que será oculto no PDF..."
              rows={4}
            />
          </div>

          <div className={styles.section}>
            <label>Onde ocultar?</label>
            <div className={styles.radioGroup}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="position"
                  value="metadata"
                  checked={position === 'metadata'}
                  onChange={(e) => setPosition(e.target.value)}
                />
                <FileText size={14} />
                Metadados do PDF
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="position"
                  value="after-eof"
                  checked={position === 'after-eof'}
                  onChange={(e) => setPosition(e.target.value)}
                />
                <EyeOff size={14} />
                Após %%EOF (invisível)
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="position"
                  value="white"
                  checked={position === 'white'}
                  onChange={(e) => setPosition(e.target.value)}
                />
                <Eye size={14} />
                Texto branco (visível se selecionar)
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
              />
              Tornar visível (texto branco ou metadados)
            </label>
          </div>

          <div className={styles.warning}>
            <AlertTriangle size={16} />
            <div>
              <strong>ℹ️ Informação</strong>
              <p>Textos ocultos não são visíveis normalmente, mas podem ser extraídos com ferramentas forenses.</p>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button 
            className={styles.injectButton}
            onClick={() => onInject({ text: hiddenText, position, visible })}
            disabled={!hiddenText.trim()}
          >
            <EyeOff size={16} />
            Inserir Texto Oculto
          </button>
        </div>
      </div>
    </div>
  );
};