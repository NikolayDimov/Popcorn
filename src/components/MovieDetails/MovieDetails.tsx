import StarRating from "../../StarRating";
import { Movie as MovieProps } from "../static";
import { Loader } from "../common";
import useMovieDetails from "./MovieDetails.logic";

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
    const { movie, userRating, isLoading, handleAdd, handleSetUserRating, isWatched, watchedUserRating } = useMovieDetails(
        selectedId,
        onCloseMovie,
        onAddWatched,
        watched
    );

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
                        <img src={movie?.Poster} alt={`Poster of ${movie?.Title} movie`} />
                        <div className="details-overview">
                            <h2>{movie?.Title}</h2>
                            <p>
                                {movie?.Released} &bull; {movie?.Runtime}
                            </p>
                            <p>{movie?.Genre}</p>
                            <p>
                                <span>⭐️</span>
                                {movie?.imdbRating} IMDb rating
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
                            <em>{movie?.Plot}</em>
                        </p>
                        <p>Starring {movie?.Actors}</p>
                        <p>Directed by {movie?.Director}</p>
                    </section>
                </>
            )}
        </div>
    );
}
