export class Compression {
  // Run-Length Encoding simples
  static rleCompress(text: string): string {
    if (!text) return '';
    
    let result = '';
    let count = 1;
    
    for (let i = 0; i < text.length; i++) {
      if (text[i] === text[i + 1]) {
        count++;
      } else {
        if (count > 1) {
          result += `{${count}}${text[i]}`;
        } else {
          result += text[i];
        }
        count = 1;
      }
    }
    
    return result;
  }

  static rleDecompress(text: string): string {
    if (!text) return '';
    
    let result = '';
    let i = 0;
    
    while (i < text.length) {
      if (text[i] === '{') {
        let countStr = '';
        i++;
        while (text[i] !== '}') {
          countStr += text[i];
          i++;
        }
        i++; // pular '}'
        const count = parseInt(countStr);
        const char = text[i];
        result += char.repeat(count);
      } else {
        result += text[i];
      }
      i++;
    }
    
    return result;
  }

  // Huffman simplificado (versão básica)
  static huffmanCompress(text: string): string {
    // Placeholder - implementação real seria mais complexa
    return text; // Por enquanto, só RLE
  }

  // Escolher melhor método baseado no texto
  static smartCompress(text: string): { compressed: string, method: 'none' | 'rle' | 'huffman' } {
    const rleResult = this.rleCompress(text);
    
    if (rleResult.length < text.length) {
      return { compressed: rleResult, method: 'rle' };
    }
    
    return { compressed: text, method: 'none' };
  }
}