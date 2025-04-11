import { Router } from 'express';
import { NormalizedData } from '@/src/types/data.type';
import { DataController } from '@/src/controllers/data.controller';

const router = Router();

router.post('/data', async (req, res) => {
  const schema = (req as any).schema;
  const data = req.body.response as NormalizedData;
  data.schema = schema;

  try {
    const controller = new DataController(schema);
    await controller.handleData(data);
    res.json({ status: 'success' });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    res.status(500).json({ error: error.message });
  }
});

router.put('/data/:id', async (req, res) => {
  const schema = (req as any).schema;
  const { id } = req.params;
  const data = req.body.response as NormalizedData;

  try {
    const controller = new DataController(schema);
    await controller.handleData(data);
    res.json({ status: 'success' });
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    res.status(500).json({ error: error.message });
  }
});

router.get('/data/:id', async (req, res) => {
  const schema = (req as any).schema;
  const { id } = req.params;

  try {
    const controller = new DataController(schema);
    const item = await controller.getData(Number(id));
    res.json(item || { error: 'Not found' });
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    res.status(500).json({ error: error.message });
  }
});

export default router;
