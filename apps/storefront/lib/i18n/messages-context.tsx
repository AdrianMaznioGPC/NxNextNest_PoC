"use client";

import type { PageBootstrapModel } from "lib/types";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
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

export function useT(namespace: string) {
  const messages = useContext(MessagesContext);
  if (!messages) {
    throw new Error("useT must be used within MessagesProvider");
  }

  return (key: string, fallback?: string) =>
    translate(messages, namespace, key, fallback);
}
