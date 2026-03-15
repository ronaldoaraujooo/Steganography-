import React from 'react';
import { 
  Type, 
  Bold, 
  Italic, 
  Hash, 
  Palette, 
  AlignLeft, 
  Code // ← ADICIONA ISSO AQUI!
} from 'lucide-react';
import styles from './ElementEditor.module.css';

interface ElementEditorProps {
  element: any;
  onUpdate: (updates: any) => void;
}

export const ElementEditor: React.FC<ElementEditorProps> = ({ element, onUpdate }) => {
  
    // No início do componente ElementEditor
    if (!element || !element.type) {
    return <div>Erro: Elemento inválido</div>;
    }
    
    const handleStyleChange = (key: string, value: any) => {
    onUpdate({
      style: { ...element.style, [key]: value }
    });
  };

  const handleContentChange = (value: string) => {
    onUpdate({ content: value });
  };

  return (
    <div className={styles.editor}>
        
      {/* Conteúdo */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>
          <Type size={14} />
          Conteúdo
        </label>
        {element.type === 'text' && (
          <textarea
            className={styles.contentInput}
            value={element.content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={3}
          />
        )}
        {element.type.includes('linkedin') && (
          <input
            type="text"
            className={styles.contentInput}
            value={element.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="linkedin.com/in/..."
          />
        )}
        {element.type === 'script' && (
          <div className={styles.scriptPreview}>
            <code>{element.script?.type}</code>
            <p>{element.script?.code.substring(0, 100)}...</p>
          </div>
        )}
      </div>

      {/* Estilo */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>
          <Palette size={14} />
          Estilo
        </label>
        
        <div className={styles.styleRow}>
          <label>Tamanho</label>
          <input
            type="number"
            className={styles.numberInput}
            value={element.style?.fontSize || 12}
            onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
            min={8}
            max={72}
          />
        </div>

        <div className={styles.styleRow}>
          <label>Cor</label>
          <input
            type="color"
            className={styles.colorInput}
            value={element.style?.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
        </div>

        <div className={styles.styleButtons}>
          <button
            className={`${styles.styleButton} ${element.style?.bold ? styles.active : ''}`}
            onClick={() => handleStyleChange('bold', !element.style?.bold)}
          >
            <Bold size={16} />
          </button>
          <button
            className={`${styles.styleButton} ${element.style?.italic ? styles.active : ''}`}
            onClick={() => handleStyleChange('italic', !element.style?.italic)}
          >
            <Italic size={16} />
          </button>
          <button
            className={styles.styleButton}
          >
            <AlignLeft size={16} />
          </button>
        </div>
      </div>

      {/* Posição */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>
          <Hash size={14} />
          Posição
        </label>
        
        <div className={styles.positionRow}>
          <div>
            <label>X</label>
            <input
              type="number"
              className={styles.numberInput}
              value={element.position?.x || 0}
              onChange={(e) => onUpdate({
                position: { ...element.position, x: parseInt(e.target.value) }
              })}
            />
          </div>
          <div>
            <label>Y</label>
            <input
              type="number"
              className={styles.numberInput}
              value={element.position?.y || 0}
              onChange={(e) => onUpdate({
                position: { ...element.position, y: parseInt(e.target.value) }
              })}
            />
          </div>
        </div>
      </div>

      {/* Script (se existir) */}
      {element.script && (
        <div className={styles.section}>
          <label className={styles.sectionLabel}>
            <Code size={14} />
            Script
          </label>
          <div className={styles.scriptOptions}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={element.script.autoExecute}
                onChange={(e) => onUpdate({
                  script: { ...element.script, autoExecute: e.target.checked }
                })}
              />
              Executar automaticamente
            </label>
          </div>
        </div>
      )}
    </div>
  );
};