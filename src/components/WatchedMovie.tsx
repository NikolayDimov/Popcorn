import { Movie as MovieProps } from "./static";

export function WatchedMovie({ movie, onDeleteWatched }: { movie: MovieProps; onDeleteWatched: (id: string) => void }): JSX.Element {
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
