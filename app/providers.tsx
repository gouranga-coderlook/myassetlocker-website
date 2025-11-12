// app/providers.tsx
"use client";
import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore, RootState } from "../store/store";
import { Toaster } from "react-hot-toast";

type Props = {
  readonly children: React.ReactNode;
  readonly preloadedState?: RootState;
};

export default function Providers({ children, preloadedState }: Props) {
  // create store once per client render; preloadedState only used at initial render
  const store = useMemo(
    () => makeStore(preloadedState),
    [preloadedState]
  );

  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#4c4946",
            border: "1px solid #e8e8e8",
            borderRadius: "8px",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #fecaca",
              background: "#fef2f2",
            },
          },
        }}
      />
    </Provider>
  );
}
