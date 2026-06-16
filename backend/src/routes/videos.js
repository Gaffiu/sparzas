const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Listar todos os vídeos (com suporte a busca simples)
router.get('/', async (req, res) => {
  const { search } = req.query;
  let query = supabase
    .from('videos')
    .select('*, profiles(username, avatar_url)');

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Obter um vídeo específico com dados extras (likes, comentários, inscrição)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('videos')
    .select('*, profiles(username, avatar_url)')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'Vídeo não encontrado' });
  res.json(data);
});

// Criar novo vídeo
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

// Comentários de um vídeo
router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(username, avatar_url)')
    .eq('video_id', id)
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error });
  res.json(data);
});

router.post('/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { user_id, content } = req.body;
  if (!user_id || !content) return res.status(400).json({ error: 'Dados faltando' });
  const { data, error } = await supabase
    .from('comments')
    .insert([{ video_id: id, user_id, content }])
    .select();
  if (error) return res.status(400).json({ error });
  res.status(201).json(data[0]);
});

// Like (toggle)
router.post('/:id/like', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id obrigatório' });
  // Verifica se já curtiu
  const { data: existing } = await supabase
    .from('likes')
    .select('*')
    .eq('video_id', id)
    .eq('user_id', user_id)
    .single();
  if (existing) {
    // Remove curtida
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existing.id);
    if (error) return res.status(400).json({ error });
    return res.json({ liked: false });
  } else {
    // Adiciona curtida
    const { error } = await supabase
      .from('likes')
      .insert([{ video_id: id, user_id }]);
    if (error) return res.status(400).json({ error });
    return res.json({ liked: true });
  }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const { data, error } = await supabase
    .from('videos')
    .select('*, profiles(username, avatar_url)')
    .ilike('title', `%${q}%`);
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Contagem de likes de um vídeo
router.get('/:id/likes/count', async (req, res) => {
  const { id } = req.params;
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('video_id', id);
  if (error) return res.status(500).json({ error });
  res.json({ count });
});

module.exports = router;
