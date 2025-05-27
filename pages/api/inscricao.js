import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SHEET_ID = '1urPJ5mUwPpLYYfzio0W-On413bOlO3llIYtUx-tJttg';
const RANGE = 'A2:O'; // Começa na linha 2, colunas A a O (15 colunas)

async function appendToSheet(values) {
  const credentialsPath = path.join(process.cwd(), 'api/google-credentials.json');
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
  console.log(credentials);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [values],
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  const { nome, email, instagram, whatsapp, tiktok, cep, rua, numero, complemento, bairro, cidade, estado } = req.body;
  if (!nome || !email || !cep || !rua || !numero || !bairro || !cidade || !estado || (!instagram && !tiktok)) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  try {
    await appendToSheet([
      nome,
      email,
      instagram || '',
      whatsapp || '',
      tiktok || '',
      cep,
      rua,
      numero,
      complemento || '',
      bairro,
      cidade,
      estado,
    ]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar inscrição:', err);
    return res.status(500).json({ error: 'Erro ao salvar inscrição.' });
  }
} 