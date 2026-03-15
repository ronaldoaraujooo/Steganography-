// 🔥 REMOVIDO: import do Cipher não usado
// import { Cipher } from './cipher';

// Primeiro, definir os tipos
export interface PlatformConfig {
  name: string;
  compression: 'aggressive' | 'medium' | 'none';
  qualityFactor: number;
  ecc: string;
  technique: string;
  description: string;
  icon: string;
}

export interface PlatformConfigs {
  [key: string]: PlatformConfig;
}

// Agora sim, o objeto com tipo definido
export const platformConfigs: PlatformConfigs = {
  'whatsapp': {
    name: 'WhatsApp',
    compression: 'aggressive',
    qualityFactor: 85,
    ecc: 'reed-solomon(25%)',
    technique: 'DCT mid-frequency + ECC',
    description: 'Usa coeficientes DCT estáveis + correção de erros',
    icon: '📱'
  },
  'instagram': {
    name: 'Instagram',
    compression: 'aggressive',
    qualityFactor: 90,
    ecc: 'ldpc',
    technique: 'DCT coefficient signs',
    description: 'Modifica sinais de coeficientes (invariantes)',
    icon: '📸'
  },
  'telegram': {
    name: 'Telegram',
    compression: 'medium',
    qualityFactor: 95,
    ecc: 'hamming(15%)',
    technique: 'Adaptive ECC + LSB',
    description: 'Versão moderada com correção de erros',
    icon: '✈️'
  },
  'facebook': {
    name: 'Facebook',
    compression: 'aggressive',
    qualityFactor: 85,
    ecc: 'bch(20%)',
    technique: 'DCT + BCH codes',
    description: 'Combinação de DCT e correção BCH',
    icon: '👍'
  },
  'twitter': {
    name: 'Twitter/X',
    compression: 'aggressive',
    qualityFactor: 80,
    ecc: 'reed-solomon(30%)',
    technique: 'Robust DCT + RS',
    description: 'Máxima robustez para compressão pesada',
    icon: '🐦'
  },
  'email': {
    name: 'Email',
    compression: 'none',
    qualityFactor: 100,
    ecc: 'none',
    technique: 'LSB normal',
    description: 'Sem compressão, LSB tradicional',
    icon: '📧'
  }
};

// Simulação de Reed-Solomon simplificada
export class ReedSolomon {
  // Adiciona redundância (simplificado)
  static encode(data: string, redundancy: number = 25): string {
    const repeatCount = Math.floor(redundancy / 10) + 1;
    let encoded = '';
    
    for (let i = 0; i < data.length; i++) {
      encoded += data[i].repeat(repeatCount);
    }
    
    // Adiciona marcador de redundância
    return `§RS${repeatCount}§${encoded}`;
  }

  // Decodifica com votação majoritária
  static decode(data: string): string {
    const rsMatch = data.match(/§RS(\d+)§(.*)/s);
    if (!rsMatch) return data;
    
    const repeatCount = parseInt(rsMatch[1]);
    const encoded = rsMatch[2];
    
    let result = '';
    for (let i = 0; i < encoded.length; i += repeatCount) {
      const chunk = encoded.slice(i, i + repeatCount);
      
      // Votação majoritária
      const counts: Record<string, number> = {};
      for (const char of chunk) {
        counts[char] = (counts[char] || 0) + 1;
      }
      
      let maxChar = chunk[0];
      let maxCount = 0;
      for (const [char, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          maxChar = char;
        }
      }
      result += maxChar;
    }
    
    return result;
  }
}

// Simulação de LDPC simplificada
export class LDPC {
  static encode(data: string): string {
    // Simples: adicionar paridade em blocos
    let encoded = '';
    for (let i = 0; i < data.length; i += 3) {
      const chunk = data.slice(i, i + 3);
      encoded += chunk;
      
      // Adiciona bit de paridade
      let parity = 0;
      for (const char of chunk) {
        parity ^= char.charCodeAt(0);
      }
      encoded += String.fromCharCode(parity % 256);
    }
    return `§LDPC§${encoded}`;
  }

  static decode(data: string): string {
    const ldpcMatch = data.match(/§LDPC§(.*)/s);
    if (!ldpcMatch) return data;
    
    const encoded = ldpcMatch[1];
    let result = '';
    
    for (let i = 0; i < encoded.length; i += 4) {
      const chunk = encoded.slice(i, i + 3);
      const parity = encoded[i + 3]?.charCodeAt(0) || 0;
      
      let calcParity = 0;
      for (const char of chunk) {
        calcParity ^= char.charCodeAt(0);
      }
      
      // Se paridade bater, usa chunk
      if (calcParity === parity) {
        result += chunk;
      } else {
        // Tenta recuperar (simplificado)
        result += chunk[0] || '';
      }
    }
    
    return result;
  }
}

// Simulação de BCH simplificada
export class BCH {
  static encode(data: string, redundancy: number = 20): string {
    // Adiciona checksum
    let checksum = 0;
    for (let i = 0; i < data.length; i++) {
      checksum ^= data.charCodeAt(i);
    }
    return `§BCH${redundancy}§${data}§CK${checksum}§`;
  }

  static decode(data: string): string {
    const bchMatch = data.match(/§BCH(\d+)§(.*)§CK(\d+)§/s);
    if (!bchMatch) return data;
    
    const msg = bchMatch[2];
    const checksum = parseInt(bchMatch[3]);
    
    let calcChecksum = 0;
    for (let i = 0; i < msg.length; i++) {
      calcChecksum ^= msg.charCodeAt(i);
    }
    
    return calcChecksum === checksum ? msg : '[ERRO] ' + msg;
  }
}

// Simulação de Hamming simplificada
export class Hamming {
  static encode(data: string, redundancy: number = 15): string {
    // Adiciona paridade simples
    let encoded = '';
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      const code = char.charCodeAt(0);
      encoded += char;
      
      // Adiciona bits de paridade
      const parity = (code >> 4) ^ (code & 0x0F);
      encoded += String.fromCharCode(parity + 32); // Printable chars
    }
    return `§HAM${redundancy}§${encoded}`;
  }

  static decode(data: string): string {
    const hamMatch = data.match(/§HAM\d+§(.*)/s);
    if (!hamMatch) return data;
    
    const encoded = hamMatch[1];
    let result = '';
    
    for (let i = 0; i < encoded.length; i += 2) {
      const char = encoded[i];
      const parity = encoded[i + 1]?.charCodeAt(0) - 32 || 0;
      
      const code = char.charCodeAt(0);
      const calcParity = (code >> 4) ^ (code & 0x0F);
      
      result += calcParity === parity ? char : '?';
    }
    
    return result;
  }
}

// Função principal de codificação robusta
export class RobustSteganography {
  // Adiciona camada de correção de erros baseada na plataforma
  static addErrorCorrection(message: string, platform: string): string {
    const config = platformConfigs[platform];
    if (!config || config.ecc === 'none') return message;
    
    switch(config.ecc.split('(')[0]) {
      case 'reed-solomon':
        return ReedSolomon.encode(message, 25);
      case 'ldpc':
        return LDPC.encode(message);
      case 'bch':
        return BCH.encode(message, 20);
      case 'hamming':
        return Hamming.encode(message, 15);
      default:
        return message;
    }
  }

  // Remove camada de correção de erros
  static removeErrorCorrection(message: string): string {
    if (message.startsWith('§RS')) return ReedSolomon.decode(message);
    if (message.startsWith('§LDPC')) return LDPC.decode(message);
    if (message.startsWith('§BCH')) return BCH.decode(message);
    if (message.startsWith('§HAM')) return Hamming.decode(message);
    return message;
  }

  // 🔥 CORRIGIDO: parâmetros removidos pois não usados
  static async robustDecode(): Promise<string> {
    // Em um sistema real, você extrairia múltiplas cópias
    // e faria votação majoritária
    return '[Simulação] Mensagem recuperada com robustez!';
  }
}