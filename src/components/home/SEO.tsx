import { siteConfig } from '@/config/siteConfig';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlay, FaSearch, FaHeart, FaBolt, FaMagic, FaRocket, FaStar } from 'react-icons/fa';

const FlickdayHomepageContent = () => {
  const [openFAQ, setOpenFAQ] = useState<any>(null);

const faqs = [
  {
    question: "How does Flickday's AI-powered movie recommendation work?",
    answer: "Flickday uses advanced AI algorithms to analyze your mood, emotions, and viewing preferences to suggest the perfect movies and TV series."
  },
  {
    question: "Is Flickday free to use?",
    answer: "Yes, Flickday offers free access to browse our huge collection of movies and TV series. You can search by AI or Movie/Tv and get basic recommendations without any cost."
  },
  {
    question: "How many movies and TV shows are available on Flickday?",
    answer: "Flickday features thousands of carefully  movies and TV series from various genres, decades, and countries."
  },
  {
    question: "Can I search for movies based on specific emotions or moods?",
    answer: "Absolutely! Flickday specializes in emotion-based movie search using AI. You can search for content based on how you're feeling."
  },
  {
    question: "Is Flickday safe to use?",
    answer: "Yes, Flickday is completely safe to use. We do not require personal information for browsing, and all content is sourced from reliable sources. Your privacy and security are important to us."
  },
  {
    question: "Do I need to create an account to use Flickday?",
    answer: "No, you can use Flickday without signing up. Account creation is optional and only required if you want to save your preferences or create a personalized watchlist."
  },
  {
    question: "Is Flickday available on mobile devices?",
    answer: "Yes, Flickday is fully responsive and works seamlessly on smartphones, tablets, and desktops."
  },
  {
    question: "Can I share movie recommendations from Flickday with friends?",
    answer: "Yes! You can easily share any movie or TV show recommendation via social media, messaging apps, or by copying the link directly."
  },
  {
    question: "Does Flickday support different genres and languages?",
    answer: "Yes, Flickday covers a wide range of genres and includes international content across multiple languages for a global audience."
  },
  {
    question: "How often is Flickday's content updated?",
    answer: "Flickday daily updates its contents with fresh recommendations, new releases, and trending titles to keep your watchlist exciting."
  }
];


  const features = [
    { icon: <FaMagic className="w-8 h-8 text-primary-400" />, title: "AI-Powered Search", description: "Advanced algorithms that understand your mood and preferences." },
    { icon: <FaHeart className="w-8 h-8 text-primary-400" />, title: "Emotion-Based Discovery", description: "Find content based on how you feel - laugh, cry, get excited, or feel inspired." },
    { icon: <FaBolt className="w-8 h-8 text-primary-400" />, title: "Instant Recommendations", description: "Get personalized suggestions in seconds, tailored to your current emotional state." },
    { icon: <FaStar className="w-8 h-8 text-primary-400" />, title: "Curated Collection", description: "Thousands of handpicked movies and TV series ensuring quality recommendations." }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Discover Movies That <span className="text-primary-400">Match Your Mood</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
{siteConfig.description}        </p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Flickday?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-800/30">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: <FaSearch />, title: "Tell Us Your Mood", desc: "Share how you're feeling or what experience you're looking for." },
            { icon: <FaRocket />, title: "AI Finds Matches", desc: "Our AI analyzes thousands of movies to find perfect matches for your mood." },
            { icon: <FaPlay />, title: "Discover & Enjoy", desc: "Get instant recommendations and discover your next favorite movie." }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
     <section className="container mx-auto px-4 py-16">
  <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
  <div className="max-w-3xl mx-auto space-y-4">
    {faqs.map((faq, index) => (
      <div key={index} className="bg-gray-800 rounded-lg border border-gray-700">
        <button
          onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
          className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-700 transition-colors"
          aria-expanded={openFAQ === index}
          aria-controls={`faq-answer-${index}`}
        >
          <h3 className="font-semibold pr-4 text-sm sm:text-base">{faq.question}</h3>
          {openFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div
          id={`faq-answer-${index}`}
          className={`px-8 overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-700 text-gray-300 text-lg ${
            openFAQ === index ? 'max-h-96 pt-3 opacity-100' : 'max-h-0 pt-0 opacity-0'
          }`}
        >
          <p>{faq.answer}</p>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* About Section */}
     
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gray-800 rounded-xl p-12 border border-gray-700">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaRocket className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Movie?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Start your personalized movie  journey today. Tell us your mood, and let our AI find the perfect entertainment for you.
          </p>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Get Started with Flickday
          </button>
        </div>
      </section>
    </div>
  );
};

export default FlickdayHomepageContent;