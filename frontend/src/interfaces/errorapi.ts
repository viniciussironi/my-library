export interface ErrorAPI {
    error: string;
    message: string;
    path: string;
    status: number;
    timestamp: string;
    listErrors?: ApiFieldError[];
}

export interface ApiFieldError {
    field: string;
    message: string;
}