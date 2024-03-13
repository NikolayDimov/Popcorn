import { useEffect, useState } from "react";
import StarRating from "./StarRating";
// import dotenv from "dotenv";
// dotenv.config();

interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    runtime?: number;
    imdbRating?: number;
    userRating?: number;
}

interface MovieDetails extends Movie {
    Plot?: string;
    Released?: string;
    Actors?: string;
    Director?: string;
    Genre?: string;
    Runtime?: string;
}

const average = (arr: number[]): number => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;

const KEY = process.env.REACT_APP_OMDB_API_KEY;

export default function App(): JSX.Element {
    const [query, setQuery] = useState<string>("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [watched, setWatched] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    function handleSelectMovie(id: string): void {
        setSelectedId((prevId) => (id === prevId ? null : id));
    }

    function handleCloseMovie(): void {
        setSelectedId(null);
    }

    function handleAddWatched(movie: Movie): void {
        setWatched((prevWatched) => [...prevWatched, movie]);
    }

    function handleDeleteWatched(id: string): void {
        setWatched((prevWatched) => prevWatched.filter((movie) => movie.imdbID !== id));
    }

    useEffect(() => {
        const controller = new AbortController();

        async function fetchMovies(): Promise<void> {
            try {
                setIsLoading(true);
                setError("");

                const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });

                if (!res.ok) throw new Error("Something went wrong with fetching movies");

                const data = await res.json();
                if (data.Response === "False") throw new Error("Movie not found");

                setMovies(data.Search);
                setError("");
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.log(error.message);
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        }

        if (query.length < 3) {
            setMovies([]);
            setError("");
            return;
        }

        handleCloseMovie();
        fetchMovies();

        return () => {
            controller.abort();
        };
    }, [query]);

    return (
        <>
            <NavBar>
                <Search query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </NavBar>

            <Main>
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
                    {error && <ErrorMessage message={error} />}
                </Box>

                <Box>
                    {selectedId ? (
                        <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched} watched={watched} />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}

function Loader(): JSX.Element {
    return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }: { message: string }): JSX.Element {
    return (
        <p className="error">
            <span>⛔️</span> {message}
        </p>
    );
}

function NavBar({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}

function Logo(): JSX.Element {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>Popcorn</h1>
        </div>
    );
}

function Search({ query, setQuery }: { query: string; setQuery: React.Dispatch<React.SetStateAction<string>> }): JSX.Element {
    return <input className="search" type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />;
}

function NumResults({ movies }: { movies: Movie[] }): JSX.Element {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}

function Main({ children }: { children: React.ReactNode }): JSX.Element {
    return <main className="main">{children}</main>;
}

function Box({ children }: { children: React.ReactNode }): JSX.Element {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <button className="btn-toggle" onClick={() => setIsOpen((prevOpen) => !prevOpen)}>
                {isOpen ? "–" : "+"}
            </button>

            {isOpen && children}
        </div>
    );
}

function MovieList({ movies, onSelectMovie }: { movies: Movie[]; onSelectMovie: (id: string) => void }): JSX.Element {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
            ))}
        </ul>
    );
}

function Movie({ movie, onSelectMovie }: { movie: Movie; onSelectMovie: (id: string) => void }): JSX.Element {
    return (
        <li onClick={() => onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}

function MovieDetails({
    selectedId,
    onCloseMovie,
    onAddWatched,
    watched,
}: {
    selectedId: string;
    onCloseMovie: () => void;
    onAddWatched: (movie: Movie) => void;
    watched: Movie[];
}): JSX.Element {
    const [movie, setMovie] = useState<MovieDetails | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

    const isWatched = watched.some((movie) => movie.imdbID === selectedId);
    const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie ?? {};

    function handleAdd() {
        const newWatchedMovie: Movie = {
            imdbID: selectedId,
            Title: title || "",
            Year: year || "",
            Poster: poster || "",
            imdbRating: Number(imdbRating),
            runtime: Number(runtime?.split(" ")[0]),
            userRating: userRating ? Number(userRating) : undefined,
        };

        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    function handleSetUserRating(rating: number) {
        setUserRating(String(rating));
    }

    useEffect(() => {
        async function getMovieDetails() {
            setIsLoading(true);
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
            const data: MovieDetails = await res.json();
            setMovie(data);
            setIsLoading(false);
        }
        getMovieDetails();
    }, [selectedId]);

    useEffect(() => {
        function callback(e: KeyboardEvent) {
            if (e.code === "Escape") {
                onCloseMovie();
            }
        }

        document.addEventListener("keydown", callback);

        return () => {
            document.removeEventListener("keydown", callback);
        };
    }, [onCloseMovie]);

    useEffect(() => {
        if (title) {
            document.title = `Movie | ${title}`;
            return () => {
                document.title = "Popcorn";
            };
        }
    }, [title]);

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img src={poster} alt={`Poster of ${title} movie`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐️</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {!isWatched ? (
                                <>
                                    <StarRating maxRating={10} size={24} onSetRating={handleSetUserRating} />
                                    {userRating && Number(userRating) > 0 && (
                                        <button className="btn-add" onClick={handleAdd}>
                                            + Add to list
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>
                                    You rated this movie {watchedUserRating} <span>⭐️</span>
                                </p>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}

function WatchedSummary({ watched }: { watched: Movie[] }): JSX.Element {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating || 0));
    const avgUserRating = average(watched.map((movie) => movie.userRating || 0));
    const avgRuntime = average(watched.map((movie) => movie.runtime || 0));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime.toFixed(0)} min</span>
                </p>
            </div>
        </div>
    );
}

function WatchedMoviesList({ watched, onDeleteWatched }: { watched: Movie[]; onDeleteWatched: (id: string) => void }): JSX.Element {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
            ))}
        </ul>
    );
}

function WatchedMovie({ movie, onDeleteWatched }: { movie: Movie; onDeleteWatched: (id: string) => void }): JSX.Element {
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>

                <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>
                    X
                </button>
            </div>
        </li>
    );
}
