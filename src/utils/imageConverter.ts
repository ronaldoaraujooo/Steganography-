export class ImageConverter {
  /**
   * Converte qualquer imagem para PNG (sem perdas)
   */
  static async convertToPNG(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      // Verifica se já é PNG
      if (file.type === 'image/png') {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Cria canvas com as dimensões da imagem
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Erro ao criar contexto'));
            return;
          }

          // Desenha a imagem no canvas
          ctx.drawImage(img, 0, 0);
          
          // Converte para PNG (formato sem perdas)
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Erro ao converter imagem'));
              return;
            }

            // Cria novo arquivo PNG
            const pngFile = new File(
              [blob], 
              file.name.replace(/\.[^/.]+$/, '') + '.png',
              { type: 'image/png' }
            );
            
            resolve(pngFile);
          }, 'image/png', 1.0); // Qualidade máxima
        };

        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Versão com preview e confirmação
   */
  static async convertWithPreview(file: File): Promise<{ converted: File, preview: string }> {
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
          
          // Gera preview em PNG
          const previewUrl = canvas.toDataURL('image/png');
          
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Erro ao converter imagem'));
              return;
            }

            const pngFile = new File(
              [blob], 
              file.name.replace(/\.[^/.]+$/, '') + '.png',
              { type: 'image/png' }
            );
            
            resolve({ converted: pngFile, preview: previewUrl });
          }, 'image/png', 1.0);
        };

        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Converte e já retorna o tamanho estimado
   */
  static async getInfo(file: File): Promise<{ width: number; height: number; size: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
            size: img.width * img.height * 4 // Estimativa de tamanho em bytes
          });
        };

        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }
}