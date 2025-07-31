import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlay, FaSearch, FaHeart, FaBolt, FaMagic, FaRocket, FaStar } from 'react-icons/fa';

const FlickdayHomepageContent = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How does Flickday's AI-powered movie recommendation work?",
      answer: "Flickday uses advanced AI algorithms to analyze your mood, emotions, and viewing preferences to suggest the perfect movies and TV series."
    },
    {
      question: "Is Flickday free to use?",
      answer: "Yes, Flickday offers free access to browse our curated collection of movies and TV series. You can search by mood and get basic recommendations without any cost."
    },
    {
      question: "How many movies and TV shows are available on Flickday?",
      answer: "Flickday features thousands of carefully curated movies and TV series from various genres, decades, and countries."
    },
    {
      question: "Can I search for movies based on specific emotions or moods?",
      answer: "Absolutely! Flickday specializes in emotion-based movie discovery. You can search for content based on how you're feeling."
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
          Find your next perfect movie with Flickday's AI-powered search. Browse thousands of curated movies and TV series with personalized recommendations.
        </p>
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
                className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-semibold pr-4">{faq.question}</h3>
                {openFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-6 border-t border-gray-700">
                  <p className="text-gray-300 pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">About Flickday</h2>
          <p className="text-gray-300 text-lg mb-6">
            Flickday revolutionizes how you Watch movies and TV shows by focusing on your emotions and mood. 
            We understand that choosing what to watch is about finding content that resonates with how you're feeling.
          </p>
          <p className="text-gray-300 text-lg">
            Our AI-powered platform analyzes thousands of curated movies, considering emotional tone, pacing, 
            and themes to provide recommendations that truly match your current state of mind.
          </p>
        </div>
      </section>

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