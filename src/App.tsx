import { useEffect, useState } from "react";
import { Movie as MovieProps } from "./components/static";
import { Box, ErrorMessage, Loader, Main, NavBar, NumResults, Search } from "./components/common";
import { MovieList } from "./components/MovieList";
import { MovieDetails } from "./components/MovieDetails";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMoviesList } from "./components/WatchedMoviesList";
const KEY = process.env.REACT_APP_OMDB_API_KEY;

export default function App(): JSX.Element {
    const [query, setQuery] = useState<string>("");
    const [movies, setMovies] = useState<MovieProps[]>([]);
    const [watched, setWatched] = useState<MovieProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    function handleSelectMovie(id: string): void {
        setSelectedId((prevId) => (id === prevId ? null : id));
    }

    function handleCloseMovie(): void {
        setSelectedId(null);
    }

    function handleAddWatched(movie: MovieProps): void {
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
