const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3002;
const uris = 'mongodb+srv://mondongoekix:mongo102030@mongocluster0.nucsdpn.mongodb.net/';
const client = new MongoClient(uris, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));
client.connect()
  .then(() => {
    console.log('Conexión establecida con MongoDB.');
    
    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con MongoDB:', err);
    process.exit(1);
  });


app.get('/usuario', async (req, res) => {
  try {

    console.log('Conexión establecida con MongoDB.');
    const db = client.db('tiendas');
    const collection = db.collection('usuarios');
    const correo = req.query.correo;

    const result = await collection.find({ correo: correo }).toArray();

    if (result.length > 0) {
      console.log(`Documentos encontrados con el correo ${correo}:`, result);
      res.status(200).json(result);
    } else {
      console.log(`No se encontraron documentos con el correo ${correo}.`);
      res.status(404).send(`No se encontraron documentos con el correo ${correo}.`);
    }
  } catch (err) {
    console.error('Error al buscar documento en MongoDB:', err);
    res.status(500).send('Error al buscar documento en MongoDB.');
  } 
  
});

app.get('/producto', async (req, res) => {
  try {

    console.log('Conexión establecida con MongoDB.');
    const db = client.db('tiendas');
    const collection = db.collection('productos');
    const correo = req.query.correo;

    const result = await collection.find({}).toArray();

    if (result.length > 0) {
      console.log('Productos encontrados');
      res.status(200).json(result);
    } else {
      console.log('Productos no encontrados');
      res.status(404).send('Productos no encontrados');
    }
  } catch (err) {
    console.error('Error al buscar documento en MongoDB:', err);
    res.status(500).send('Error al buscar documento en MongoDB.');
  } 
  
});

app.post('/login', async (req, res) => {
  try {
    console.log('login.');
    const db = client.db('tiendas');
    const collection = db.collection('usuarios');
    const { correo, password } = req.body;

    const user = await collection.findOne({ correo: correo });
    if (correo == user.correo) {
      const isPasswordCorrect = await bcrypt.compare(password, user.passwordencrypt);
      if (isPasswordCorrect) {
        res.status(200).send('Inicio de sesión exitoso.');
        console.log('Inicio de sesión exitoso.');
      } else {
        res.status(401).send('Contraseña incorrecta.');
        console.log('Contraseña incorrecta.');
      }
    } else {
      res.status(401).send('Correo incorrectos.');
    }
  } catch (err) {
    console.error('Error al buscar usuario en MongoDB:', err);
    res.status(500).send('Error al buscar usuario en MongoDB.');
  } 
});

app.post('/insertarusuarios', async (req, res) => {
  try {
    console.log('nuevo usuario');
    const db = client.db('tiendas');
    const collection = db.collection('usuarios');
    const { nombre, correo, password, fechainicio } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const passwordencrypt = bcrypt.hashSync(password, salt);

    await collection.insertOne({ nombre, correo, passwordencrypt, fechainicio});

    console.log('Datos insertados correctamente en MongoDB.');
    res.status(200).send('Datos insertados correctamente en MongoDB.');
  } catch (err) {
    console.error('Error al insertar datos en MongoDB:', err);
    res.status(500).send('Error al insertar datos en MongoDB.');
  }
});

app.delete('/eliminar/:id', async (req, res) => {
  try {
    await client.connect();
    console.log('Conexión establecida con MongoDB.');

    const db = client.db('tiendas');
    const collection = db.collection('productos');
    const id = req.params.id;

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      console.log(`Documento con ID ${id} eliminado correctamente.`);
      res.status(200).send(`Documento con ID ${id} eliminado correctamente.`);
    } else {
      console.log(`No se encontró documento con ID ${id}.`);
      res.status(404).send(`No se encontró documento con ID ${id}.`);
    }
  } catch (err) {
    console.error('Error al eliminar documento en MongoDB:', err);
    res.status(500).send('Error al eliminar documento en MongoDB.');
  } 
});
