document.getElementById('saveKey').addEventListener('click', () => {
  const key = document.getElementById('apiKey').value.trim();
  localStorage.setItem('geminiApiKey', key);
  alert('API key saved!');
});

document.getElementById('generate').addEventListener('click', async () => {
  const post = document.getElementById('postText').value.trim();
  const tone = document.getElementById('tone').value;
  const key = localStorage.getItem('geminiApiKey');

  if (!key || !post) return alert('Missing API key or post text.');

  const resultArea = document.getElementById('result');
  resultArea.textContent = 'Generating...';

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + key, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write a ${tone} comment for this post:\n${post}` }] }]
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    resultArea.textContent = reply;
  } catch (err) {
    resultArea.textContent = 'Error: ' + err.message;
  }
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const text = document.getElementById('result').textContent;
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
});
