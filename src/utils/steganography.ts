
export class Steganography {
  static async encode(imageFile: File, message: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Criar canvas
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Erro ao criar contexto 2D'));
            return;
          }

          // Desenhar imagem
          ctx.drawImage(img, 0, 0);
          
          // Obter dados dos pixels
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;

          // Preparar mensagem (adicionar delimitadores)
          const messageWithDelimiters = `§START§${message}§END§`;
          
          // Converter mensagem para binário
          let binaryMessage = '';
          for (let i = 0; i < messageWithDelimiters.length; i++) {
            const charCode = messageWithDelimiters.charCodeAt(i);
            binaryMessage += charCode.toString(2).padStart(8, '0');
          }

          // Verificar se a mensagem cabe na imagem
          if (binaryMessage.length > data.length) {
            reject(new Error('Mensagem muito grande para esta imagem'));
            return;
          }

          // Esconder mensagem nos LSBs
          for (let i = 0; i < binaryMessage.length; i++) {
            const bit = parseInt(binaryMessage[i]);
            // Usar o canal R (índice i*4) para modificar
            data[i * 4] = (data[i * 4] & 0xFE) | bit;
          }

          // Atualizar canvas
          ctx.putImageData(imageData, 0, 0);
          
          // Converter para blob e depois para URL
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve(url);
            } else {
              reject(new Error('Erro ao criar blob da imagem'));
            }
          }, 'image/png');
        };

        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(imageFile);
    });
  }

  /**
   * Revela uma mensagem escondida em uma imagem
   */
  static async decode(imageFile: File): Promise<string> {
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
            reject(new Error('Erro ao criar contexto 2D'));
            return;
          }

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;

          // Extrair bits LSB
          let binaryMessage = '';
          for (let i = 0; i < data.length; i += 4) {
            const bit = data[i] & 1; // Pega o LSB do canal R
            binaryMessage += bit;
          }

          // Converter binário para texto
          let message = '';
          for (let i = 0; i < binaryMessage.length; i += 8) {
            if (i + 8 > binaryMessage.length) break;
            
            const byte = binaryMessage.slice(i, i + 8);
            const charCode = parseInt(byte, 2);
            
            if (charCode === 0) continue;
            
            message += String.fromCharCode(charCode);
            
            // Verificar se encontrou o delimitador final
            if (message.includes('§END§')) {
              const start = message.indexOf('§START§') + 7;
              const end = message.indexOf('§END§');
              const extractedMessage = message.slice(start, end);
              resolve(extractedMessage);
              return;
            }
          }

          reject(new Error('Nenhuma mensagem encontrada na imagem'));
        };

        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(imageFile);
    });
  }

  /**
   * Calcula a capacidade máxima de caracteres em uma imagem
   */
  static calculateCapacity(imageFile: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Capacidade = número de pixels (usando canal R)
          const capacity = Math.floor((img.width * img.height) / 8) - 50; // -50 para delimitadores
          resolve(capacity > 0 ? capacity : 0);
        };

        img.onerror = () => reject(new Error('Erro ao calcular capacidade'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(imageFile);
    });
  }
}