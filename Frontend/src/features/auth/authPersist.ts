import Cookies from "js-cookie";
import type { RootState } from "../../app/store";

// Constants
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes (token expires in 15)
const AUTH_COOKIE_NAME = "__auth";

let refreshTimer: ReturnType<typeof setInterval> | null = null;

export const startTokenRefreshTimer = (
  refreshTokenFn: () => Promise<any>,
  getState: () => RootState,
) => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  refreshTimer = setInterval(async () => {
    try {
      const state = getState();
      const isAuthenticated = state?.auth?.isAuthenticated;

      if (isAuthenticated) {
        await refreshTokenFn();
      }
    } catch (error) {
      // Silently handle token refresh errors
    }
  }, TOKEN_REFRESH_INTERVAL);
};

export const stopTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

export const setAuthMarker = () => {
  try {
    Cookies.set(AUTH_COOKIE_NAME, "true", {
      expires: 30,
      secure: true,
      sameSite: "Lax",
    });
  } catch (error) {
    // Silently handle cookie error
  }
};

export const clearAuthState = () => {
  try {
    stopTokenRefreshTimer();
    Cookies.remove(AUTH_COOKIE_NAME);
    localStorage.removeItem("access_token");
  } catch (error) {
    // Silently handle cleanup error
  }
};

export const isAuthCookieValid = () => {
  return !!Cookies.get(AUTH_COOKIE_NAME);
};
