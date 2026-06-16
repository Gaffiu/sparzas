const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Inscrever / desinscrever canal
router.post('/subscribe', async (req, res) => {
  const { subscriber_id, channel_id } = req.body;
  if (!subscriber_id || !channel_id) return res.status(400).json({ error: 'IDs obrigatórios' });
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('subscriber_id', subscriber_id)
    .eq('channel_id', channel_id)
    .single();
  if (existing) {
    await supabase.from('subscriptions').delete().eq('id', existing.id);
    return res.json({ subscribed: false });
  } else {
    await supabase.from('subscriptions').insert([{ subscriber_id, channel_id }]);
    return res.json({ subscribed: true });
  }
});

// Verificar inscrição
router.get('/subscribe/status', async (req, res) => {
  const { subscriber_id, channel_id } = req.query;
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('subscriber_id', subscriber_id)
    .eq('channel_id', channel_id)
    .single();
  res.json({ subscribed: !!data });
});

// Perfil do canal
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
  if (!profile) return res.status(404).json({ error: 'Canal não encontrado' });
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });
  res.json({ profile, videos });
});

// Feed de inscrições
router.get('/:id/feed', async (req, res) => {
  const { id } = req.params;
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('channel_id')
    .eq('subscriber_id', id);
  const channelIds = subs.map(s => s.channel_id);
  if (channelIds.length === 0) return res.json([]);
  const { data: videos } = await supabase
    .from('videos')
    .select('*, profiles(username, avatar_url)')
    .in('user_id', channelIds)
    .order('created_at', { ascending: false });
  res.json(videos);
});

// Rota para obter vídeos curtidos por um usuário
router.get('/:id/liked', async (req, res) => {
  const { id } = req.params;
  // Busca os likes do usuário
  const { data: likes, error: likesError } = await supabase
    .from('likes')
    .select('video_id')
    .eq('user_id', id);
  if (likesError) return res.status(500).json({ error: likesError });
  const videoIds = likes.map(like => like.video_id);
  if (videoIds.length === 0) return res.json([]);
  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select('*, profiles(username, avatar_url)')
    .in('id', videoIds)
    .order('created_at', { ascending: false });
  if (videosError) return res.status(500).json({ error: videosError });
  res.json(videos);
});

module.exports = router;
