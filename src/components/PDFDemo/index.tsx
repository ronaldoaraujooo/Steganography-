import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ToolButton } from './tools/ToolButton';
import { ScriptTool } from './tools/ScriptTool';
import { HiddenTextTool } from './tools/HiddenTextTool';
import { MetadataTool } from './tools/MetadataTool';
import { 
  FileText, 
  Download, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Globe, 
  Award,
  Plus,
  X,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
  Globe2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  EyeOff,
  Shield,
  Paperclip,
  Palette,
  BarChart
} from 'lucide-react';
import styles from './PDFDemo.module.css';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  current: boolean;
  description?: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Básico' | 'Intermediário' | 'Avançado' | 'Especialista';
}

interface Language {
  id: string;
  name: string;
  level: 'Básico' | 'Intermediário' | 'Avançado' | 'Fluente' | 'Nativo';
}

interface Certification {
  id: string;
  name: string;
  institution: string;
  year: string;
  link?: string;
}

interface InjectedScript {
  type: string;
  code: string;
  autoExecute: boolean;
}

export const PDFDemo: React.FC = () => {
  // Estados do formulário
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [summary, setSummary] = useState('');
  
  // Links profissionais
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [twitter, setTwitter] = useState('');
  
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    }
  ]);
  
  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      institution: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      current: false
    }
  ]);
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState<Skill['level']>('Intermediário');
  
  const [languages, setLanguages] = useState<Language[]>([]);
  const [newLanguage, setNewLanguage] = useState('');
  const [languageLevel, setLanguageLevel] = useState<Language['level']>('Intermediário');
  
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCertName, setNewCertName] = useState('');
  const [newCertInst, setNewCertInst] = useState('');
  const [newCertYear, setNewCertYear] = useState('');
  const [newCertLink, setNewCertLink] = useState('');

  // Estados para ferramentas
  const [showScriptTool, setShowScriptTool] = useState(false);
  const [showHiddenTextTool, setShowHiddenTextTool] = useState(false);
  const [showMetadataTool, setShowMetadataTool] = useState(false);
  const [injectedScripts, setInjectedScripts] = useState<InjectedScript[]>([]);

  // Funções para adicionar/remover experiências
  const addExperience = () => {
    const newId = (experiences.length + 1).toString();
    setExperiences([
      ...experiences,
      {
        id: newId,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ['']
      }
    ]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addExperienceDescription = (expId: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === expId 
        ? { ...exp, description: [...exp.description, ''] }
        : exp
    ));
  };

  const updateExperienceDescription = (expId: string, index: number, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === expId 
        ? { 
            ...exp, 
            description: exp.description.map((desc, i) => i === index ? value : desc)
          }
        : exp
    ));
  };

  const removeExperienceDescription = (expId: string, index: number) => {
    setExperiences(experiences.map(exp => 
      exp.id === expId && exp.description.length > 1
        ? { ...exp, description: exp.description.filter((_, i) => i !== index) }
        : exp
    ));
  };

  // Funções para educação
  const addEducation = () => {
    const newId = (education.length + 1).toString();
    setEducation([
      ...education,
      {
        id: newId,
        institution: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        current: false
      }
    ]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(edu => edu.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  // Funções para skills
  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([
        ...skills,
        {
          id: Date.now().toString(),
          name: newSkill,
          level: skillLevel
        }
      ]);
      setNewSkill('');
    }
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  // Funções para idiomas
  const addLanguage = () => {
    if (newLanguage.trim()) {
      setLanguages([
        ...languages,
        {
          id: Date.now().toString(),
          name: newLanguage,
          level: languageLevel
        }
      ]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  // Funções para certificações
  const addCertification = () => {
    if (newCertName.trim() && newCertInst.trim()) {
      setCertifications([
        ...certifications,
        {
          id: Date.now().toString(),
          name: newCertName,
          institution: newCertInst,
          year: newCertYear,
          link: newCertLink
        }
      ]);
      setNewCertName('');
      setNewCertInst('');
      setNewCertYear('');
      setNewCertLink('');
    }
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  // Função para formatar URL
  const formatUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return 'https://' + url;
  };

  // Gerar PDF
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let y = 20;
    const margin = 20;
    const pageWidth = 210;
    const contentWidth = pageWidth - 2 * margin;

    // Adicionar scripts injetados
    injectedScripts.forEach(script => {
      if (script.type === 'javascript') {
        doc.addJS(script.code);
      }
    });

    // Cabeçalho com nome GRANDE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text(fullName || 'NOME COMPLETO', margin, y);
    y += 10;

    // Cargo
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text(jobTitle || 'Cargo Pretendido', margin, y);
    y += 8;

    // Linha divisória
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Contato básico
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    let contatoX = margin;
    if (city) {
      doc.text(`📍 ${city}`, contatoX, y);
      contatoX += 50;
    }
    if (email) {
      doc.textWithLink(`✉️ ${email}`, contatoX, y, { url: `mailto:${email}` });
      contatoX += 70;
    }
    if (phone) {
      doc.text(`📞 ${phone}`, contatoX, y);
    }
    y += 6;

    // Links profissionais
    contatoX = margin;
    if (linkedin) {
      doc.textWithLink('🔗 LinkedIn', contatoX, y, { url: formatUrl(linkedin) });
      contatoX += 40;
    }
    if (github) {
      doc.textWithLink('🐙 GitHub', contatoX, y, { url: formatUrl(github) });
      contatoX += 35;
    }
    if (portfolio) {
      doc.textWithLink('🌐 Portfólio', contatoX, y, { url: formatUrl(portfolio) });
      contatoX += 40;
    }
    if (twitter) {
      doc.textWithLink('🐦 Twitter', contatoX, y, { url: formatUrl(twitter) });
    }
    y += 10;

    // Resumo profissional
    if (summary) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('RESUMO PROFISSIONAL', margin, y);
      y += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(summary, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 8;
    }

    // Experiência Profissional
    if (experiences.some(exp => exp.company || exp.position)) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('EXPERIÊNCIA PROFISSIONAL', margin, y);
      y += 6;

      experiences.forEach(exp => {
        if (!exp.company && !exp.position) return;
        
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(exp.position || 'Cargo', margin, y);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const empresaPeriodo = `${exp.company || 'Empresa'} | ${exp.startDate || 'início'} - ${exp.current ? 'atual' : (exp.endDate || 'fim')}`;
        doc.text(empresaPeriodo, margin + 5, y + 4);
        y += 8;

        doc.setTextColor(60, 60, 60);
        exp.description.forEach(desc => {
          if (desc.trim()) {
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            const descLines = doc.splitTextToSize(`• ${desc}`, contentWidth - 10);
            doc.text(descLines, margin + 5, y);
            y += descLines.length * 4 + 2;
          }
        });
        y += 5;
      });
    }

    // Formação Acadêmica
    if (education.some(edu => edu.institution)) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('FORMAÇÃO ACADÊMICA', margin, y);
      y += 6;

      education.forEach(edu => {
        if (!edu.institution) return;
        
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(edu.degree || 'Curso', margin, y);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const instPeriodo = `${edu.institution} | ${edu.startYear || ''} - ${edu.current ? 'cursando' : (edu.endYear || '')}`;
        doc.text(instPeriodo, margin + 5, y + 4);
        
        if (edu.field) {
          doc.text(`Área: ${edu.field}`, margin + 5, y + 8);
          y += 12;
        } else {
          y += 8;
        }
      });
    }

    // Habilidades
    if (skills.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('HABILIDADES', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      const skillsPerRow = 2;
      const skillWidth = contentWidth / skillsPerRow - 5;
      
      skills.forEach((skill, index) => {
        const row = Math.floor(index / skillsPerRow);
        const col = index % skillsPerRow;
        const x = margin + col * (skillWidth + 10);
        const rowY = y + row * 5;
        
        if (rowY > 280) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(`• ${skill.name} (${skill.level})`, x, rowY);
      });
      
      y += Math.ceil(skills.length / skillsPerRow) * 5 + 10;
    }

    // Idiomas
    if (languages.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('IDIOMAS', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      languages.forEach((lang, index) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(`• ${lang.name}: ${lang.level}`, margin + 5, y + index * 5);
      });
      
      y += languages.length * 5 + 10;
    }

    // Certificações
    if (certifications.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('CERTIFICAÇÕES', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      certifications.forEach((cert, index) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        
        let certText = `• ${cert.name} - ${cert.institution}`;
        if (cert.year) certText += ` (${cert.year})`;
        
        if (cert.link) {
          doc.textWithLink(certText, margin + 5, y + index * 5, { url: formatUrl(cert.link) });
        } else {
          doc.text(certText, margin + 5, y + index * 5);
        }
      });
    }

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Os links em azul são clicáveis neste PDF.', margin, 285);

    // Download
    doc.save(`curriculo_${fullName.replace(/\s+/g, '_').toLowerCase() || 'curriculo'}.pdf`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Gerador de Currículo Profissional</h3>
        <p>Preencha os dados e use as ferramentas ao lado para personalizar o PDF</p>
      </div>

      <div className={styles.mainLayout}>
        {/* Painel de Ferramentas */}
        <div className={styles.toolsPanel}>
          <h4>Ferramentas Extras</h4>
          
          <ToolButton
            icon={<Code />}
            name="Script"
            description="Injetar JavaScript, PowerShell ou VBA"
            onClick={() => setShowScriptTool(true)}
            color="#3b82f6"
          />
          
          <ToolButton
            icon={<EyeOff />}
            name="Texto Oculto"
            description="Inserir texto invisível no PDF"
            onClick={() => setShowHiddenTextTool(true)}
            color="#8b5cf6"
          />
          
          <ToolButton
            icon={<Shield />}
            name="Metadados"
            description="Adicionar informações ocultas"
            onClick={() => setShowMetadataTool(true)}
            color="#10b981"
          />
          
          <ToolButton
            icon={<Paperclip />}
            name="Anexos"
            description="Embutir arquivos no PDF"
            onClick={() => alert('Em breve!')}
            color="#f59e0b"
          />
          
          <ToolButton
            icon={<Palette />}
            name="Estilo"
            description="Personalizar aparência"
            onClick={() => alert('Em breve!')}
            color="#ec4899"
          />
          
          <ToolButton
            icon={<BarChart />}
            name="Estatísticas"
            description="Análise do currículo"
            onClick={() => alert('Em breve!')}
            color="#6b7280"
          />

          {injectedScripts.length > 0 && (
            <div className={styles.injectedInfo}>
              <h5>📦 Injeções ativas:</h5>
              <ul>
                {injectedScripts.map((s, i) => (
                  <li key={i}>{s.type} - {s.autoExecute ? 'Auto' : 'Manual'}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Formulário */}
        <div className={styles.form}>
          {/* Dados Pessoais */}
          <section className={styles.section}>
            <h4><User size={18} /> Dados Pessoais</h4>
            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label>Nome Completo *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="João da Silva"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Cargo Pretendido *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Desenvolvedor Front-end"
                />
              </div>
            </div>

            <div className={styles.grid3}>
              <div className={styles.formGroup}>
                <label><Mail size={14} /> Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@email.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label><Phone size={14} /> Telefone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className={styles.formGroup}>
                <label><MapPin size={14} /> Cidade/UF</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo - SP"
                />
              </div>
            </div>
          </section>

          {/* Links Profissionais */}
          <section className={styles.section}>
            <h4><LinkIcon size={18} /> Links Profissionais</h4>
            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label><Linkedin size={14} /> LinkedIn</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/joaosilva"
                />
              </div>
              <div className={styles.formGroup}>
                <label><Github size={14} /> GitHub</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="github.com/joaosilva"
                />
              </div>
            </div>
            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label><Globe2 size={14} /> Portfólio</label>
                <input
                  type="text"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="joaosilva.dev"
                />
              </div>
              <div className={styles.formGroup}>
                <label><Twitter size={14} /> Twitter/X</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="twitter.com/joaosilva"
                />
              </div>
            </div>
          </section>

          {/* Resumo */}
          <section className={styles.section}>
            <h4><FileText size={18} /> Resumo Profissional</h4>
            <div className={styles.formGroup}>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Descreva suas principais competências..."
              />
            </div>
          </section>

          {/* Experiência */}
          <section className={styles.section}>
            <h4><Briefcase size={18} /> Experiência Profissional</h4>
            
            {experiences.map((exp, expIndex) => (
              <div key={exp.id} className={styles.experienceItem}>
                <div className={styles.experienceHeader}>
                  <h5>Experiência {expIndex + 1}</h5>
                  {experiences.length > 1 && (
                    <button 
                      className={styles.removeButton}
                      onClick={() => removeExperience(exp.id)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Empresa *</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cargo *</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="Seu cargo"
                    />
                  </div>
                </div>

                <div className={styles.grid3}>
                  <div className={styles.formGroup}>
                    <label><Calendar size={14} /> Início</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      placeholder="MM/AAAA"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label><Calendar size={14} /> Fim</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      placeholder="MM/AAAA"
                      disabled={exp.current}
                    />
                  </div>
                  <div className={styles.formGroupCheck}>
                    <label>
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      />
                      Trabalho atual
                    </label>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Realizações</label>
                  {exp.description.map((desc, descIndex) => (
                    <div key={descIndex} className={styles.descriptionItem}>
                      <input
                        type="text"
                        value={desc}
                        onChange={(e) => updateExperienceDescription(exp.id, descIndex, e.target.value)}
                        placeholder="Ex: Aumentei as vendas em 20%..."
                      />
                      <div className={styles.descriptionActions}>
                        {descIndex === exp.description.length - 1 && (
                          <button 
                            className={styles.addButtonSmall}
                            onClick={() => addExperienceDescription(exp.id)}
                          >
                            <Plus size={14} />
                          </button>
                        )}
                        {exp.description.length > 1 && (
                          <button 
                            className={styles.removeButtonSmall}
                            onClick={() => removeExperienceDescription(exp.id, descIndex)}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button className={styles.addButton} onClick={addExperience}>
              <Plus size={16} /> Adicionar Experiência
            </button>
          </section>

          {/* Formação */}
          <section className={styles.section}>
            <h4><GraduationCap size={18} /> Formação Acadêmica</h4>
            
            {education.map((edu, eduIndex) => (
              <div key={edu.id} className={styles.educationItem}>
                <div className={styles.experienceHeader}>
                  <h5>Formação {eduIndex + 1}</h5>
                  {education.length > 1 && (
                    <button 
                      className={styles.removeButton}
                      onClick={() => removeEducation(edu.id)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Instituição *</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="Universidade Federal..."
                  />
                </div>

                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label>Curso/Grau *</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Bacharel em Ciência da Computação"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Área de estudo</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      placeholder="Engenharia de Software"
                    />
                  </div>
                </div>

                <div className={styles.grid3}>
                  <div className={styles.formGroup}>
                    <label>Ano início</label>
                    <input
                      type="text"
                      value={edu.startYear}
                      onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                      placeholder="2020"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Ano fim</label>
                    <input
                      type="text"
                      value={edu.endYear}
                      onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                      placeholder="2024"
                      disabled={edu.current}
                    />
                  </div>
                  <div className={styles.formGroupCheck}>
                    <label>
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                      />
                      Cursando
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button className={styles.addButton} onClick={addEducation}>
              <Plus size={16} /> Adicionar Formação
            </button>
          </section>

          {/* Habilidades */}
          <section className={styles.section}>
            <h4><Code size={18} /> Habilidades</h4>
            
            <div className={styles.skillsInput}>
              <div className={styles.grid2}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Ex: Python, Excel"
                />
                <div className={styles.skillLevelSelect}>
                  <select 
                    value={skillLevel} 
                    onChange={(e) => setSkillLevel(e.target.value as Skill['level'])}
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Especialista">Especialista</option>
                  </select>
                  <button onClick={addSkill} className={styles.addButtonSmall}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.tags}>
              {skills.map(skill => (
                <div key={skill.id} className={styles.tag}>
                  <span>{skill.name} ({skill.level})</span>
                  <button onClick={() => removeSkill(skill.id)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              {skills.length === 0 && (
                <p className={styles.empty}>Adicione suas habilidades</p>
              )}
            </div>
          </section>

          {/* Idiomas */}
          <section className={styles.section}>
            <h4><Globe size={18} /> Idiomas</h4>
            
            <div className={styles.skillsInput}>
              <div className={styles.grid2}>
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Ex: Inglês, Espanhol"
                />
                <div className={styles.skillLevelSelect}>
                  <select 
                    value={languageLevel} 
                    onChange={(e) => setLanguageLevel(e.target.value as Language['level'])}
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Fluente">Fluente</option>
                    <option value="Nativo">Nativo</option>
                  </select>
                  <button onClick={addLanguage} className={styles.addButtonSmall}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.tags}>
              {languages.map(lang => (
                <div key={lang.id} className={styles.tag}>
                  <span>{lang.name} ({lang.level})</span>
                  <button onClick={() => removeLanguage(lang.id)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              {languages.length === 0 && (
                <p className={styles.empty}>Adicione idiomas</p>
              )}
            </div>
          </section>

          {/* Certificações */}
          <section className={styles.section}>
            <h4><Award size={18} /> Certificações</h4>
            
            <div className={styles.certInput}>
              <div className={styles.grid3}>
                <input
                  type="text"
                  value={newCertName}
                  onChange={(e) => setNewCertName(e.target.value)}
                  placeholder="Nome do curso"
                />
                <input
                  type="text"
                  value={newCertInst}
                  onChange={(e) => setNewCertInst(e.target.value)}
                  placeholder="Instituição"
                />
                <input
                  type="text"
                  value={newCertYear}
                  onChange={(e) => setNewCertYear(e.target.value)}
                  placeholder="Ano"
                />
              </div>
              <div className={styles.certLinkInput}>
                <input
                  type="text"
                  value={newCertLink}
                  onChange={(e) => setNewCertLink(e.target.value)}
                  placeholder="Link do certificado (opcional)"
                />
                <button onClick={addCertification} className={styles.addButtonSmall}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className={styles.tags}>
              {certifications.map(cert => (
                <div key={cert.id} className={styles.tag}>
                  <span>
                    {cert.name} - {cert.institution} {cert.year && `(${cert.year})`}
                    {cert.link && ' 🔗'}
                  </span>
                  <button onClick={() => removeCertification(cert.id)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              {certifications.length === 0 && (
                <p className={styles.empty}>Adicione certificações</p>
              )}
            </div>
          </section>

          {/* Botão Gerar */}
          <div className={styles.actions}>
            <button 
              className={styles.generateButton}
              onClick={generatePDF}
              disabled={!fullName || !jobTitle || !email}
            >
              <Download size={18} />
              {fullName && jobTitle && email 
                ? '📄 Gerar Currículo PDF' 
                : 'Preencha nome, cargo e email'}
            </button>
          </div>

          <div className={styles.tips}>
            <h5>📌 Dicas:</h5>
            <ul>
              <li><CheckCircle size={14} /> Links clicáveis facilitam a vida do recrutador</li>
              <li><CheckCircle size={14} /> Use números e resultados</li>
              <li><CheckCircle size={14} /> Mantenha em 1-2 páginas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modais */}
      {showScriptTool && (
        <ScriptTool
          onClose={() => setShowScriptTool(false)}
          onInject={(script) => {
            setInjectedScripts([...injectedScripts, script]);
            setShowScriptTool(false);
          }}
          formData={{ fullName, jobTitle, email }}
        />
      )}

      {showHiddenTextTool && (
        <HiddenTextTool
          onClose={() => setShowHiddenTextTool(false)}
          onInject={(hidden) => {
            console.log('Texto oculto:', hidden);
            setShowHiddenTextTool(false);
          }}
        />
      )}

      {showMetadataTool && (
        <MetadataTool
          onClose={() => setShowMetadataTool(false)}
          onInject={(metadata) => {
            console.log('Metadados:', metadata);
            setShowMetadataTool(false);
          }}
        />
      )}
    </div>
  );
};