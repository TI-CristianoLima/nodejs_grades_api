import express from 'express';
import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let gradePost = req.body;
    const gradesRead = JSON.parse(await readFile(gradesJson));
    console.log(gradesRead);
    gradePost = {
      id: gradesRead.nextId++,
      ...gradePost,
      timestamp: new Date().toLocaleDateString('pt-br', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    };
    gradesRead.grades.push(gradePost);
    await writeFile(gradesJson, JSON.stringify(gradesRead, null, 2));
    res.send(gradePost);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const gradesRead = JSON.parse(await readFile(gradesJson));
    gradesRead.grades = gradesRead.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id)
    );
    await writeFile(gradesJson, JSON.stringify(gradesRead, null, 2));
    res.send('Registro removido com sucesso.');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let gradesIdGet = JSON.parse(await readFile(gradesJson));
    gradesIdGet.grades = gradesIdGet.grades.filter(
      (gradeGetId) => gradeGetId.id === parseInt(req.params.id)
    );
    res.send(gradesIdGet.grades);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/notaTotal', async (req, res) => {
  try {
    const gradesIn = req.body;
    const gradesRead = JSON.parse(await readFile(gradesJson));
    const gradeGet = gradesRead.grades.filter(
      (grade) =>
        grade.student === gradesIn.student && grade.subject === gradesIn.subject
    );
    let gradeTotal = gradeGet.reduce((acc, curent) => {
      return acc + curent.value;
    }, 0);
    const gradeOut = { ...gradeGet, nota_total: gradeTotal };
    res.send(gradeOut);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/top3', async (req, res) => {
  try {
    const gradesIn = req.body;
    const gradesRead = JSON.parse(await readFile(gradesJson));
    const gradeGet = gradesRead.grades.filter(
      (grade) =>
        grade.type === gradesIn.type && grade.subject === gradesIn.subject
    );
    let gradePush = gradeGet.sort((a, b) => {
      return b.value - a.value;
    });
    let gradeTop3 = [];
    for (let i = 0; i < 3; i++){
      let temp = gradePush[i];
      gradeTop3.push({...temp});
    }
    res.send(gradeTop3);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/media', async (req, res) => {
  try {
    const gradesIn = req.body;
    const gradesRead = JSON.parse(await readFile(gradesJson));
    const gradeGet = gradesRead.grades.filter(
      (grade) =>
      grade.type === gradesIn.type && grade.subject === gradesIn.subject
    );
    let gradeMedia = gradeGet.reduce((acc, curent) => {
      return acc + curent.value;
    }, 0);

    let index = 0;
    for (let i of gradeGet) {
      index++;
    }
    gradeMedia = gradeMedia / index;
    const gradeOut = { ...gradeGet, media: gradeMedia };
    res.send(gradeOut);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let gradePost = req.body;

    if (!gradePost.id) {
      throw new Error('ID é obrigatório!');
    } else if (gradePost.id <= 0) {
      throw new Error('ID não pode ser menor que 1!');
    }

    const gradesRead = JSON.parse(await readFile(gradesJson));
    const index = gradesRead.grades.findIndex((a) => a.id === gradePost.id);
    gradePost = {
      id: gradePost.id,
      student: gradePost.student,
      subject: gradePost.subject,
      type: gradePost.type,
      value: gradePost.value,
      timestamp: new Date().toLocaleDateString('pt-br', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    };
    gradesRead.grades[index] = gradePost;
    console.log(gradePost);
    await writeFile(gradesJson, JSON.stringify(gradesRead, null, 2));
    res.send(gradePost);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
