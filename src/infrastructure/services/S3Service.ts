import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    // Configurar AWS S3 Client
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });

    this.bucketName = process.env.S3_BUCKET_NAME || '';
  }

  /**
   * Subir un archivo a S3 y retornar la URL pública
   */
  async uploadFile(
    file: Buffer, 
    fileName: string, 
    contentType: string,
    folder: string = 'uploads'
  ): Promise<string> {
    const key = `${folder}/${uuidv4()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType
      // Removemos ACL: 'public-read' porque el bucket no permite ACLs
    });

    try {
      await this.s3.send(command);
      // Construir la URL pública
      const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      return url;
    } catch (error) {
      console.error('Error subiendo archivo a S3:', error);
      throw new Error('Error subiendo archivo a S3');
    }
  }

  /**
   * Eliminar un archivo de S3
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extraer la key del URL
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remover el '/' inicial

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      await this.s3.send(command);
    } catch (error) {
      console.error('Error eliminando archivo de S3:', error);
      throw new Error('Error eliminando archivo de S3');
    }
  }

  /**
   * Subir foto de perfil de usuario
   */
  async uploadProfilePhoto(file: Buffer, fileName: string, contentType: string): Promise<string> {
    return this.uploadFile(file, fileName, contentType, 'profile-photos');
  }

  /**
   * Subir foto/video de oferta
   */
  async uploadOfferMedia(file: Buffer, fileName: string, contentType: string): Promise<string> {
    return this.uploadFile(file, fileName, contentType, 'offer-media');
  }
}
