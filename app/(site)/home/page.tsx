'use client'
import MovieCarousel from '@/components/Common/MovieCarousel';
import FeaturedMovie from '@/components/Movie/FeaturedMovie';
import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPlus } from 'react-icons/fa';


const MovieHomepage = () => {

  const featuredMovie = {
    displayTitle: "WOLF MAN",
    mediaType:"movie",
    voteAverage: "8.2",
    displayReleaseDate: "2025",
    duration: "103 min",
    id:'',
    genres: ["Horror", "Thriller"],
    overView: "With his marriage fraying, Blake persuades his wife Charlotte to take a break from the city and visit his remote childhood home in rural Oregon. As they arrive at the farmhouse in the dead of night, they're attacked by an unseen animal and barricade themselves inside the home as the creature prowls the perimeter. But as the night stretches on, Blake begins to behave strangely, transforming into something unrecognizable.",
    backdropPath: "https://image.tmdb.org/t/p/original/vLN520GJvHJJQOFqqV7RjZNBwi7.jpg"
  };

  const trendingMovies = [
    {
        "adult": false,
        "backdropPath": "/xMNH87maNLt9n2bMDYeI6db5VFm.jpg",
        "genreIds": [
            10759,
            10765,
            16
        ],
        "id": 127532,
        "originalLanguage": "ja",
        "originalTitle": null,
        "overview": "They say whatever doesn’t kill you makes you stronger, but that’s not the case for the world’s weakest hunter Sung Jinwoo. After being brutally slaughtered by monsters in a high-ranking dungeon, Jinwoo came back with the System, a program only he could see, that’s leveling him up in every way. Now, he’s inspired to discover the secrets behind his powers and the dungeon that spawned them.",
        "popularity": 1138.308,
        "posterPath": "/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Solo Leveling",
        "video": false,
        "voteAverage": 8.5,
        "mediaType": "tv",
        "voteCount": 637,
        "firstAirDate": "2024-01-07",
        "displayTitle": "Solo Leveling",
        "displayReleaseDate": "2024-01-07"
    },
    {
        "adult": false,
        "backdropPath": "/gklrevVndG98GHGDwfm8y8kxESo.jpg",
        "genreIds": [
            18,
            9648,
            10759
        ],
        "id": 129552,
        "originalLanguage": "en",
        "originalTitle": null,
        "overview": "Brought together by a midnight phone call, an FBI agent and a cybersecurity expert must unravel an ever-growing web of political conspiracies.",
        "popularity": 922.929,
        "posterPath": "/4c5yUNcaff4W4aPrkXE6zr7papX.jpg",
        "releaseDate": null,
        "title": null,
        "name": "The Night Agent",
        "video": false,
        "voteAverage": 7.828,
        "mediaType": "tv",
        "voteCount": 785,
        "firstAirDate": "2023-03-23",
        "displayTitle": "The Night Agent",
        "displayReleaseDate": "2023-03-23"
    },
    {
        "adult": false,
        "backdropPath": "/2meX1nMdScFOoV4370rqHWKmXhY.jpg",
        "genreIds": [
            10759,
            9648,
            18
        ],
        "id": 93405,
        "originalLanguage": "ko",
        "originalTitle": null,
        "overview": "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
        "popularity": 3133,
        "posterPath": "/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Squid Game",
        "video": false,
        "voteAverage": 7.857,
        "mediaType": "tv",
        "voteCount": 15218,
        "firstAirDate": "2021-09-17",
        "displayTitle": "Squid Game",
        "displayReleaseDate": "2021-09-17"
    },
    {
        "adult": false,
        "backdropPath": "/8MtMFngDWvIdRo34rz3ao0BGBAe.jpg",
        "genreIds": [
            18,
            9648,
            10765
        ],
        "id": 95396,
        "originalLanguage": "en",
        "originalTitle": null,
        "overview": "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.",
        "popularity": 476.654,
        "posterPath": "/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Severance",
        "video": false,
        "voteAverage": 8.4,
        "mediaType": "tv",
        "voteCount": 1458,
        "firstAirDate": "2022-02-17",
        "displayTitle": "Severance",
        "displayReleaseDate": "2022-02-17"
    },
    {
        "adult": false,
        "backdropPath": "/9iwmsNVjbex9qa7FhqDUh92EjdQ.jpg",
        "genreIds": [
            10759,
            18,
            10765
        ],
        "id": 225941,
        "originalLanguage": "zh",
        "originalTitle": null,
        "overview": "When a student unearths the truth behind his grandfather’s life, he must unveil his secret superpowers to an underworld eager for his emergence.",
        "popularity": 299.72,
        "posterPath": "/aZT7iZwR4LE2kk7sXWslgpOP7oT.jpg",
        "releaseDate": null,
        "title": null,
        "name": "I Am Nobody",
        "video": false,
        "voteAverage": 8.5,
        "mediaType": "tv",
        "voteCount": 28,
        "firstAirDate": "2023-08-04",
        "displayTitle": "I Am Nobody",
        "displayReleaseDate": "2023-08-04"
    },
    {
        "adult": false,
        "backdropPath": "/58XBnfKhP569SuZuXks3fNYpLBm.jpg",
        "genreIds": [
            18
        ],
        "id": 217553,
        "originalLanguage": "ko",
        "originalTitle": null,
        "overview": "To create a top-tier trauma center, a war-seasoned doctor arrives — bringing his blunt but skilled ways to transform his team into life-saving mavericks.",
        "popularity": 153.364,
        "posterPath": "/y8h2RwUZM5chv9tuaKVwSPoo3KE.jpg",
        "releaseDate": null,
        "title": null,
        "name": "The Trauma Code: Heroes on Call",
        "video": false,
        "voteAverage": 7.8,
        "mediaType": "tv",
        "voteCount": 10,
        "firstAirDate": "2025-01-24",
        "displayTitle": "The Trauma Code: Heroes on Call",
        "displayReleaseDate": "2025-01-24"
    },
    {
        "adult": false,
        "backdropPath": "/4Mt7WHox67uJ1yErwTBFcV8KWgG.jpg",
        "genreIds": [
            10759,
            35,
            16
        ],
        "id": 37854,
        "originalLanguage": "ja",
        "originalTitle": null,
        "overview": "Years ago, the fearsome Pirate King, Gol D. Roger was executed leaving a huge pile of treasure and the famous \"One Piece\" behind. Whoever claims the \"One Piece\" will be named the new King of the Pirates.\n\nMonkey D. Luffy, a boy who consumed a \"Devil Fruit,\" decides to follow in the footsteps of his idol, the pirate Shanks, and find the One Piece. It helps, of course, that his body has the properties of rubber and that he's surrounded by a bevy of skilled fighters and thieves to help him along the way.\n\nLuffy will do anything to get the One Piece and become King of the Pirates!",
        "popularity": 173.288,
        "posterPath": "/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg",
        "releaseDate": null,
        "title": null,
        "name": "One Piece",
        "video": false,
        "voteAverage": 8.7,
        "mediaType": "tv",
        "voteCount": 4767,
        "firstAirDate": "1999-10-20",
        "displayTitle": "One Piece",
        "displayReleaseDate": "1999-10-20"
    },
    {
        "adult": false,
        "backdropPath": "/shXdGFZIEaSmiOkVW2BeEaPihuA.jpg",
        "genreIds": [
            16,
            35,
            10765
        ],
        "id": 223564,
        "originalLanguage": "ja",
        "originalTitle": null,
        "overview": "Rentaro Aijo was rejected 100 times in middle school. He visits a shrine and prays for better luck in high school. The God of Love appears and promises that he'll soon meet 100 people he's destined to date. But there's a catch—once destiny introduces someone to him, the two must happily love each other. If they don't, they'll die. What will befall Rentaro and his 100 girlfriends in high school?",
        "popularity": 246.534,
        "posterPath": "/ms7uowQ6gBjfaB2zzwugfr30IKZ.jpg",
        "releaseDate": null,
        "title": null,
        "name": "The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You",
        "video": false,
        "voteAverage": 8,
        "mediaType": "tv",
        "voteCount": 126,
        "firstAirDate": "2023-10-08",
        "displayTitle": "The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You",
        "displayReleaseDate": "2023-10-08"
    },
    {
        "adult": false,
        "backdropPath": "/blSthAPRbEOJBowdxppeQqNPRh9.jpg",
        "genreIds": [
            16,
            35,
            10759
        ],
        "id": 207332,
        "originalLanguage": "ja",
        "originalTitle": null,
        "overview": "Once the greatest hitman of all, Taro Sakamoto retired in the name of love. But when his past catches up, he must fight to protect his beloved family.",
        "popularity": 780.111,
        "posterPath": "/wRpCqsJFyKNuh5FMegNPrhzp2NF.jpg",
        "releaseDate": null,
        "title": null,
        "name": "SAKAMOTO DAYS",
        "video": false,
        "voteAverage": 8.2,
        "mediaType": "tv",
        "voteCount": 49,
        "firstAirDate": "2025-01-11",
        "displayTitle": "SAKAMOTO DAYS",
        "displayReleaseDate": "2025-01-11"
    },
    {
        "adult": false,
        "backdropPath": "/z1buWt3MeqamyzVbKggLtlG1rZV.jpg",
        "genreIds": [
            9648,
            80
        ],
        "id": 259188,
        "originalLanguage": "zh",
        "originalTitle": null,
        "overview": "That winter, a horrific crime left veteran police captain Peng Zhaolin deeply shaken. A decade earlier, he had unknowingly crossed paths with the suspect, Deng Ligang, missing a crucial chance to stop the crime spree. Despite a relentless pursuit, the criminals vanished without a trace. Years later, a new clue emerges, prompting Peng Zhaolin and young officer Zhen Zhen to reopen the case and seek justice for the victims.",
        "popularity": 68.641,
        "posterPath": "/bEcFBnDwUXXDizdaR5EiC0qRhS3.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Drifting Away",
        "video": false,
        "voteAverage": 6.6,
        "mediaType": "tv",
        "voteCount": 5,
        "firstAirDate": "2025-01-17",
        "displayTitle": "Drifting Away",
        "displayReleaseDate": "2025-01-17"
    },
    {
        "adult": false,
        "backdropPath": "/n5FPNMJ0eRoiQrKGfUQQRAZeaxg.jpg",
        "genreIds": [
            10765,
            18
        ],
        "id": 125988,
        "originalLanguage": "en",
        "originalTitle": null,
        "overview": "In a ruined and toxic future, thousands live in a giant silo deep underground. After its sheriff breaks a cardinal rule and residents die mysteriously, engineer Juliette starts to uncover shocking secrets and the truth about the silo.",
        "popularity": 776.084,
        "posterPath": "/tlliQuCupf8fpTH7RAor3aKMGy.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Silo",
        "video": false,
        "voteAverage": 8.163,
        "mediaType": "tv",
        "voteCount": 1317,
        "firstAirDate": "2023-05-04",
        "displayTitle": "Silo",
        "displayReleaseDate": "2023-05-04"
    },
    {
        "adult": false,
        "backdropPath": "/zZqpAXxVSBtxV9qPBcscfXBcL2w.jpg",
        "genreIds": [
            10765,
            18,
            10759
        ],
        "id": 1399,
        "originalLanguage": "en",
        "originalTitle": null,
        "overview": "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and icy horrors beyond.",
        "popularity": 827.279,
        "posterPath": "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Game of Thrones",
        "video": false,
        "voteAverage": 8.456,
        "mediaType": "tv",
        "voteCount": 24485,
        "firstAirDate": "2011-04-17",
        "displayTitle": "Game of Thrones",
        "displayReleaseDate": "2011-04-17"
    },
    {
        "adult": false,
        "backdropPath": "/pg4xOroBDlxIhRK1m5xFyLgXrVD.jpg",
        "genreIds": [
            18
        ],
        "id": 254821,
        "originalLanguage": "zh",
        "originalTitle": null,
        "overview": "In the bustling capital of Bianjing during the Northern Song Dynasty, Madam Li moves her family in search of better marriage prospects for her five beautiful but quirky daughters, whose love lives have long been her worry. Each daughter, though famous for her beauty and wit, comes with unique quirks: the eldest, Shou Hua, has no interest in remarrying after early widowhood; the third, Kang Ning, is fierce and headstrong; the fourth, Hao De, is well-meaning but blunt; and the youngest, Le Shan, is spoiled and selective.  Challenges abound as they face unexpected setbacks, including a cold reception from the already-married sister they came to visit. As the family reestablishes their business, they navigate a series of humorous and heartwarming misadventures, ultimately finding love and fulfilling their mother’s hopes in this lively tale of family and romance.",
        "popularity": 85.947,
        "posterPath": "/bNPVb2Sv4N3CO7l6AdfjxNkMTfN.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Perfect Match",
        "video": false,
        "voteAverage": 0,
        "mediaType": "tv",
        "voteCount": 0,
        "firstAirDate": "2025-01-25",
        "displayTitle": "Perfect Match",
        "displayReleaseDate": "2025-01-25"
    },
    {
        "adult": false,
        "backdropPath": "/dD2X3iqtF4Dz3FpnYNSWud3LOrj.jpg",
        "genreIds": [
            18,
            9648
        ],
        "id": 219971,
        "originalLanguage": "en",
        "originalTitle": null,
        "overview": "Covert CIA agent Martian is ordered to abandon his undercover life and return to London Station. When the love he left behind unexpectedly reappears, their romance reignites, pitting his career, his real identity and his mission against his heart while hurling them both into a deadly game of international intrigue and espionage.",
        "popularity": 256.402,
        "posterPath": "/jtzUrOzxY0iRnPJ2qZ6VmVC1Hfl.jpg",
        "releaseDate": null,
        "title": null,
        "name": "The Agency",
        "video": false,
        "voteAverage": 7.4,
        "mediaType": "tv",
        "voteCount": 58,
        "firstAirDate": "2024-12-01",
        "displayTitle": "The Agency",
        "displayReleaseDate": "2024-12-01"
    },
    {
        "adult": false,
        "backdropPath": "/ijRiyqrXUzrF77INhtzvSS6V6qG.jpg",
        "genreIds": [
            18,
            80
        ],
        "id": 226637,
        "originalLanguage": "en",
        "originalTitle": null,
        "overview": "Morgan is a single mom with an exceptional mind, whose unconventional knack for solving crimes leads to an unusual and unstoppable partnership with a by-the-book seasoned detective.",
        "popularity": 500.906,
        "posterPath": "/ylTZ6bfmPrwUz01A0VpvluGFWsv.jpg",
        "releaseDate": null,
        "title": null,
        "name": "High Potential",
        "video": false,
        "voteAverage": 8.4,
        "mediaType": "tv",
        "voteCount": 89,
        "firstAirDate": "2024-09-17",
        "displayTitle": "High Potential",
        "displayReleaseDate": "2024-09-17"
    },
    {
        "adult": false,
        "backdropPath": "/yErVUZkLVak2ICxFC7mMfl3vcNP.jpg",
        "genreIds": [
            16,
            10759,
            35,
            10765
        ],
        "id": 205050,
        "originalLanguage": "ja",
        "originalTitle": null,
        "overview": "Rakuro Hizutome only cares about one thing: beating crappy VR games. He devotes his entire life to these buggy games and could clear them all in his sleep. One day, he decides to challenge himself and play a popular god-tier game called Shangri-La Frontier. But he quickly learns just how difficult it is. Will his expert skills be enough to uncover its hidden secrets?",
        "popularity": 262.478,
        "posterPath": "/aCGdpgNkgz66R1winFkTFsMAhlC.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Shangri-La Frontier",
        "video": false,
        "voteAverage": 7.9,
        "mediaType": "tv",
        "voteCount": 120,
        "firstAirDate": "2023-10-01",
        "displayTitle": "Shangri-La Frontier",
        "displayReleaseDate": "2023-10-01"
    },
    {
        "adult": false,
        "backdropPath": "/qV2REPQ7pPlmQT7Mljkca0wi4Bx.jpg",
        "genreIds": [
            18,
            80
        ],
        "id": 245927,
        "originalLanguage": "en",
        "originalTitle": null,
        "overview": "The tranquility in a serene, wealthy community inhabited by some of the world's most prominent individuals explodes when a shocking murder occurs and a high stakes investigation unfolds.",
        "popularity": 63.898,
        "posterPath": "/lqjr5O9Z7ChkWpNLbJ01paofjhP.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Paradise",
        "video": false,
        "voteAverage": 2,
        "mediaType": "tv",
        "voteCount": 2,
        "firstAirDate": "2025-01-26",
        "displayTitle": "Paradise",
        "displayReleaseDate": "2025-01-26"
    },
    {
        "adult": false,
        "backdropPath": "/4WCW25PfD05DnrHZXglff78KhHJ.jpg",
        "genreIds": [
            18,
            80
        ],
        "id": 246381,
        "originalLanguage": "en",
        "originalTitle": null,
        "overview": "A brilliant math student is on the verge of a major breakthrough when a shadowy enemy tries to stop him. Fighting for answers—and his life—he teams up with a government agent to unravel a high-stakes conspiracy.",
        "popularity": 421.799,
        "posterPath": "/bGYCimDXRL7cE3uETLZzMCFOdJo.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Prime Target",
        "video": false,
        "voteAverage": 7.609,
        "mediaType": "tv",
        "voteCount": 23,
        "firstAirDate": "2025-01-22",
        "displayTitle": "Prime Target",
        "displayReleaseDate": "2025-01-22"
    },
    {
        "adult": false,
        "backdropPath": "/o0NsbcIvsllg6CJX0FBFY8wWbsn.jpg",
        "genreIds": [
            10759,
            16,
            10765
        ],
        "id": 30984,
        "originalLanguage": "ja",
        "originalTitle": null,
        "overview": "For as long as he can remember, Ichigo Kurosaki has been able to see ghosts. But when he meets Rukia, a Soul Reaper who battles evil spirits known as Hollows, he finds his life is changed forever. Now, with a newfound wealth of spiritual energy, Ichigo discovers his true calling: to protect the living and the dead from evil.",
        "popularity": 250.408,
        "posterPath": "/2EewmxXe72ogD0EaWM8gqa0ccIw.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Bleach",
        "video": false,
        "voteAverage": 8.4,
        "mediaType": "tv",
        "voteCount": 1885,
        "firstAirDate": "2004-10-05",
        "displayTitle": "Bleach",
        "displayReleaseDate": "2004-10-05"
    },
    {
        "adult": false,
        "backdropPath": "/yXggMemopUDHwPgmi6X9Wh2BQra.jpg",
        "genreIds": [
            16,
            10759,
            10765
        ],
        "id": 12609,
        "originalLanguage": "ja",
        "originalTitle": null,
        "overview": "Long ago in the mountains, a fighting master known as Son Gohan discovered a strange boy whom he named Son Goku. Gohan raised him and trained Goku in martial arts until he died. The young and very strong boy was on his own, but easily managed. Then one day, Goku met a teenage girl named Bulma, whose search for the mystical Dragon Balls brought her to Goku's home. Together, they set off to find all seven and to grant her wish.",
        "popularity": 13.093,
        "posterPath": "/onCLyCOgszTIyyVs2XKYSkKPOPG.jpg",
        "releaseDate": null,
        "title": null,
        "name": "Dragon Ball",
        "video": false,
        "voteAverage": 8.3,
        "mediaType": "tv",
        "voteCount": 3128,
        "firstAirDate": "1986-02-26",
        "displayTitle": "Dragon Ball",
        "displayReleaseDate": "1986-02-26"
    }
]



  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <FeaturedMovie movie={featuredMovie} />


      {/* Trending Section with Carousel */}
      <MovieCarousel key={0}
        movies={trendingMovies.slice(0,10)} 
        title="🔥 Trending Now 🔥" 
      />

      {/* New Releases Carousel */}
      <MovieCarousel key={1}
        movies={trendingMovies.slice(0,10)} 
        title="New Releases" 
      />

       {/* Trending Section with Carousel */}
       
    </div>
  );
};

export default MovieHomepage;