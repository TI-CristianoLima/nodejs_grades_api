import express from 'express';
import { promises as fs } from 'fs';
import appRouter from './router/appControl.js';
global.gradesJson = "grades.json";

const { readFile, writeFile } = fs;
const app = express();
app.use(express.json());
app.use('/grades', appRouter);

app.listen(3000, async () => {
});
