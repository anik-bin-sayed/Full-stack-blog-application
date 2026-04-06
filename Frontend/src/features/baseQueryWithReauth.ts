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

// Create baseQuery with a prepareHeaders that removes Content-Type for FormData
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/",
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint, extra }) => {
    // You can add auth headers here if needed
    // For FormData, we DO NOT set Content-Type - the browser will set it with boundary
    // So we do nothing special; just return headers as is.
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  // 🟢 Fix: Handle FormData - ensure no Content-Type header is forced
  let modifiedArgs = args;
  if (
    args &&
    typeof args === "object" &&
    "body" in args &&
    args.body instanceof FormData
  ) {
    // For FormData, we need to let the browser set the multipart boundary.
    // fetchBaseQuery by default will try to set Content-Type based on body type,
    // but if we already have a custom header, we must override it.
    modifiedArgs = {
      ...args,
      headers: {
        ...(args.headers || {}),
        "Content-Type": undefined, // remove any preset Content-Type
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

          // Retry original request with the same FormData handling
          result = await baseQuery(modifiedArgs, api, extraOptions);
        } else {
          isRefreshing = false;
          refreshSubscribers = [];
        }
      } catch (error) {
        isRefreshing = false;
        refreshSubscribers = [];
        // api.dispatch(logoutUser());
      }
    } else {
      // Token refresh is in progress, queue this request
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
