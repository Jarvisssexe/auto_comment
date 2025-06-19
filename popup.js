document.getElementById('saveKey').addEventListener('click', () => {
  const key = document.getElementById('apiKey').value.trim();
  localStorage.setItem('geminiApiKey', key);
  alert('✅ API key saved successfully!');
});

document.getElementById('generate').addEventListener('click', async () => {
  const post = document.getElementById('postText').value.trim();
  const tone = document.getElementById('tone').value;
  const key = localStorage.getItem('geminiApiKey');

  const resultArea = document.getElementById('result');
  resultArea.textContent = '';

  if (!key || !post) {
    alert('⚠️ Please enter both your API key and the post text.');
    return;
  }

  resultArea.textContent = 'Generating...';

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a ${tone} comment in response to the following post:\n\n${post}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log('[Gemini API Response]', data);

    if (!data?.candidates?.length) {
      throw new Error(data.error?.message || 'No valid response from Gemini');
    }

    const reply = data.candidates[0].content.parts[0].text;
    resultArea.textContent = reply || '❌ Gemini gave an empty response.';
  } catch (err) {
    console.error('Gemini API Error:', err);
    resultArea.textContent = `❌ Error: ${err.message}`;
  }
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const text = document.getElementById('result').textContent.trim();
  if (!text) return alert('⚠️ Nothing to copy.');
  navigator.clipboard.writeText(text);
  alert('✅ Comment copied to clipboard!');
});
