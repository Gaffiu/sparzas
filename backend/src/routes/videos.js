const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Listar todos os vídeos
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('videos')
    .select('*, profiles(username)');
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Criar novo vídeo (metadados)
router.post('/', async (req, res) => {
  const { user_id, title, description, video_url, thumbnail_url } = req.body;
  if (!user_id || !title || !video_url) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }
  const { data, error } = await supabase
    .from('videos')
    .insert([{ user_id, title, description, video_url, thumbnail_url }])
    .select();
  if (error) return res.status(400).json({ error });
  res.status(201).json(data[0]);
});

module.exports = router;
