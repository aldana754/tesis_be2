import multer from 'multer';
import { S3Service } from '../../infrastructure/services/S3Service';

const s3Service = new S3Service();

// Configurar multer para usar memoria storage
const storage = multer.memoryStorage();

// Filtro para validar tipos de archivo
const fileFilter = (req: any, file: any, cb: any) => {
  // Permitir solo imágenes para fotos de perfil
  if (req.route.path.includes('profile-photo')) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen para fotos de perfil'), false);
    }
  }
  // Para ofertas, permitir imágenes y videos específicos
  else if (req.route.path.includes('offer')) {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    
    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF, WebP) y videos (MP4, MPEG, MOV, AVI, WebM) para ofertas'), false);
    }
  }
  else {
    cb(null, true);
  }
};

// Configurar multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo para fotos de perfil
  }
});

// Configurar multer específicamente para multimedia de ofertas (videos y fotos)
export const uploadMultimediaLarge = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB máximo para multimedia de ofertas
  }
});

// Middleware para un solo archivo (foto de perfil - 10MB)
export const uploadSingle = upload.single('file');

// Middleware para múltiples archivos (foto de perfil - 10MB)
export const uploadMultiple = upload.array('files', 10); // Máximo 10 archivos

// Middleware para foto principal de oferta (tamaño mediano - 25MB)
export const uploadOfferMainPhoto = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB máximo para foto principal
  }
}).single('file');

// Middleware para multimedia de ofertas (videos y fotos - 100MB)
export const uploadOfferMultimedia = uploadMultimediaLarge.array('files', 10); // Máximo 10 archivos de 100MB cada uno

// Middleware para subir foto de perfil
export const uploadProfilePhoto = async (req: any, res: any, next: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    const file = req.file;
    const photoUrl = await s3Service.uploadProfilePhoto(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    // Agregar la URL al request para que el controlador la use
    req.uploadedPhotoUrl = photoUrl;
    next();
  } catch (error) {
    console.error('Error subiendo foto de perfil:', error);
    res.status(500).json({ error: 'Error subiendo foto de perfil' });
  }
};

// Middleware para subir media de ofertas
export const uploadOfferMedia = async (req: any, res: any, next: any) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron archivos' });
    }

    const files = req.files as any[];
    const mediaUrls: string[] = [];

    for (const file of files) {
      const mediaUrl = await s3Service.uploadOfferMedia(
        file.buffer,
        file.originalname,
        file.mimetype
      );
      mediaUrls.push(mediaUrl);
    }

    // Agregar las URLs al request para que el controlador las use
    req.uploadedMediaUrls = mediaUrls;
    next();
  } catch (error) {
    console.error('Error subiendo media de oferta:', error);
    res.status(500).json({ error: 'Error subiendo archivos' });
  }
};
