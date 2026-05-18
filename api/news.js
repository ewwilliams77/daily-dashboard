export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { feed } = req.query;
  if (!feed) return res.status(400).json({ error: 'no feed' });
  try {
    const r = await fetch(feed);
    const xml = await r.text();
    const items = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
    for (const match of itemMatches) {
      const block = match[1];
      const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || block.match(/<title>(.*?)<\/title>/))?.[1]?.trim();
      const link = (block.match(/<link>(.*?)<\/link>/) || block.match(/<guid>(.*?)<\/guid>/))?.[1]?.trim();
      if (title && link) { items.push({ title, link }); break; }
    }
    res.json({ items });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}