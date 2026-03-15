// cifras disponíveis
export type CipherType = 'caesar' | 'vigenere' | 'xor' | 'aes-light';

interface CipherOptions {
  type: CipherType;
  key: string;
}

export class Cipher {
  // Cifra de César (mantida para compatibilidade)
  static caesar(text: string, shift: number, decrypt: boolean = false): string {
    if (!text) return '';
    const effectiveShift = decrypt ? -shift : shift;
    
    return text.split('').map(char => {
      if (char.match(/[A-Z]/)) {
        const code = char.charCodeAt(0);
        return String.fromCharCode(((code - 65 + effectiveShift + 26) % 26) + 65);
      }
      else if (char.match(/[a-z]/)) {
        const code = char.charCodeAt(0);
        return String.fromCharCode(((code - 97 + effectiveShift + 26) % 26) + 97);
      }
      else if (char.match(/[0-9]/)) {
        const code = char.charCodeAt(0);
        return String.fromCharCode(((code - 48 + effectiveShift + 10) % 10) + 48);
      }
      return char;
    }).join('');
  }

  // Cifra de Vigenère (bem mais forte!)
  static vigenere(text: string, key: string, decrypt: boolean = false): string {
    if (!text || !key) return text;
    
    const keyUpper = key.toUpperCase();
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char.match(/[A-Z]/)) {
        const shift = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65;
        const code = char.charCodeAt(0);
        if (decrypt) {
          result += String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
        } else {
          result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        keyIndex++;
      }
      else if (char.match(/[a-z]/)) {
        const shift = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65;
        const code = char.charCodeAt(0);
        if (decrypt) {
          result += String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
        } else {
          result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        keyIndex++;
      }
      else if (char.match(/[0-9]/)) {
        const shift = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65;
        const code = char.charCodeAt(0);
        if (decrypt) {
          result += String.fromCharCode(((code - 48 - shift + 10) % 10) + 48);
        } else {
          result += String.fromCharCode(((code - 48 + shift) % 10) + 48);
        }
        keyIndex++;
      }
      else {
        result += char;
      }
    }
    
    return result;
  }

  // XOR simples (rápido e eficaz)
  static xor(text: string, key: string): string {
    if (!text || !key) return text;
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyCode = key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode ^ keyCode);
    }
    return result;
  }

  // Wrapper para usar qualquer cifra
  static encrypt(text: string, options: CipherOptions): string {
    switch (options.type) {
      case 'caesar':
        return this.caesar(text, parseInt(options.key) || text.length);
      case 'vigenere':
        return this.vigenere(text, options.key);
      case 'xor':
        return this.xor(text, options.key);
      default:
        return text;
    }
  }

  static decrypt(text: string, options: CipherOptions): string {
    switch (options.type) {
      case 'caesar':
        return this.caesar(text, parseInt(options.key) || text.length, true);
      case 'vigenere':
        return this.vigenere(text, options.key, true);
      case 'xor':
        return this.xor(text, options.key); // XOR é simétrico
      default:
        return text;
    }
  }

  // Gerar chave forte aleatória
  static generateStrongKey(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }
}