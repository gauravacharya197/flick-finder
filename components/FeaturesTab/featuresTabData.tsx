import { FeatureTab } from "@/types/featureTab";

const featuresTabData: FeatureTab[] = [
  {
    id: "tabOne",
    title: "🎥 Discover Top-Rated Movies",
    desc1: `Dive into a world of cinema with personalized recommendations of critically acclaimed and popular films. 🌟`,
    desc2: `Stay updated with the latest blockbuster releases and timeless classics curated just for you. 🍿`,
    image: "/images/features/movie-discovery-light.png",
    imageDark: "/images/features/movie-discovery-dark.svg",
  },
  {
    id: "tabTwo",
    title: "🍿 Create Your Watchlist",
    desc1: `Keep track of must-watch movies with an easy-to-use watchlist feature. 📝`,
    desc2: `Never miss a film again! Organize your favorites and plan your next movie night effortlessly. 🎬`,
    image: "/images/features/watchlist-light.png",
    imageDark: "/images/features/watchlist-dark.svg",
  },
  {
    id: "tabThree",
    title: "🌟 Get personalized recommendation",
    desc1: `Share your thoughts and ratings with fellow movie lovers. ✍️`,
    desc2: `Help others decide what to watch while building a community of cinephiles. 🎥`,
    image: "/images/features/rating-light.png",
    imageDark: "/images/features/rating-dark.svg",
  },
];

export default featuresTabData;
