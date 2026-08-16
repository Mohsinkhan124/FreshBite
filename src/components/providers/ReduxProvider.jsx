"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";

/**
 * Client boundary for the Redux store.
 *
 * The store is created once at module scope. Because every page in this
 * app is rendered beneath the root layout, a single instance is correct —
 * we are not doing per-request SSR store hydration.
 */
export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
