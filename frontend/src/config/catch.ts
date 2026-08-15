import type { ErrorAPI } from "../interfaces/errorapi";

export function handleApiError(err: any, setSaveError: (error: ErrorAPI) => void) {
    const apiError: ErrorAPI = err.response?.data;
    setSaveError(apiError);
}