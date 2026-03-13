const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

let bancos = [];
const FILE_PATH = './banco.json';

const guardarDatos = () => {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(bancos, null, 2));
    } catch (err) {
        console.error("Error guardando el archivo:", err);
    }
};

try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    bancos = JSON.parse(data);
} catch (err) {
    console.error("Error leyendo el archivo banco.json:", err);
    bancos = [];
}

app.get('/', (req, res) => {
   res.send('¡Bienvenido al API de Bancos!');
});

app.get('/banco', (req, res) => {
    res.json(bancos);
});


app.get('/banco/:id', (req, res) => {
   const id = Number(req.params.id);
   const banco = bancos.find(b => b.id === id);
   if (!banco) {
       return res.send('Banco no encontrado');
    }
    res.json(banco);
});






app.post('/banco', (req, res) => {
    const nuevoBanco = {
        id: bancos.length > 0 ? bancos[bancos.length - 1].id + 1 : 1,
        nombre: req.body.nombre,
        personas: []
    };
    bancos.push(nuevoBanco);
    guardarDatos(); 
    res.status(201).json(nuevoBanco);
});


app.put('/banco/:id', (req, res) => {
    const banco = bancos.find(b => b.id === parseInt(req.params.id));
    if (!banco) return res.status(404).send('Banco no encontrado');
    
    banco.nombre = req.body.nombre || banco.nombre;
    guardarDatos();
    res.json(banco);
});


app.delete('/banco/:id', (req, res) => {
    const index = bancos.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Banco no encontrado');
    
    const eliminado = bancos.splice(index, 1);
    guardarDatos();
    res.json(eliminado[0]);
});



app.get('/banco/:id/personas', (req, res) => {
    const banco = bancos.find(b => b.id === parseInt(req.params.id));
    if (!banco) return res.status(404).send('Banco no encontrado');
    res.json(banco.personas);
});

app.post('/banco/:id/personas', (req, res) => {
    const banco = bancos.find(b => b.id === parseInt(req.params.id));
    if (!banco) return res.status(404).send('Banco no encontrado');

    const nuevaPersona = {
        id: banco.personas.length > 0 ? banco.personas[banco.personas.length - 1].id + 1 : 1,
        nombre: req.body.nombre
    };
    banco.personas.push(nuevaPersona);
    guardarDatos();
    res.status(201).json(nuevaPersona);
});


app.put('/banco/:id/personas/:personaId', (req, res) => {
    const banco = bancos.find(b => b.id === parseInt(req.params.id));
    if (!banco) return res.status(404).send('Banco no encontrado');

    const persona = banco.personas.find(p => p.id === parseInt(req.params.personaId));
    if (!persona) return res.status(404).send('Persona no encontrada');

    persona.nombre = req.body.nombre || persona.nombre;
    guardarDatos();
    res.json(persona);
});

app.delete('/banco/:id/personas/:personaId', (req, res) => {
    const banco = bancos.find(b => b.id === parseInt(req.params.id));
    if (!banco) return res.status(404).send('Banco no encontrado');

    const index = banco.personas.findIndex(p => p.id === parseInt(req.params.personaId));
    if (index === -1) return res.status(404).send('Persona no encontrada');

    const personaEliminada = banco.personas.splice(index, 1);
    guardarDatos();
    res.json(personaEliminada[0]);
});




app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});