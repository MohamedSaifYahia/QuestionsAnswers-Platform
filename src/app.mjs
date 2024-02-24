import './config.mjs'
import mongoose from 'mongoose'
import express from 'express'
import Question from './db.mjs'
import url from 'url'
import path from 'path'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const app = express()

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.json());

const uri = 'mongodb://localhost/qanda'; 
mongoose.connect(uri);

//mongoose.connect(process.env.DSN);
console.log(process.env.DSN);


app.post('/questions/', async (req, res) => {
  try {
    const newQuestion = new Question({
      question: req.body.question,
      answers: [] // Initialize with an empty array of answers
    });
    const savedQuestion = await newQuestion.save();
    res.json(savedQuestion); // Send back the saved question object
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send back an error message
  }
});


app.post('/questions/:id/answers/', async (req, res) => {
  const update = { "$push": { answers: req.body.answer } }
  try {
    const result = await Question.findByIdAndUpdate(req.params.id, update, { "new": true })
    res.json({ success: 'Added an answer' })
  } catch(e) {
    res.status(500).json({ error: 'Failed to add answer' })
  }
})


app.get('/questions/', async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json(questions);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

const port = process.env.PORT || 3000
app.listen(port, () => {console.log(`Server is listening on ${port}`)})
