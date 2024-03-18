import { useEffect, useState } from "react";
import { Movie as MovieProps } from "./components/static";
const KEY = process.env.REACT_APP_OMDB_API_KEY;

const useApp = () => {
    const [query, setQuery] = useState<string>("");
    const [movies, setMovies] = useState<MovieProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // No localStorage used
    // const [watched, setWatched] = useState<MovieProps[]>([]);

    // LocalStorage used
    const [watched, setWatched] = useState<MovieProps[]>(function () {
        // Reading watched movies from localStorage
        const storedValue = localStorage.getItem("watched");
        return storedValue ? JSON.parse(storedValue) : [];
    });

    function handleSelectMovie(id: string): void {
        setSelectedId((prevId) => (id === prevId ? null : id));
    }

    function handleCloseMovie(): void {
        setSelectedId(null);
    }

    function handleAddWatched(movie: MovieProps): void {
        setWatched((prevWatched: MovieProps[]) => [...prevWatched, movie]);
        // Adding watched movies to localStorage
        // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
    }

    function handleDeleteWatched(id: string): void {
        setWatched((prevWatched) => prevWatched.filter((movie) => movie.imdbID !== id));
    }

    // Adding watched movies to localStorage
    useEffect(
        function () {
            localStorage.setItem("watched", JSON.stringify(watched));
        },
        [watched]
    );

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

    return { query, setQuery, movies, isLoading, watched, error, selectedId, handleSelectMovie, handleAddWatched, handleDeleteWatched, handleCloseMovie };
};

export default useApp;
