import { useEffect, useRef, useState } from "react";
import { Movie as MovieProps, WatchedMovie } from "../static";
import { MovieDetails as MovieDetailsProps } from "../static";

const useMovieDetails = (
    selectedId: string,
    onCloseMovie: () => void,
    onAddWatched: (movie: MovieProps) => void,
    watched: MovieProps[]
) => {
    const [movie, setMovie] = useState<MovieDetailsProps | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

    const countRef = useRef(0);

    useEffect(
        function () {
            if (userRating) {
                countRef.current = countRef.current + 1;
            }
        },
        [userRating]
    );

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

    const handleAdd = () => {
        const newWatchedMovie: WatchedMovie = {
            imdbID: selectedId,
            Title: title || "",
            Year: year || "",
            Poster: poster || "",
            imdbRating: Number(imdbRating),
            runtime: Number(runtime?.split(" ")[0]),
            userRating: userRating ? Number(userRating) : undefined,
            countRatingDecisions: countRef.current,
        };

        onAddWatched(newWatchedMovie);
        onCloseMovie();
    };

    const handleSetUserRating = (rating: number) => {
        setUserRating(String(rating));
    };

    useEffect(() => {
        const getMovieDetails = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&i=${selectedId}`);
                const data: MovieDetailsProps = await res.json();
                setMovie(data);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getMovieDetails();
    }, [selectedId]);

    useEffect(() => {
        const callback = (e: KeyboardEvent) => {
            if (e.code === "Escape") {
                onCloseMovie();
            }
        };

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

    return { movie, userRating, isLoading, handleAdd, handleSetUserRating, isWatched, watchedUserRating };
};

export default useMovieDetails;
