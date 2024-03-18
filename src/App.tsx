import { Box, ErrorMessage, Loader, Main, NavBar, NumResults, Search } from "./components/common";
import { MovieList } from "./components/MovieList";
import { MovieDetails } from "./components/MovieDetails/MovieDetails";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMoviesList } from "./components/WatchedMoviesList";
import useApp from "./App.logic";

export default function App(): JSX.Element {
    const {
        query,
        setQuery,
        movies,
        isLoading,
        watched,
        error,
        selectedId,
        handleSelectMovie,
        handleAddWatched,
        handleDeleteWatched,
        handleCloseMovie,
    } = useApp();
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
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />
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
