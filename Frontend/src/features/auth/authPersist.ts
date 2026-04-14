import Cookies from "js-cookie";

import type { RootState } from "../../app/store";
import { AUTH_COOKIE_NAME, TOKEN_REFRESH_INTERVAL } from "../../config";
import { showErrorToast } from "../../utils/showErrorToast";

type RefreshTokenFn = () => Promise<unknown>;
type GetStateFn = () => RootState;

let refreshTimer: ReturnType<typeof setInterval> | null = null;

export const startTokenRefreshTimer = (
  refreshTokenFn: RefreshTokenFn,
  getState: GetStateFn,
): void => {
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
      showErrorToast(error);
    }
  }, TOKEN_REFRESH_INTERVAL);
};

export const stopTokenRefreshTimer = (): void => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

export const isAuthCookieValid = (): boolean => {
  return !!Cookies.get(AUTH_COOKIE_NAME);
};
