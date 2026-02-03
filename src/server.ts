import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from './lib/db/mongo-client';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
)
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Create
app.post('/api/forms', async (req, res) => {
  console.log('[POST /api/forms] hit', new Date().toISOString());
  try {
    const db = await connectToDatabase();
    const now = new Date();
    const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
    const formToInsert = {
      ...body,
      createdAt: body.createdAt ?? now,
      updatedAt: now,
    };
    const result = await db.collection('form-config').insertOne(formToInsert);
    return res.status(201).json({ ...formToInsert, id: result.insertedId.toString() });
  } catch (error) {
    console.error('[POST /api/forms] error', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      code: (error as any)?.code,
    });
    return res.status(500).json({ message: 'Failed to create form' });
  }
});

// Read all
app.get('/api/forms', async (_req, res) => {
  try {
    const db = await connectToDatabase();
    const docs = await db.collection('form-config').find().toArray();
    const forms = docs.map(({ _id, ...rest }) => ({ ...rest, id: _id.toString() }));
    return res.json(forms);
  } catch {
    return res.status(500).json({ message: 'Failed to read forms' });
  }
});

// Read one
app.get('/api/forms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const db = await connectToDatabase();
    const doc = await db.collection('form-config').findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    const { _id, ...rest } = doc;
    return res.json({ ...rest, id: _id.toString() });
  } catch {
    return res.status(500).json({ message: 'Failed to read form' });
  }
});

// Update
app.put('/api/forms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const db = await connectToDatabase();
    await db.collection('form-config').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...req.body, updatedAt: new Date() } },
    );

    const doc = await db.collection('form-config').findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    const { _id, ...rest } = doc;
    return res.json({ ...rest, id: _id.toString() });
  } catch {
    return res.status(500).json({ message: 'Failed to update form' });
  }
});

// Delete
app.delete('/api/forms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const db = await connectToDatabase();
    const result = await db.collection('form-config').deleteOne({ _id: new ObjectId(id) });
    return res.json({ deleted: result.deletedCount > 0 });
  } catch {
    return res.status(500).json({ message: 'Failed to delete form' });
  }
});
// Create applicant info
app.post('/api/applicants', async (req, res) => {
  console.log('[POST /api/applicants] hit', new Date().toISOString());
  try {
    const db = await connectToDatabase();
    const now = new Date();
    const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
    const applicantToInsert = {
      ...body,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection('applicant-info').insertOne(applicantToInsert);
    return res.status(201).json({ ...applicantToInsert, id: result.insertedId.toString() });
  } catch (error) {
    console.error('[POST /api/applicants] error', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      code: (error as any)?.code,
    });
    return res.status(500).json({ message: 'Failed to create applicant' });
  }
});

// Read all applicants
app.get('/api/applicants', async (_req, res) => {
  try {
    const db = await connectToDatabase();
    const docs = await db.collection('applicant-info').find().toArray();
    const applicants = docs.map(({ _id, ...rest }) => ({ ...rest, id: _id.toString() }));
    return res.json(applicants);
  } catch {
    return res.status(500).json({ message: 'Failed to read applicants' });
  }
});

// Read one applicant
app.get('/api/applicants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const db = await connectToDatabase();
    const doc = await db.collection('applicant-info').findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    const { _id, ...rest } = doc;
    return res.json({ ...rest, id: _id.toString() });
  } catch {
    return res.status(500).json({ message: 'Failed to read applicant' });
  }
});
/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);