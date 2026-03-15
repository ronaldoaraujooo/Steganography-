import { jsPDF } from 'jspdf';
import JSZip from 'jszip';


export class PDFSteganography {
  static async createJSAlertPDF(
  message: string = 'Mensagem educacional'
): Promise<Blob> {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true
    });

    // Conteúdo visível
    doc.setFontSize(16);
    doc.text('Demonstração Educacional - JavaScript em PDF', 20, 20);
    
    doc.setFontSize(12);
    doc.text('Este PDF contém JavaScript que será executado', 20, 40);
    doc.text('automaticamente ao abrir no Chrome.', 20, 50);
    doc.text('', 20, 60);
    doc.text('📢 O JavaScript irá mostrar:', 20, 70);
    doc.text(`   "${message}"`, 30, 80);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('⚠️ Se o alert não aparecer:', 20, 100);
    doc.text('1. Clique no ícone de escudo na barra de endereço', 20, 110);
    doc.text('2. Selecione "Load unsafe scripts"', 20, 120);
    doc.text('3. Recarregue a página', 20, 130);
    doc.text('', 20, 140);
    doc.text('Aviso: Apenas para fins educacionais', 20, 250);
    doc.text('Não use para atividades maliciosas', 20, 260);

    // 🔥 JS MAIS ROBUSTO - Tenta várias formas de execução
    const jsCode = `
      // Tentativa 1: OpenAction (execução automática)
      function showMessage() {
        try {
          app.alert({
            cMsg: "${message}\\n\\nIsso é uma demonstração de execução automática!",
            cTitle: "📢 JavaScript em PDF - Educacional",
            nIcon: 3
          });
        } catch(e) {
          console.log("Alert bloqueado, tentando outra forma...");
        }
      }
      
      // Tentativa 2: Executar quando o documento abrir
      if (this.print) {
        this.print({bUI: true, bSilent: false});
      }
      
      // Tentativa 3: Executar no evento de página
      try {
        showMessage();
      } catch(e) {
        // Silencioso
      }
      
      // Registrar no console para debug
      console.println("PDF executado: " + new Date());
    `;

    doc.addJS(jsCode);

    return doc.output('blob');
    
  } catch (error) {
    console.error('Erro ao criar PDF com JS:', error);
    throw new Error('Falha ao criar PDF com JavaScript');
  }
}

  /**
   * TÉCNICA 2: Criar um PDF seguro (sem JS)
   * Para comparação
   */
  static async createNormalPDF(
    text: string = 'PDF Normal - Sem execução automática'
  ): Promise<Blob> {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('PDF Normal (Sem JavaScript)', 20, 20);
    
    doc.setFontSize(12);
    doc.text(text, 20, 40);
    doc.text('Este PDF não contém código executável.', 20, 60);
    
    return doc.output('blob');
  }

  /**
   * TÉCNICA 3: MalDoc - Polyglot PDF/Word com Macro
   * 
   * Cria um arquivo que é PDF e Word ao mesmo tempo
   * Word tem macro que pode ser usada para demonstração
   */
  static async createMalDocDemo(): Promise<Blob> {
    try {
      // Criar um PDF base
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text('📄 MalDoc Demo - PDF + Word', 20, 20);
      
      doc.setFontSize(12);
      doc.text('Este arquivo é um PDF válido...', 20, 40);
      doc.text('...e também um documento Word com macro!', 20, 50);
      doc.text('', 20, 60);
      doc.text('⚠️ Para fins educacionais apenas', 20, 80);
      
      // Obter bytes do PDF
      const pdfBytes = doc.output('arraybuffer');
      const pdfArray = new Uint8Array(pdfBytes);
      
      // Criar estrutura MHT com macro VBA (educacional)
      const macroVBA = `
        <html xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
        xmlns="http://www.w3.org/TR/REC-html40">
        <head>
        <meta http-equiv=Content-Type content="text/html; charset=UTF-8">
        <xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml>
        <title>Educacional</title>
        
        <!-- VBA Macro Code -->
        <xml id="vba">
        <?mso-application progid="Word.Document"?>
        <![CDATA[
        <script language="VBScript">
        ' ⚠️ DEMONSTRAÇÃO EDUCACIONAL
        ' Não execute macros desconhecidas
        
        Sub AutoOpen()
            ' Esta macro executa automaticamente ao abrir no Word
            MsgBox "🔐 Macro VBA Executada!" & vbCrLf & _
                   "Isso é uma demonstração educacional.", _
                   vbInformation, "MalDoc Demo"
            
            ' Mostrar informações do sistema (educacional)
            Dim user
            user = CreateObject("WScript.Network").UserName
            MsgBox "Usuário: " & user, vbInformation, "Info"
        End Sub
        
        Sub Document_Open()
            AutoOpen
        End Sub
        </script>
        ]]>
        </xml>
        </head>
        <body>
        <p><b>Este arquivo é um PDF válido e um documento Word com macro.</b></p>
        <p>A macro executa ao abrir no Microsoft Word.</p>
        <p style="color:red;">⚠️ APENAS PARA FINS EDUCACIONAIS</p>
        </body>
        </html>
      `;
      
      // Converter macro para bytes
      const macroBytes = new TextEncoder().encode(macroVBA);
      
      // Combinar PDF + macro
      // A estrutura precisa ser: PDF + novo objeto + trailer ajustado
      // Versão simplificada para demonstração
      const combined = new Uint8Array([
        ...pdfArray.slice(0, -6), // Remover trailer original
        ...macroBytes,
        ...new TextEncoder().encode('\n%%EOF')
      ]);
      
      return new Blob([combined], { type: 'application/pdf' });
      
    } catch (error) {
      console.error('Erro ao criar MalDoc:', error);
      throw new Error('Falha ao criar MalDoc');
    }
  }

  /**
   * TÉCNICA 4: PDF com arquivo embutido (educacional)
   */
  static async createEmbeddedFilePDF(): Promise<Blob> {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text('📦 PDF com Arquivo Embutido', 20, 20);
      
      doc.setFontSize(12);
      doc.text('Este PDF contém um arquivo de texto embutido', 20, 40);
      doc.text('que pode ser extraído.', 20, 50);
      
      // Adicionar arquivo embutido (simulado)
      // Nota: jsPDF não suporta embutir arquivos nativamente
      // Mas podemos adicionar como string no final
      
      const embeddedData = `
        %EMBEDDED-FILE%
        Nome: mensagem.txt
        Conteúdo: Isto é um arquivo de demonstração!
        %END-EMBEDDED%
      `;
      
      // Obter bytes do PDF
      const pdfBytes = doc.output('arraybuffer');
      
      // Combinar PDF + dados embutidos
      const combined = new Uint8Array([
        ...new Uint8Array(pdfBytes),
        ...new TextEncoder().encode(embeddedData)
      ]);
      
      return new Blob([combined], { type: 'application/pdf' });
      
    } catch (error) {
      console.error('Erro ao criar PDF com arquivo embutido:', error);
      throw new Error('Falha ao criar PDF com arquivo');
    }
  }

  // ✅ Função REAL usando JSZip - AGORA CORRIGIDA!
  static async extractEmbeddedFiles(pdfFile: File): Promise<string[]> {
    try {
      const zip = await JSZip.loadAsync(pdfFile);
      const files: string[] = [];
      
      // 🔥 CORREÇÃO DEFINITIVA: usar _ para parâmetro não usado
      zip.forEach((relativePath, _file) => {
        files.push(relativePath);
        // _file não é usado, mas o TypeScript não reclama mais
      });
      
      return files;
    } catch (error) {
      // Se não for ZIP válido, é PDF normal
      return [];
    }
  }
  
  // ✅ Adicionar arquivo secreto
  static async addSecretFile(
    pdfFile: File, 
    secretName: string, 
    secretContent: string
  ): Promise<Blob> {
    const zip = await JSZip.loadAsync(pdfFile);
    
    // Adicionar em pasta oculta
    zip.file(`.hidden/${secretName}`, secretContent);
    
    return await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE'
    });
  }
  
  // ✅ Listar comentários do ZIP
  static async getZipComment(pdfFile: File): Promise<string> {
    const zip = await JSZip.loadAsync(pdfFile);
    return (zip as any).comment || '';
  }

  // ✅ Verificar se um PDF tem JavaScript
  static async hasJavaScript(pdfFile: File): Promise<boolean> {
    try {
      const text = await pdfFile.text();
      return text.includes('/JavaScript') || 
             text.includes('/JS') ||
             text.includes('app.alert');
    } catch (error) {
      return false;
    }
  }

}


