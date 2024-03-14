import { MovieDetails as MovieDetailsProps } from "./static";

export function Movie({ movie, onSelectMovie }: { movie: MovieDetailsProps; onSelectMovie: (id: string) => void }): JSX.Element {
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
