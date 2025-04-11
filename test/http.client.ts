import express, { json } from 'express';

const port = 3030;

const app = express();

app.use(json({ limit: '50mb' }));

app.post('/', (req, res) => {
  console.log(req.body);
  res.status(200).json(`Success!`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
