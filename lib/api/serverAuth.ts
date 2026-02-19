// Server-side function to fetch session/auth data
// Note: This runs on the server, so localStorage is not available
// Auth state is managed client-side via Redux and localStorage

export async function getSessionLikeData() {
  // Server-side: Return null as auth is managed client-side
  // The client will hydrate auth state from localStorage in Providers component
  try {
    return {
      accessToken: undefined,
      refreshToken: undefined,
      user: null,
    };
  } catch (error: unknown) {
    console.error("Error fetching session-like data:", error);
    return {
      accessToken: undefined,
      refreshToken: undefined,
      user: null,
    };
  }
}

