// test-s3.js - Script temporal para probar S3
const AWS = require('aws-sdk');

// Configurar AWS (reemplaza con tus credenciales)
AWS.config.update({
  accessKeyId: 'TU_ACCESS_KEY_AQUI',
  secretAccessKey: 'TU_SECRET_KEY_AQUI',
  region: 'us-east-1' // o la región que elegiste
});

const s3 = new AWS.S3();
const bucketName = 'TU_BUCKET_NAME_AQUI'; // Reemplaza con tu bucket

async function testS3() {
  try {
    console.log('🧪 Probando conexión a S3...');
    
    // 1. Listar buckets
    console.log('\n📂 Listando buckets...');
    const buckets = await s3.listBuckets().promise();
    console.log('Buckets encontrados:', buckets.Buckets.map(b => b.Name));
    
    // 2. Verificar si nuestro bucket existe
    const ourBucket = buckets.Buckets.find(b => b.Name === bucketName);
    if (!ourBucket) {
      console.log('❌ Bucket no encontrado:', bucketName);
      return;
    }
    console.log('✅ Bucket encontrado:', bucketName);
    
    // 3. Crear archivo de prueba
    console.log('\n📤 Subiendo archivo de prueba...');
    const testContent = 'Hola desde Node.js! Timestamp: ' + new Date().toISOString();
    
    const uploadParams = {
      Bucket: bucketName,
      Key: 'test-file.txt',
      Body: testContent,
      ContentType: 'text/plain',
      ACL: 'public-read'
    };
    
    const uploadResult = await s3.upload(uploadParams).promise();
    console.log('✅ Archivo subido exitosamente!');
    console.log('📍 URL:', uploadResult.Location);
    
    // 4. Listar archivos del bucket
    console.log('\n📋 Listando archivos del bucket...');
    const listParams = {
      Bucket: bucketName
    };
    
    const listResult = await s3.listObjectsV2(listParams).promise();
    console.log('Archivos encontrados:');
    listResult.Contents?.forEach(file => {
      console.log(`  - ${file.Key} (${file.Size} bytes)`);
    });
    
    // 5. Probar descarga
    console.log('\n📥 Probando descarga...');
    const downloadParams = {
      Bucket: bucketName,
      Key: 'test-file.txt'
    };
    
    const downloadResult = await s3.getObject(downloadParams).promise();
    console.log('✅ Contenido descargado:', downloadResult.Body.toString());
    
    console.log('\n🎉 ¡Todas las pruebas exitosas!');
    console.log('🔗 URL pública del archivo:', uploadResult.Location);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'InvalidAccessKeyId') {
      console.log('💡 Verifica tu Access Key ID');
    } else if (error.code === 'SignatureDoesNotMatch') {
      console.log('💡 Verifica tu Secret Access Key');
    } else if (error.code === 'NoSuchBucket') {
      console.log('💡 Verifica el nombre del bucket');
    }
  }
}

// Ejecutar prueba
testS3();
