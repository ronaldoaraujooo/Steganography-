# Steganography CMS - Esconda Mensagens em Imagens com LSB

![Version](https://img.shields.io/badge/version-3.0.0-blue)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

<div align="center">
  <img src="public/demo.gif" alt="Demonstração do Steganography CMS" width="600"/>
  <p><em>Interface moderna e responsiva para esconder mensagens em imagens usando técnica LSB</em></p>
</div>

## Sobre o Projeto

**Steganography CMS** é um sistema completo de esteganografia que permite esconder mensagens secretas dentro de imagens usando a técnica **LSB (Least Significant Bit)**. A mensagem fica invisível aos olhos, mas pode ser recuperada com a ferramenta certa.

###  Funcionalidades

| Feature | Status | Descrição |
|---------|--------|-----------|
| **Esteganografia LSB** | ✅ Completo | Esconde texto em imagens PNG |
| **Múltiplas cifras** | ✅ Completo | Caesar, Vigenère, XOR, Base64 |
| **Ferramentas de texto** | ✅ Completo | Reverse Text, ROT13 |
| **Conversor de imagens** | ✅ Completo | Qualquer formato → PNG |
| **Gerador de currículo** | ✅ Completo | PDF profissional com dados |
| **Injeção de scripts** | ⚠️ Beta | JavaScript em PDF (educacional) |
| **Texto oculto** | ⚠️ Beta | Metadados e after-EOF |
| **Modo escuro** | 📅 Planejado | Em breve |

## Como funciona tecnicamente

### O que é LSB (Least Significant Bit)?

Cada pixel de uma imagem tem 4 canais de cor (RGBA):
- **R** (Vermelho)
- **G** (Verde)
- **B** (Azul)
- **A** (Alpha - transparência)

Cada canal é representado por 1 byte (8 bits), com valores de 0 a 255.

Exemplo de um pixel vermelho:
R = 11011010 (218 em decimal)
G = 00000000 (0)
B = 00000000 (0)
A = 11111111 (255)


O **LSB** é o último bit (o menos significativo). Alterar ele **não muda a cor visível**:

R original: 11011010
Modificado: 11011011 (mesmo vermelho)


### Processo de Encode (esconder)

Mensagem "A" (65 em ASCII = binário 01000001)
↓
Cada bit da mensagem substitui o LSB de um pixel
↓
Pixel 1: 1101101[0] ← bit 0
Pixel 2: 1011010[1] ← bit 1
Pixel 3: 0110011[0] ← bit 0
...
↓
Imagem gerada visualmente IDÊNTICA


### Processo de Decode (revelar)

Imagem com mensagem
↓
Extrair LSB de cada pixel
↓
01000001
↓
Converter binário para ASCII
↓
Mensagem "A"


## Guia rápido

### Para ESCONDER uma mensagem:
1. Selecione a aba **"Encode"**
2. Clique na área de upload e escolha uma imagem **PNG**
3. Digite sua mensagem secreta
4. Clique em **"Encode Message"**
5. A imagem será baixada automaticamente com a mensagem escondida

### Para REVELAR uma mensagem:
1. Selecione a aba **"Decode"**
2. Clique na área de upload e escolha a imagem
3. Clique em **"Decode Message"**
4. A mensagem aparecerá num popup

## Ferramentas Extras

O sistema conta com um painel de ferramentas laterais:

| Ferramenta | Descrição |
|------------|-----------|
| **Script Tool** | Injeta JavaScript em PDFs (educacional) |
| **Texto Oculto** | Esconde texto em metadados ou after-EOF |
| **Metadados** | Adiciona informações ocultas ao PDF |
| **Anexos** | Embutir arquivos em PDF (em breve) |
| **Estatísticas** | Análise do currículo (em breve) |

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/steganography-cms.git

# Entre na pasta
cd steganography-cms

# Instale as dependências
npm install

# Rode o projeto
npm run dev

Acesse http://localhost:3000

```
# Exemplo prático

// Código de exemplo para testar
<br/>
const mensagem = "Parabéns! Você achou a mensagem!";
<br/>
const imagem = await Steganography.encode(arquivo, mensagem);
<br/>
// Sua mensagem está escondida!
<br/>

# Roadmap
Esteganografia LSB básica

Cifras clássicas (Caesar, Vigenère, XOR)

Ferramentas de texto (Reverse, Base64)

Conversor de imagens

Gerador de currículo profissional

Suporte a JPG (algoritmos adaptativos)

Criptografia AES antes de esconder

Modo "detector" de esteganografia

Compartilhamento direto em redes

Integração com Google Drive

Modo escuro

# Como contribuir
1- Faça um fork do projeto

2- Crie uma branch (git checkout -b feature/nova-feature)

3- Commit suas mudanças (git commit -m 'Adiciona nova feature')

4- Push para a branch (git push origin feature/nova-feature)

5- Abra um Pull Request


