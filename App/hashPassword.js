const bcrypt = require('bcryptjs'); // Librería para cifrar contraseñas
const { MongoClient } = require('mongodb'); // Librería para conectarse a MongoDB

// URL de conexión a MongoDB, aquí estamos usando localhost y el puerto por defecto 27017
const uris = {
  empleado: 'mongodb+srv://mondongoekix:mongo102030@mongocluster0.nucsdpn.mongodb.net/'
} ;
const client = new MongoClient(empleado); // Crear un cliente de MongoDB

async function run() {
  try {
    // Conectar al servidor de MongoDB
    await client.connect();
    console.log('Conexión establecida con MongoDB.'); // Confirmación de conexión exitosa

    // Seleccionar la base de datos y la colección
    const db = client.db('usuarios'); // Nombre de la base de datos
    const collection = db.collection('db'); // Nombre de la colección

    // Datos a cifrar
    const nombre = "josue";
    const apellido = "ciau";
    const password = "x";

    // Generar un salt y cifrar la contraseña
    const salt = bcrypt.genSaltSync(10); // Generar un salt con factor de costo 10
    const passwordEncryptada = bcrypt.hashSync(password, salt); // Cifrar la contraseña con el salt

    // Insertar el documento con los datos cifrados en la colección
    await collection.insertOne({ nombre, apellido, password: passwordEncryptada });

    console.log('Datos insertados correctamente en MongoDB.'); // Confirmación de inserción exitosa
  } finally {
    // Cerrar la conexión con MongoDB
    await client.close();
    console.log('Conexión cerrada con MongoDB.'); // Confirmación de cierre de conexión
  }
}

// Ejecutar la función y manejar posibles errores
run().catch(console.error);
