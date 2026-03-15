import React, { useState } from 'react';
import { platformConfigs } from '../../utils/robustSteganography';
import styles from './PlatformSelector.module.css';

interface PlatformSelectorProps {
  onSelect: (platform: string) => void;
  selected?: string;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ 
  onSelect, 
  selected = 'email' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>(selected);

  const handleSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    onSelect(platformId);
    setIsOpen(false);
  };

  const selectedConfig = platformConfigs[selectedPlatform];

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <span>📱 Onde você vai enviar?</span>
        <div className={styles.selector} onClick={() => setIsOpen(!isOpen)}>
          <span className={styles.selectedIcon}>{selectedConfig.icon}</span>
          <span className={styles.selectedName}>{selectedConfig.name}</span>
          <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
        </div>
      </label>

      {isOpen && (
        <div className={styles.dropdown}>
          {Object.entries(platformConfigs).map(([id, config]) => (
            <div
              key={id}
              className={`${styles.platform} ${id === selectedPlatform ? styles.selected : ''}`}
              onClick={() => handleSelect(id)}
            >
              <div className={styles.platformHeader}>
                <span className={styles.icon}>{config.icon}</span>
                <span className={styles.name}>{config.name}</span>
                {config.compression === 'aggressive' && (
                  <span className={styles.warning}>⚠️</span>
                )}
              </div>
              <div className={styles.platformDetails}>
                <span className={styles.technique}>{config.technique}</span>
                <span className={styles.ecc}>{config.ecc}</span>
              </div>
              <div className={styles.description}>{config.description}</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <span>🔧 Técnica:</span>
          <strong>{selectedConfig.technique}</strong>
        </div>
        <div className={styles.infoRow}>
          <span>🔒 Correção:</span>
          <strong>{selectedConfig.ecc}</strong>
        </div>
        <div className={styles.infoRow}>
          <span>📊 Qualidade:</span>
          <strong>{selectedConfig.qualityFactor}%</strong>
        </div>
      </div>
    </div>
  );
};