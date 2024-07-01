const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const token = 'f+DbjFvlxGF5QypP2huHk2OOJfr1FyeQ79p1tt3JCiIoH93GbnkwxF6S60yFQoZwYCzUwZVb-Lk9KvOx1EDnvhGs8MXNidUcPQw5+EclkXS1jSzvfVEfoyCiWb7+8ScBa4qjsdt6Loe9UxdLSsMXyKnFROFIMGxC';

exports.webhook = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const webhookEvent = req.body;
  console.log('Webhook received:', webhookEvent);

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
      console.log('Webhook data saved:', envelopeData);
      return res.status(200).send('Webhook received');
    })
    .catch(error => {
      console.error('Error saving webhook data:', error);
      return res.status(500).send(`Error: ${error.message}`);
    });
});
