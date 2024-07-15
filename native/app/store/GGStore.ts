import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { type AccountSlice, createAccountSlice } from "./Account/AccountSlice.ts";
import { type AuthenticationSlice, createAuthenticationSlice } from "./Authentication/AuthenticationSlice.ts";
import { type DefinitionsSlice, createDefinitionsSlice } from "./DefinitionsSlice.ts";
import { type UIDataSlice, createUIDataSlice } from "./UIDataSlice.ts";
import { type SettingsSlice, createSettingsSlice } from "./SettingsSlice.ts";

export interface IStore extends AccountSlice, AuthenticationSlice, DefinitionsSlice, UIDataSlice, SettingsSlice {}

export const useGGStore = create<IStore>()(
  subscribeWithSelector((...a) => ({
    ...createAccountSlice(...a),
    ...createAuthenticationSlice(...a),
    ...createDefinitionsSlice(...a),
    ...createUIDataSlice(...a),
    ...createSettingsSlice(...a),
  })),
);
