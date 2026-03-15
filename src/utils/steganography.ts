
export interface StegoOptions {
  cipherType: 'caesar' | 'vigenere' | 'xor';
  cipherKey: string;
  compress: boolean;
  useChannelMasking?: boolean;
}

export class Steganography {
  /**
   * Esconde mensagem na imagem (SEM criptografia)
   */
  static async encode(
    imageFile: File, 
    message: string
  ): Promise<{ imageUrl: string, metadata: any }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Erro ao criar contexto'));
            return;
          }

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;

          // Preparar mensagem com marcadores
          const fullMessage = `§MSG§${message}§FIM§`;
          
          // Converter para binário
          let binaryMessage = '';
          for (let i = 0; i < fullMessage.length; i++) {
            binaryMessage += fullMessage.charCodeAt(i).toString(2).padStart(8, '0');
          }

          // Verificar capacidade
          if (binaryMessage.length > data.length / 4) {
            reject(new Error('Mensagem muito grande'));
            return;
          }

          // Esconder nos LSBs
          for (let i = 0; i < binaryMessage.length; i++) {
            const bit = parseInt(binaryMessage[i]);
            data[i * 4] = (data[i * 4] & 0xFE) | bit;
          }

          ctx.putImageData(imageData, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const metadata = {
                cleanName: 'imagem_' + Date.now() + '.png',
                messageLength: message.length
              };
              resolve({ imageUrl: url, metadata });
            } else {
              reject(new Error('Erro ao criar imagem'));
            }
          }, 'image/png');
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(imageFile);
    });
  }

  /**
   * Extrai mensagem BRUTA da imagem
   */
static async decodeRaw(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Limite de tamanho para mobile
      if (imageFile.size > 5 * 1024 * 1024) { // 5MB
        reject(new Error('Imagem muito grande para dispositivo móvel (máx 5MB)'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const img = new Image();
          
          img.onload = () => {
            try {
              // Limite de resolução para mobile
              if (img.width * img.height > 2000000) { // 2 megapixels
                reject(new Error('Resolução muito alta para dispositivo móvel'));
                return;
              }

              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Erro ao criar contexto'));
                return;
              }

              ctx.drawImage(img, 0, 0);
              
              // Usar getImageData com limite de pixels
              const imageData = ctx.getImageData(0, 0, img.width, img.height);
              const data = imageData.data;

              // Extrair LSBs (apenas canal R)
              let binaryMessage = '';
              const maxBits = Math.min(data.length, 2000000); // Limite de segurança
              
              for (let i = 0; i < maxBits; i += 4) {
                binaryMessage += data[i] & 1;
              }

              // Converter para texto
              let fullMessage = '';
              for (let i = 0; i < binaryMessage.length; i += 8) {
                if (i + 8 > binaryMessage.length) break;
                const byte = binaryMessage.slice(i, i + 8);
                fullMessage += String.fromCharCode(parseInt(byte, 2));
              }

              // Procurar marcadores
              const start = fullMessage.indexOf('§MSG§');
              if (start === -1) {
                reject(new Error('Nenhuma mensagem encontrada'));
                return;
              }

              const end = fullMessage.indexOf('§FIM§', start);
              if (end === -1) {
                reject(new Error('Mensagem corrompida'));
                return;
              }

              const message = fullMessage.substring(start + 5, end);
              resolve(message);
              
            } catch (err) {
              reject(new Error('Erro ao processar pixels: ' + err));
            }
          };

          img.onerror = () => {
            reject(new Error('Erro ao carregar imagem'));
          };

          img.src = e.target?.result as string;
          
        } catch (err) {
          reject(new Error('Erro ao processar imagem: ' + err));
        }
      };

      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };

      reader.readAsDataURL(imageFile);
      
    } catch (err) {
      reject(new Error('Erro fatal: ' + err));
    }
  });
}

  static async calculateCapacity(imageFile: File): Promise<number> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // 1 bit por pixel (canal R)
          const capacity = Math.floor((img.width * img.height) / 8) - 50;
          resolve(capacity > 0 ? capacity : 0);
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(imageFile);
    });
  }
}