"use client";
import { getRecommendation } from "@/services/MovieService";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Movie from "../Movie/Movie";
import { Spin } from "antd";
import searchTexts from "../../data/searchTexts"; // Adjust the import path as necessary
import { setMovies, setSearch } from "@/redux/movies/moviesSlice";

const Hero = () => {
  const dispatch = useDispatch();
  const { search, movies } = useSelector((state: any) => state.movie);

  const [loading, setLoading] = useState(false); // Loading state
  const [loadingText, setLoadingText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search) return;

    setLoading(true); // Start loading
    try {
      const response = await getRecommendation(search);
      dispatch(setMovies(response.data)); // Set movies data in Redux
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        const randomText =
          searchTexts[Math.floor(Math.random() * searchTexts.length)];
        setLoadingText(randomText);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <>
      <section className="flex items-center justify-center overflow-hidden pb-5 pt-20 dark:bg-gray-900 dark:text-white md:pt-15 xl:pb-9 xl:pt-46">
        <div className="mx-auto flex max-w-c-1390 justify-center px-4 md:px-8 2xl:px-0">
          <div className="flex flex-col items-center lg:items-start lg:gap-8 xl:gap-32.5">
            <div className="text-center md:text-left">
              <h2 className="mb-5 flex justify-center font-bold text-black dark:text-white xl:text-hero">
                🎥 Describe Your Next Favorite Movie!
              </h2>
              <p className="mb-7 flex justify-center text-sm text-gray-700 dark:text-gray-300">
                🍿 Whether you're into action, romance, or thrillers, we've got
                the perfect movie for your next binge session! 🎉
              </p>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap justify-center">
                  <input
                    value={search}
                    onChange={(e) => dispatch(setSearch(e.target.value))}
                    type="text"
                    placeholder="Describe your movie"
                    className="w-full max-w-md rounded border border-stroke px-6 py-2.5 shadow-solid-2 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-black dark:shadow-none dark:focus:border-primary"
                  />
                  <button
                    disabled={!search || loading} // Disable the button if search is empty or loading
                    aria-label="get started button"
                    className={`flex rounded px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho ${
                      !search || loading ? "bg-gray-400 opacity-50" : "bg-black"
                    }`}
                  >
                    🍿 Let's Go!
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center overflow-hidden dark:bg-gray-900 dark:text-white">
        <div className="mx-auto flex max-w-c-1390 justify-center px-4 md:px-8 2xl:px-0">
          {loading ? (
            <div className=" flex flex-col items-center">
              {/* Increase spinner size */}
              <Spin size="large" className="text-6xl" />

              {/* Increase text size and add spacing */}
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {loadingText}
              </h2>

              <br />
            </div>
          ) : movies.length > 0 ? (
            <Movie movies={movies} />
          ) : (
            <></>
          )}
        </div>
      </section>
    </>
  );
};

export default Hero;
