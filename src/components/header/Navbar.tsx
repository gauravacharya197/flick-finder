"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { FaSearch, FaFilter } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import LoginPartial from "../auth/UserMenu";
import menuData from "./menuData";
import { SiteName } from "../common/SiteName";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setQuery } from "@/redux/movies/advanceSearchSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import useClickOutside from "@/hooks/useClickOutside";
import { RobotSearchModal } from "../common/RobotSearchModal";
import Spinner from "../common/Spin";
const MyNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { query } = useSelector((state: RootState) => state.advanceSearch);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [isPending, startTransition] = useTransition();
  const handleSearch = (e:any) => {
    e.preventDefault(); // Prevent the form from reloading the page
    if (query.trim())
      startTransition(() => {
        router.push(`/results?query=${encodeURIComponent(query)}`);
      });
  };
  const handleClose = () => {
    // Only navigate to /results if there is a query
    if (searchQuery) {
      router.push("/results");
    }

    setShowSearch(false);
    dispatch(setQuery(""));
  };
  const initializedFromUrl = useRef(false);
  
  // Effect to sync URL query parameter with Redux state ONLY on initial load
  useEffect(() => {
    // Only update Redux state once when the component mounts
    // and only if there's a query parameter and Redux state is empty or different
    if (!initializedFromUrl.current && searchQuery && searchQuery !== query) {
      dispatch(setQuery(searchQuery));
      initializedFromUrl.current = true;
    }
  }, [searchQuery, dispatch]); 
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  // Using our custom hook
  useClickOutside(
    [menuButtonRef as any, menuContentRef as any],
    () => setMenuOpen(false),
    menuOpen,
  );

  const renderFilterButton = () => {
    return (
      <>
        <Link
          href="/results"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 rounded bg-gray-200 px-4 py-1.5 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          <FaFilter className="h-3.5 w-3.5" />
          Filter
        </Link>
      </>
    );
  };
  const renderCloseMdIcon = () => {
    return (
      <>
        {" "}
        {(query || searchQuery) && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-2 top-1/2 mr-5 -translate-y-1/2 transform"
          >
            <IoMdClose className="mr-1 text-2xl text-primary" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 transform text-primary"
          aria-label="Search"
        >
          {isPending ? <Spinner /> : <FaSearch className="h-5 w-5" />}
        </button>
      </>
    );
  };
  return (
    <header className="sticky top-0 z-50 bg-gray-300 bg-opacity-90 text-white dark:bg-background dark:text-white">
      <div className="  px-4 2xl:px-48">
        <div className="flex h-13 items-center justify-between">
       
          
          <div className="relative flex items-center gap-4">
           
            <button
              ref={menuButtonRef}
              className="rounded-md  p-1 hover:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
              aria-label="Toggle Menu"
            >
              {!menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 5.75h16.5M3.75 12h16.5m-16.5 6.25h16.5"
                  />
                </svg>
              ) : (
                <MdClose className="h-6 w-6" />
              )}
            </button>
            <Link
              href="/"
              className="rounded-md bg-primary px-3 py-1 text-md font-bold text-black dark:bg-primary dark:text-black md:text-xl"
            >
              <SiteName />
            </Link>
            {/* Hamburger Menu Content - Repositioned */}
                        {/* <Menu menuContentRef={menuContentRef} menuData={menuData} setMenuOpen={setMenuOpen} menuOpen={menuOpen} /> */}

            <div
              ref={menuContentRef}
              className={`absolute left-0 top-full z-40 overflow-hidden rounded-md bg-black bg-opacity-95 shadow-lg backdrop-blur-sm transition-all duration-300 dark:bg-background ${
                menuOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
              }`}
            >
              <div className="flex flex-col">
                <ul className="space-y-3">
                  {menuData.map((item, index) => (
                    <li key={item.id} className={index === 0 ? "pt-3" : ""}>
                      <Link
                        href={item.path || "#"}
                        className="block px-4 py-1 text-white hover:bg-gray-800 hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
             
              <RobotSearchModal />
            </div>
          </div>

          {/* Search Bar for Larger Screens */}
          <div className="mr-36 hidden flex-1 items-center justify-center gap-2 md:flex">
            <div className="flex items-center gap-2">
              {renderFilterButton()}
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Movies/TV"
                  value={query}
                  onChange={(e) => dispatch(setQuery(e.target.value))}
                  className="w-96 rounded-md border border-gray-300 bg-white px-4 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                {renderCloseMdIcon()}
              </form>
            </div>
          </div>
          {/* Small Screen Layout: Search Icon, Theme Toggler, and Login Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              className="rounded-md p-2 hover:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle Search"
            >
              <FaSearch className="h-5 w-5 text-primary" />
            </button>
            {/* <ThemeToggler /> */}
            <LoginPartial />
          </div>
          {/* Large Screen Layout */}
          <div className="hidden items-center gap-4 md:flex">
            {/* <ThemeToggler /> */}
            <LoginPartial />
          </div>
        </div>
      </div>
      {/* Search Bar for Small Screens */}
      {showSearch && (
        <div className="bg-white bg-opacity-90 p-2 text-white dark:bg-background dark:text-white md:hidden">
          <div className="container mx-auto flex items-center gap-2">
            {renderFilterButton()}
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
                placeholder="Search Movies/TV"
                className="w-full rounded-md border-gray-300 bg-white px-4 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
              {renderCloseMdIcon()}
            </form>
            <button
              className="rounded-md p-2 text-red-500 hover:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => setShowSearch(false)}
              aria-label="Close Search"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
export default MyNav;
