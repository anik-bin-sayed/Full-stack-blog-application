import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeToTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const notifyRefreshTokenCompletion = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/",
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint, extra }) => {
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let modifiedArgs = args;
  if (
    args &&
    typeof args === "object" &&
    "body" in args &&
    args.body instanceof FormData
  ) {
    modifiedArgs = {
      ...args,
      headers: {
        ...(args.headers || {}),
        "Content-Type": undefined,
      },
    };
  }

  let result = await baseQuery(modifiedArgs, api, extraOptions);

  if (result?.error?.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResult = await baseQuery(
          { url: "auth/refresh", method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          isRefreshing = false;
          notifyRefreshTokenCompletion();

          result = await baseQuery(modifiedArgs, api, extraOptions);
        } else {
          isRefreshing = false;
          refreshSubscribers = [];
        }
      } catch (error) {
        isRefreshing = false;
        refreshSubscribers = [];
      }
    } else {
      return new Promise((resolve) => {
        subscribeToTokenRefresh(() => {
          resolve(baseQuery(modifiedArgs, api, extraOptions));
        });
      });
    }
  }

  return result;
};

export default baseQueryWithReauth;
