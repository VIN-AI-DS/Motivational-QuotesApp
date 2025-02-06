
  // Mood and quotes data for fallback (in case AI model is not available)
const quotes = {
    happy: [
      "Happiness is not by chance, but by choice.",
      "Choose joy every day!",
      "Happiness depends upon ourselves."
    ],
    sad: [
      "Tough times never last, but tough people do.",
      "This too shall pass.",
      "The darkest hour is just before the dawn."
    ],
    energetic: [
      "Energy and persistence conquer all things.",
      "The only way to do great work is to love what you do.",
      "Success is the sum of small efforts, repeated day in and day out."
    ],
    calm: [
      "Calmness is the cradle of power.",
      "In the middle of chaos, keep calm and carry on.",
      "Stay calm and trust the process."
    ],
    focused: [
      "Success is the result of preparation, hard work, and learning from failure.",
      "Focus on the present and the future will follow.",
      "Concentration is the secret of strength."
    ]
  };
  

// Fetch random background image from Pexels API based on mood
async function fetchBackgroundImage(mood) {
    const apiKeyPexels = 'KRQm4KQNGxzPbXZYlmjCCMW4wkm4jNI7fshBByCFbtJIYvy6ChdumlPd'; // Replace with your Pexels API Key
    const query = `${mood} nature`;  // Modify query based on mood
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=10&page=${Math.floor(Math.random() * 5) + 1}`;
  
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': apiKeyPexels
            }
        });

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.photos.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.photos.length);
            const imageUrl = data.photos[randomIndex].src.landscape;
            document.getElementById('background').style.backgroundImage = `url('${imageUrl}')`;
        } else {
            console.log('No images found for this mood.');
        }
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

 // Function to fetch AI-generated quote from Cohere API (Updated)
  async function fetchAiQuote(mood) {
    const prompt = `Generate a motivational quote based on the mood: ${mood}`;
  
    try {
      const apiKeyCohere = 'YWcMcV1GQT1rxjZihXDSZ9oRo8vVLILcO9026Xuu';  // Replace with your Cohere API Key
      
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeyCohere}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 100,
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Failed to fetch quote');
      }
  
      const data = await response.json();
      if (data && data.generations && data.generations.length > 0) {
        const quote = data.generations[0].text.trim();
        return quote;
      } else {
        throw new Error('No generated quote found in response');
      }
  
    } catch (error) {
      console.error('Error generating quote:', error);
      return 'Error generating quote. Please try again later.';
    }
  }
  
  // Function to get a quote (either from AI or fallback)
  async function getQuote(mood) {
    try {
      const aiQuote = await fetchAiQuote(mood);
      document.getElementById("quoteDisplay").innerText = aiQuote;
    } catch (error) {
      console.log('AI quote generation failed, using fallback.');
      const moodQuotes = quotes[mood];
      const randomQuote = moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
      document.getElementById("quoteDisplay").innerText = randomQuote;
    }
  }
  
  // Event listener for mood selection
  document.getElementById('mood').addEventListener('change', (e) => {
    const selectedMood = e.target.value;
    fetchBackgroundImage(selectedMood);  // Fetch new background
    getQuote(selectedMood);  // Show new quote
  });
  
  // Initial background and quote setup
  window.onload = () => {
    const defaultMood = 'happy'; // Default mood
    fetchBackgroundImage(defaultMood);
    getQuote(defaultMood);
  };
  
  // Button to generate a new quote
  document.getElementById('newQuoteBtn').addEventListener('click', () => {
    const selectedMood = document.getElementById('mood').value;
    getQuote(selectedMood);
  });
  