import { createSelector } from "@reduxjs/toolkit";
import { isCacheValid } from "../../utils/cache/isCacheValid";

export const selectUser = createSelector(
  (state: any) => state.profile.user,
  (state: any) => state.profile.cachedAt,
  (state: any, apiUser: any) => apiUser,
  (user, cachedAt, apiUser) => {
    const valid = isCacheValid(cachedAt);

    return valid ? user : apiUser;
  },
);
