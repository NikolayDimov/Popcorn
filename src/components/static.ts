export interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    runtime?: number;
    imdbRating?: number;
    userRating?: number;
}

export interface MovieDetails extends Movie {
    Plot?: string;
    Released?: string;
    Actors?: string;
    Director?: string;
    Genre?: string;
    Runtime?: string;
}

export interface WatchedMovie extends Movie {
    countRatingDecisions: number;
}
