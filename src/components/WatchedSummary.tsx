import { Movie as MovieProps } from "./static";
const average = (arr: number[]): number => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;

export function WatchedSummary({ watched }: { watched: MovieProps[] }): JSX.Element {
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
