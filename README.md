# React + TypeScript + Vite

Steganography CMS - Esconda Mensagens em Imagens com LSB

https://img.shields.io/badge/version-2.1.0-blue
https://img.shields.io/badge/React-18.2.0-61dafb
https://img.shields.io/badge/TypeScript-5.0.0-3178c6
https://img.shields.io/badge/Vite-4.5.14-646cff
https://img.shields.io/badge/license-MIT-green

<div align="center"> <img src="public/demo.gif" alt="Demonstração do Steganography CMS" width="600"/> <p><em>Interface moderna e responsiva para esconder mensagens em imagens usando técnica LSB</em></p> </div>

O que é isso?
Este é um sistema completo de esteganografia que permite esconder mensagens secretas dentro de imagens usando a técnica LSB (Least Significant Bit). A mensagem fica invisível aos olhos, mas pode ser recuperada com a ferramenta certa

 Como funciona tecnicamente
 O que é LSB (Least Significant Bit)?
Cada pixel de uma imagem tem 4 canais de cor (RGBA):

R (Vermelho)

G (Verde)

B (Azul)

A (Alpha - transparência)

Cada canal é representado por 1 byte (8 bits), com valores de 0 a 255.

Exemplo de um pixel vermelho:
R = 11011010 (218 em decimal)
G = 00000000 (0)
B = 00000000 (0)
A = 11111111 (255)

<h1>Processo de Encode (esconder)</h1>

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

<h1> Processo de Decode (revelar)</h1>

Imagem com mensagem
↓
Extrair LSB de cada pixel
↓
01000001
↓
Converter binário para ASCII
↓
Mensagem "A"

Guia rápido
Para ESCONDER uma mensagem:
Selecione a aba "Encode"

Clique na área de upload e escolha uma imagem PNG

Digite sua mensagem secreta

Clique em "Encode Message"

A imagem será baixada automaticamente com a mensagem escondida

Para REVELAR uma mensagem:
Selecione a aba "Decode"

Clique na área de upload e escolha a imagem

Clique em "Decode Message"

A mensagem aparecerá num popup bonitão

<h1>Exemplo prático</h1>

// Código de exemplo para testar
const mensagem = "Parabéns! Você achou o PIX de 3 reais!";
const imagem = await Steganography.encode(arquivo, mensagem);
// Sua mensagem está escondida!

Roadmap
Suporte a JPG (com algoritmos adaptativos)

Criptografia AES antes de esconder

Modo "detector" que avisa se tem mensagem

Compartilhamento direto nas redes

Upload para nuvem (integração com Google Drive)


<h1>Como contribuir</h1>

Faça um fork

Crie uma branch (git checkout -b feature/nova-feature)

Commit (git commit -m 'Adiciona nova feature')

Push (git push origin feature/nova-feature)

Abra um Pull Request


<div align="center"> <p>Feito com ☕ e ❤️ para ensinar segurança digital</p> <p>⚠️ <strong>Aviso:</strong> Use apenas para fins educacionais e legais</p> </div> ```

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

<div align="center">
  <img src="screenshot.png" alt="Steganography CMS em ação" width="800"/>
  <p><em>Interface limpa e profissional - modo escuro incluso!</em></p>
</div>


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
