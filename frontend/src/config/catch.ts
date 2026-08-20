import type { ErrorAPI } from "../interfaces/ErrorApi";

export function handleApiError(err: any, setSaveError: (error: ErrorAPI) => void) {
    const apiError: ErrorAPI = err.response?.data;
    setSaveError(apiError);
}