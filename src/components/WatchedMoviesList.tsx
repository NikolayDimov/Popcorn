import { WatchedMovie } from "./WatchedMovie";
import { Movie as MovieProps } from "./static";

export function WatchedMoviesList({ watched, onDeleteWatched }: { watched: MovieProps[]; onDeleteWatched: (id: string) => void }): JSX.Element {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
            ))}
        </ul>
    );
}
