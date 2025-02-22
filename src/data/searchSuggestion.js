const movieCategories = {
  mood: ["Happy 😊", "Sad 🥲", "Deep 🤔", "Feel-Good 🌈", "Uplifting ✨", "Dark 🌑", "Exciting 🎢", "Cozy ☕", "Inspiring 💡", "Chill 😌"],
  genre: ["Horror 👻", "Thriller 🔪", "Action 💥", "Comedy 😂", "Drama 🎭", "Romance ❤️", "Adventure 🗺️", "Mystery 🕵️", "Sci-Fi 🚀", "Fantasy 🏰"],
  social: ["Date Night ❤️", "Family Time 👨‍👩‍👧‍👦", "Friends Night 🍿", "Marathon 🎬", "Solo Watch 🎧", "Party Movie 🎉", "Sleepover Fun 🛏️"],
  style: ["Animated 🎨", "Docs 🎥", "Foreign 🌍", "Indie 🎞️", "Classic 🕰️", "Bollywood 🎶", "Musicals 🎤", "Retro 📽️", "Silent Films 🎭"],
  special: ["Oscar Wins 🏆", "Top Rated ⭐", "Underrated 💎", "Cult 📼", "Box Office Hits 💰", "Critics' Choice 🏅", "Based on True Events 📜"],
  theme: ["Time Travel ⌛", "Superheroes 🦸", "Mind-Blown 🌀", "Epic 🗺️", "Love 💌", "Dystopian 🌆", "War Stories ⚔️", "Crime & Mafia 🔫", "Sports 🏆"],
  setting: ["Fantasy 🏰", "Future 🌌", "Underwater 🌊", "Space 🚀", "Jungle 🌿", "Desert 🏜️", "Mountains ⛰️", "Small Town 🏡", "Big City 🌇"]
};

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getRandomItemFromArray(arr, seed) {
  const index = Math.floor(seededRandom(seed) * arr.length);
  return arr[index];
}

function getRandomSuggestions() {
  const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD
  const seedBase = parseInt(today.replace(/-/g, ""), 10); // Convert date to number for seeding

  const hour = new Date().getHours();
  const timeBasedPreferences = {
    morning: { primaryCategories: ["mood", "style", "special"], moodPreference: ["Happy 😊", "Uplifting ✨", "Feel-Good 🌈", "Inspiring 💡"] },
    afternoon: { primaryCategories: ["social", "style", "special"], moodPreference: ["Family Time 👨‍👩‍👧‍👦", "Docs 🎥", "Animated 🎨", "Cozy ☕"] },
    evening: { primaryCategories: ["social", "genre", "theme"], moodPreference: ["Friends Night 🍿", "Action 💥", "Adventure 🗺️", "Comedy 😂"] },
    lateNight: { primaryCategories: ["genre", "theme", "setting"], moodPreference: ["Thriller 🔪", "Horror 👻", "Mind-Blown 🌀", "Crime & Mafia 🔫"] }
  };

  const timePeriod =
    hour >= 5 && hour < 12 ? "morning" :
    hour >= 12 && hour < 17 ? "afternoon" :
    hour >= 17 && hour < 22 ? "evening" : "lateNight";

  const preferences = timeBasedPreferences[timePeriod];
  const suggestions = new Set();

  let seed = seedBase;

  preferences.primaryCategories.forEach(category => {
    if (movieCategories[category]) {
      const preferredItems = movieCategories[category].filter(item =>
        preferences.moodPreference.includes(item)
      );
      const possibleItems = preferredItems.length ? preferredItems : movieCategories[category];
      suggestions.add(getRandomItemFromArray(possibleItems, seed++));
    }
  });

  const allCategories = Object.keys(movieCategories);
  while (suggestions.size < 8) {
    const randomCategory = getRandomItemFromArray(allCategories, seed++);
    const randomItem = getRandomItemFromArray(movieCategories[randomCategory], seed++);
    suggestions.add(randomItem);
  }

  return Array.from(suggestions);
}

export { getRandomSuggestions };
