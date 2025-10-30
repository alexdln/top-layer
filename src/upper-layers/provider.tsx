"use client";

import React, { useCallback, useEffect, useRef } from "react";

import { RESET_UPPER_LAYER_DATA_EVENT, UPDATE_UPPER_LAYER_DATA_EVENT } from "./constants";
import { UpperLayerContext, UpperLayersContext } from "./contexts";

export type UpperLayersProviderProps = {
    children: React.ReactNode;
    upperLayers?: { layer: React.FC; id: string; defaultData?: unknown }[];
};

export const UpperLayersProvider: React.FC<UpperLayersProviderProps> = ({ children, upperLayers }) => {
    const store = useRef(
        Object.fromEntries(
            upperLayers?.map(({ id, defaultData }) => [
                id,
                { data: defaultData, listeners: new Set<(data: unknown) => void>() },
            ]) || [],
        ),
    );

    const get = useCallback(<T,>(id: string) => {
        return store.current[id].data as T;
    }, []);

    const update = useCallback((id: string, state: unknown | ((prevState: unknown) => unknown)) => {
        store.current[id].data = typeof state === "function" ? state(store.current[id].data) : state;
        store.current[id].listeners.forEach((callback) => callback(store.current[id].data));
    }, []);

    const reset = useCallback((id: string) => {
        store.current[id].data = undefined;
        store.current[id].listeners.forEach((callback) => callback(undefined));
    }, []);

    const subscribe = useCallback((id: string, callback: (data: unknown) => void) => {
        store.current[id].listeners.add(callback);
        return () => {
            store.current[id].listeners.delete(callback);
        };
    }, []);

    const unsubscribe = useCallback((id: string, callback: (data: unknown) => void) => {
        store.current[id].listeners.delete(callback);
    }, []);

    useEffect(() => {
        const handler = (event: CustomEvent<{ id: string; state: unknown }>) => {
            update(event.detail.id, event.detail.state);
        };
        document.addEventListener(UPDATE_UPPER_LAYER_DATA_EVENT, handler as EventListener);
        return () => document.removeEventListener(UPDATE_UPPER_LAYER_DATA_EVENT, handler as EventListener);
    }, [update]);

    useEffect(() => {
        const handler = (event: CustomEvent<{ id: string }>) => {
            reset(event.detail.id);
        };
        document.addEventListener(RESET_UPPER_LAYER_DATA_EVENT, handler as EventListener);
        return () => document.removeEventListener(RESET_UPPER_LAYER_DATA_EVENT, handler as EventListener);
    }, [reset]);

    return (
        <UpperLayersContext.Provider value={{ get, update, reset, subscribe, unsubscribe }}>
            {children}
            {upperLayers?.map(({ layer: Layer, id }) => (
                <UpperLayerContext.Provider key={id} value={{ id }}>
                    <Layer />
                </UpperLayerContext.Provider>
            ))}
        </UpperLayersContext.Provider>
    );
};
