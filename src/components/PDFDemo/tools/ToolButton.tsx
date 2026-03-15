import React from 'react';
import styles from './ToolButton.module.css';

interface ToolButtonProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  onClick: () => void;
  color?: string;
}

export const ToolButton: React.FC<ToolButtonProps> = ({ 
  icon, 
  name, 
  description, 
  onClick,
  color = '#3b82f6'
}) => {
  return (
    <button className={styles.toolButton} onClick={onClick} style={{ '--tool-color': color } as any}>
      <span className={styles.toolIcon}>{icon}</span>
      <div className={styles.toolInfo}>
        <span className={styles.toolName}>{name}</span>
        <span className={styles.toolDesc}>{description}</span>
      </div>
    </button>
  );
};