import { useState } from "react";
import { Movie } from "./static";

export function Loader(): JSX.Element {
    return <p className="loader">Loading...</p>;
}

export function ErrorMessage({ message }: { message: string }): JSX.Element {
    return (
        <p className="error">
            <span>⛔️</span> {message}
        </p>
    );
}

export function NavBar({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}

export function Logo(): JSX.Element {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>Popcorn</h1>
        </div>
    );
}

export function Search({ query, setQuery }: { query: string; setQuery: React.Dispatch<React.SetStateAction<string>> }): JSX.Element {
    return <input className="search" type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />;
}

export function NumResults({ movies }: { movies: Movie[] }): JSX.Element {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}

export function Main({ children }: { children: React.ReactNode }): JSX.Element {
    return <main className="main">{children}</main>;
}

export function Box({ children }: { children: React.ReactNode }): JSX.Element {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <button className="btn-toggle" onClick={() => setIsOpen((prevOpen) => !prevOpen)}>
                {isOpen ? "–" : "+"}
            </button>

            {isOpen && children}
        </div>
    );
}
