const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Inscrever / desinscrever canal
router.post('/subscribe', async (req, res) => {
  const { subscriber_id, channel_id } = req.body;
  const { data: existing } = await supabase.from('subscriptions').select('*').eq('subscriber_id', subscriber_id).eq('channel_id', channel_id).single();
  if (existing) {
    await supabase.from('subscriptions').delete().eq('id', existing.id);
    return res.json({ subscribed: false });
  } else {
    await supabase.from('subscriptions').insert([{ subscriber_id, channel_id }]);
    return res.json({ subscribed: true });
  }
});

router.get('/subscribe/status', async (req, res) => {
  const { subscriber_id, channel_id } = req.query;
  const { data } = await supabase.from('subscriptions').select('*').eq('subscriber_id', subscriber_id).eq('channel_id', channel_id).single();
  res.json({ subscribed: !!data });
});

// Perfil do canal
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (!profile) return res.status(404).json({ error: 'Canal não encontrado' });
  const { data: videos } = await supabase.from('videos').select('*').eq('user_id', id).order('created_at', { ascending: false });
  res.json({ profile, videos });
});

// Feed de inscrições
router.get('/:id/feed', async (req, res) => {
  const { id } = req.params;
  const { data: subs } = await supabase.from('subscriptions').select('channel_id').eq('subscriber_id', id);
  const channelIds = subs.map(s => s.channel_id);
  if (channelIds.length === 0) return res.json([]);
  const { data: videos } = await supabase.from('videos').select('*, profiles(username, avatar_url)').in('user_id', channelIds).order('created_at', { ascending: false });
  res.json(videos);
});

// Playlists
router.get('/:id/playlists', async (req, res) => {
  const { data, error } = await supabase.from('playlists').select('*').eq('user_id', req.params.id);
  if (error) return res.status(500).json({ error });
  res.json(data);
});

router.post('/:id/playlists', async (req, res) => {
  const { name, description, is_public } = req.body;
  const { data, error } = await supabase.from('playlists').insert([{ user_id: req.params.id, name, description, is_public }]).select();
  if (error) return res.status(400).json({ error });
  res.status(201).json(data[0]);
});

router.post('/playlists/:playlistId/videos', async (req, res) => {
  const { video_id } = req.body;
  const { data, error } = await supabase.from('playlist_videos').insert([{ playlist_id: req.params.playlistId, video_id }]).select();
  if (error) return res.status(400).json({ error });
  res.status(201).json(data[0]);
});

router.get('/playlists/:playlistId/videos', async (req, res) => {
  const { data, error } = await supabase.from('playlist_videos').select('*, videos(*)').eq('playlist_id', req.params.playlistId).order('position');
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Badges / Conquistas
router.get('/:id/badges', async (req, res) => {
  const { data, error } = await supabase.from('badges').select('*').eq('user_id', req.params.id);
  if (error) return res.status(500).json({ error });
  res.json(data);
});

router.post('/:id/badges', async (req, res) => {
  const { badge_type } = req.body;
  const { data, error } = await supabase.from('badges').insert([{ user_id: req.params.id, badge_type }]).select();
  if (error) return res.status(400).json({ error });
  res.status(201).json(data[0]);
});

// Vídeos curtidos
router.get('/:id/liked', async (req, res) => {
  const { data: likes } = await supabase.from('likes').select('video_id').eq('user_id', req.params.id);
  const videoIds = likes.map(l => l.video_id);
  if (videoIds.length === 0) return res.json([]);
  const { data: videos } = await supabase.from('videos').select('*, profiles(username, avatar_url)').in('id', videoIds);
  res.json(videos);
});

module.exports = router;
