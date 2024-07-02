const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

admin.initializeApp();
const app = express();

const token = 'f+DbjFvlxGF5QypP2huHk2OOJfr1FyeQ79p1tt3JCiIoH93GbnkwxF6S60yFQoZwYCzUwZVb-Lk9KvOx1EDnvhGs8MXNidUcPQw5+EclkXS1jSzvfVEfoyCiWb7+8ScBa4qjsdt6Loe9UxdLSsMXyKnFROFIMGxC';

/**
 * @swagger
 * /webhook:
 *   post:
 *     description: Receives webhook events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenAPI:
 *                 type: string
 *                 description: API token
 *               envelope:
 *                 type: object
 *                 description: Envelope data
 *     responses:
 *       200:
 *         description: Webhook received
 *       403:
 *         description: Forbidden
 *       405:
 *         description: Method Not Allowed
 *       500:
 *         description: Error
 */
app.post('/webhook', (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const webhookEvent = req.body;

  if (!webhookEvent || !webhookEvent.tokenAPI || webhookEvent.tokenAPI !== token) {
    return res.status(403).send('Forbidden');
  }

  const envelopeId = webhookEvent.envelope.id;
  const envelopeData = {
    descricao: webhookEvent.envelope.descricao,
    status: webhookEvent.envelope.status,
    dataHoraCriacao: webhookEvent.envelope.dataHoraCriacao,
    dataHoraConclusao: webhookEvent.envelope.dataHoraConclusao,
    dataHoraAlteracao: webhookEvent.envelope.dataHoraAlteracao,
    dataHoraCancelamento: webhookEvent.envelope.dataHoraCancelamento,
    hashSHA256: webhookEvent.envelope.hashSHA256,
    hashSHA512: webhookEvent.envelope.hashSHA512,
    listaSignatarios: webhookEvent.envelope.listaSignatarios,
  };

  admin.firestore().collection('webhooks').doc(envelopeId.toString()).set(envelopeData, { merge: true })
    .then(() => {
      return res.status(200).send('Webhook received');
    })
    .catch(error => {
      console.error('Error saving webhook data:', error);
      return res.status(500).send(`Error: ${error.message}`);
    });
});


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my Firebase functions',
    },
    servers: [
      {
        url: 'https://us-central1-avmbchallenge.cloudfunctions.net',
      },
    ],
  },
  apis: ['./index.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.send('API is running');
});

exports.api = functions.https.onRequest(app);
