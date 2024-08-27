export async function fetchCsrfToken() {
    const response = await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'include', // Ensure cookies are included in the request
    });
    const data = await response.json();
    return data.csrfToken;
  }
  