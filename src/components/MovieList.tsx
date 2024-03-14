import { Movie } from "./Movie";
import { MovieDetails as MovieDetailsProps } from "./static";

export function MovieList({ movies, onSelectMovie }: { movies: MovieDetailsProps[]; onSelectMovie: (id: string) => void }): JSX.Element {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
            ))}
        </ul>
    );
}
