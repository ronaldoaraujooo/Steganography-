import React, { useState } from 'react';
import { Code, Terminal, FileText, X, AlertTriangle, Copy, Check } from 'lucide-react';
import styles from './ScriptTool.module.css';

interface ScriptToolProps {
  onClose: () => void;
  onInject: (script: { type: string; code: string; autoExecute: boolean }) => void;
  formData?: any; // Dados do formulário para usar no script
}

export const ScriptTool: React.FC<ScriptToolProps> = ({ onClose, onInject }) => {
  const [scriptType, setScriptType] = useState<'javascript' | 'powershell' | 'vba'>('javascript');
  const [code, setCode] = useState('');
  const [autoExecute, setAutoExecute] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'templates'>('editor');

  const templates = {
    javascript: [
      {
        name: 'Alerta de Boas-vindas',
        code: `// Mensagem ao abrir o PDF
app.alert({
  cMsg: "👋 Obrigado por visualizar meu currículo!\\n\\n" +
        "Candidato: " + this.info.Title,
  cTitle: "Currículo Interativo",
  nIcon: 3
});`
      },
      {
        name: 'Dados do Currículo',
        code: `// Exibe informações no console
console.println("📄 Currículo acessado em: " + new Date());
console.println("👤 Candidato: " + this.info.Title);
console.println("📧 Email: " + this.info.Author);`
      }
    ],
    powershell: [
      {
        name: 'Aviso de Segurança',
        code: `# AVISO EDUCACIONAL
Write-Host "⚠️ ATENÇÃO" -ForegroundColor Red
Write-Host "Este currículo contém scripts de demonstração."
Write-Host "Nunca execute scripts de fontes desconhecidas!"`
      }
    ],
    vba: [
      {
        name: 'Macro Demonstrativa',
        code: `' Macro educacional para Word
Sub AutoOpen()
    MsgBox "Este documento contém uma macro!", _
           vbInformation, "Aviso"
End Sub`
      }
    ]
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch(scriptType) {
      case 'javascript': return <Code size={20} />;
      case 'powershell': return <Terminal size={20} />;
      case 'vba': return <FileText size={20} />;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            {getIcon()}
            <h3>Injetar Script no PDF</h3>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'editor' ? styles.active : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'templates' ? styles.active : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            Templates
          </button>
        </div>

        <div className={styles.modalContent}>
          {activeTab === 'editor' ? (
            <>
              <div className={styles.section}>
                <label>Tipo de Script</label>
                <div className={styles.typeSelector}>
                  <button
                    className={`${styles.typeButton} ${scriptType === 'javascript' ? styles.active : ''}`}
                    onClick={() => setScriptType('javascript')}
                  >
                    <Code size={16} />
                    JavaScript
                  </button>
                  <button
                    className={`${styles.typeButton} ${scriptType === 'powershell' ? styles.active : ''}`}
                    onClick={() => setScriptType('powershell')}
                  >
                    <Terminal size={16} />
                    PowerShell
                  </button>
                  <button
                    className={`${styles.typeButton} ${scriptType === 'vba' ? styles.active : ''}`}
                    onClick={() => setScriptType('vba')}
                  >
                    <FileText size={16} />
                    Macro VBA
                  </button>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.codeHeader}>
                  <label>Código</label>
                  <button 
                    className={styles.copyButton}
                    onClick={handleCopyCode}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <textarea
                  className={styles.codeEditor}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`// Digite seu script ${scriptType} aqui...`}
                  rows={8}
                />
              </div>

              <div className={styles.section}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={autoExecute}
                    onChange={(e) => setAutoExecute(e.target.checked)}
                  />
                  Executar automaticamente ao abrir o PDF (OpenAction)
                </label>
              </div>
            </>
          ) : (
            <div className={styles.templatesList}>
              {templates[scriptType].map((template, index) => (
                <div 
                  key={index} 
                  className={styles.templateCard}
                  onClick={() => {
                    setCode(template.code);
                    setActiveTab('editor');
                  }}
                >
                  <h4>{template.name}</h4>
                  <pre>{template.code.substring(0, 100)}...</pre>
                </div>
              ))}
            </div>
          )}

          <div className={styles.warning}>
            <AlertTriangle size={16} />
            <div>
              <strong>⚠️ APENAS PARA FINS EDUCACIONAIS</strong>
              <p>Use apenas em seu próprio sistema para aprender sobre segurança.</p>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button 
            className={styles.injectButton}
            onClick={() => onInject({ type: scriptType, code, autoExecute })}
            disabled={!code.trim()}
          >
            {getIcon()}
            Injetar no PDF
          </button>
        </div>
      </div>
    </div>
  );
};