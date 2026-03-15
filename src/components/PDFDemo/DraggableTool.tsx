import React from 'react';
import { Plus } from 'lucide-react';
import styles from './DraggableTool.module.css';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  description: string;
}

interface DraggableToolProps {
  tool: Tool;
  onAdd: () => void;
}

export const DraggableTool: React.FC<DraggableToolProps> = ({ tool, onAdd }) => {
  return (
    <div className={styles.toolContainer}>
      <div 
        className={styles.toolCard}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', tool.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
      >
        <span className={styles.toolIcon}>{tool.icon}</span>
        <div className={styles.toolInfo}>
          <span className={styles.toolName}>{tool.name}</span>
          <span className={styles.toolDesc}>{tool.description}</span>
        </div>
        <span className={styles.dragHandle}>⋮⋮</span>
      </div>
      <button className={styles.addButton} onClick={onAdd} title="Adicionar ao currículo">
        <Plus size={16} />
      </button>
    </div>
  );
};