"use client";

import type { PageBootstrapModel } from "lib/types";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { translate } from "./translate";

type BootstrapMessages = PageBootstrapModel["shell"]["messages"];

const MessagesContext = createContext<BootstrapMessages | null>(null);

export function MessagesProvider({
  messages,
  children,
}: {
  messages: BootstrapMessages;
  children: ReactNode;
}) {
  return (
    <MessagesContext.Provider value={messages}>
      {children}
    </MessagesContext.Provider>
  );
}

/**
 * Merges additional message namespaces into an existing MessagesProvider.
 * Use this in nested layouts (e.g. checkout) to add translations without
 * losing the parent namespaces (common, nav, cart, etc.).
 */
export function MergedMessagesProvider({
  messages,
  children,
}: {
  messages: BootstrapMessages;
  children: ReactNode;
}) {
  const parent = useContext(MessagesContext);
  const merged = { ...parent, ...messages };

  return (
    <MessagesContext.Provider value={merged}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useT(namespace: string) {
  const messages = useContext(MessagesContext);
  if (!messages) {
    throw new Error("useT must be used within MessagesProvider");
  }

  return (key: string, fallback?: string) =>
    translate(messages, namespace, key, fallback);
}
