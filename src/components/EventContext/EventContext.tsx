import { createContext } from 'react';

export const EventContext = createContext<Function>(() => {});
export const EventProvider = EventContext.Provider;
export const EventConsumer = EventContext.Consumer;
