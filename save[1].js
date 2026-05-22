// Vercel serverless function — proxies GitHub API call from the browser
// Place this file at: api/save.js in your repo root

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, repo, branch, path, content, sha } = req.body;

  if (!token || !repo || !content) {
    return res.status(400).json({ error: 'Missing required fields: token, repo, content' });
  }

  const filePath = path || 'script.js';
  const fileBranch = branch || 'main';
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'portfolio-admin'
  };

  try {
    let fileSha = sha;
    if (!fileSha) {
      const getRes = await fetch(`${apiUrl}?ref=${fileBranch}`, { headers });
      if (getRes.ok) {
        const getJson = await getRes.json();
        fileSha = getJson.sha;
      }
    }

    const body = {
      message: `[admin] update portfolio data ${new Date().toISOString().slice(0, 16)}`,
      content: content,
      branch: fileBranch
    };
    if (fileSha) body.sha = fileSha;

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });

    const putJson = await putRes.json();
    if (!putRes.ok) {
      return res.status(putRes.status).json({ error: putJson.message || 'GitHub API error' });
    }

    return res.status(200).json({ success: true, commit: putJson.commit?.sha });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
