export class MetadataCleaner {
  static async cleanImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Criar canvas limpo
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Erro ao criar contexto'));
          return;
        }

        // Desenhar imagem pura (sem metadados)
        ctx.drawImage(img, 0, 0);
        
        // Exportar sem metadados
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Erro ao limpar metadados'));
          }
        }, 'image/png', 1.0);
      };
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }

  static async stripMetadata(file: File): Promise<File> {
    const cleanedBlob = await this.cleanImage(file);
    return new File([cleanedBlob], 'cleaned_' + file.name, {
      type: 'image/png',
      lastModified: Date.now()
    });
  }

  // Gerar nome aleatório para a imagem (dificulta rastreamento)
  static randomizeFilename(originalName: string): string {
    const ext = originalName.split('.').pop() || 'png';
    const random = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return `img_${random}_${timestamp}.${ext}`;
  }
}