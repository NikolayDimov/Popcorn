import { useEffect, useState } from "react";
import StarRating from "../StarRating";
import { Movie as MovieProps } from "./static";
import { MovieDetails as MovieDetailsProps } from "./static";
import { Loader } from "./common";
const KEY = process.env.REACT_APP_OMDB_API_KEY;

export function MovieDetails({
    selectedId,
    onCloseMovie,
    onAddWatched,
    watched,
}: {
    selectedId: string;
    onCloseMovie: () => void;
    onAddWatched: (movie: MovieProps) => void;
    watched: MovieProps[];
}): JSX.Element {
    const [movie, setMovie] = useState<MovieDetailsProps | null>(null);
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
        const newWatchedMovie: MovieProps = {
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
            const data: MovieDetailsProps = await res.json();
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
