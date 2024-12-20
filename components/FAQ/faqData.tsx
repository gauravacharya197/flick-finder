import { FAQ } from "@/types/faq";

const faqData: FAQ[] = [
  {
    id: 1,
    quest: "How does the movie recommendation system work?",
    ans: "Our recommendation system uses advanced algorithms with LLM and user preferences to suggest movies based on genres, ratings, and your watch history.",
  },
  {
    id: 2,
    quest: "Is there a way to filter movies by genre or rating?",
    ans: "Yes, you can use our filter options to browse movies by genre, rating, release year, or even specific actors and directors.",
  },
  {
    id: 3,
    quest: "Do I need an account to get recommendations?",
    ans: "Creating an account allows us to personalize your recommendations, but you can also explore general suggestions without signing up.",
  },
  {
    id: 4,
    quest: "Can I create a watchlist of my favorite movies?",
    ans: "Absolutely! You can save movies to your watchlist for easy access and keep track of films you want to watch later.",
  },
  {
    id: 5,
    quest: "Are user reviews and ratings available for movies?",
    ans: "Yes, we display user reviews and ratings for each movie to help you decide what to watch next.",
  },
];

export default faqData;
