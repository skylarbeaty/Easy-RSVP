const baseUrl = "http://localhost:5000/api";

export async function apiFetch(url, options = {}){
    const response = await fetch(`${baseUrl}${url}`,{
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    if (!response.ok){
        const error = await response.json();
        throw new Error(error.error || "API error");
    }

    return response.json();
}

export const api = {
    get: (url, options = {}) => apiFetch(url, { method: "GET", ...options}),
    post: (url, body, options = {}) => apiFetch(url, { method: "POST", body: JSON.stringify(body), ...options}),
    patch: (url, body, options = {}) => apiFetch(url, { method: "PATCH", body: JSON.stringify(body), ...options}),
    delete: (url, options = {}) => apiFetch(url, { method: "DELETE", ...options}),
}