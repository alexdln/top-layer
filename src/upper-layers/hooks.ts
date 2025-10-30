"use client";

import { useContext, useMemo, useSyncExternalStore } from "react";

import { UpperLayerContext, UpperLayersContext } from "./contexts";

export const useUpperLayerStore = ({ id: layerIdHook }: { id?: string } = {}) => {
    const { id: layerIdContext } = useContext(UpperLayerContext);
    const { update, reset, get, subscribe, unsubscribe } = useContext(UpperLayersContext);

    if (!update || !reset || !get || !subscribe || !unsubscribe) {
        throw new Error("Please, do not use this hook outside of the TopLayerProvider");
    }

    return useMemo(
        () => ({
            update: <T = unknown>({ data, id: layerIdMethod }: { data: T | ((prevData: T) => T); id?: string }) => {
                const finalId = layerIdMethod || layerIdHook || layerIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the UpperLayer item");
                }
                return update(finalId, data);
            },
            reset: ({ id: layerIdMethod }: { id?: string } = {}) => {
                const finalId = layerIdMethod || layerIdHook || layerIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the UpperLayer item");
                }
                return reset(finalId);
            },
            get: <T = unknown>({ id: layerIdMethod }: { id?: string } = {}) => {
                const finalId = layerIdMethod || layerIdHook || layerIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the UpperLayer item");
                }
                return get<T>(finalId);
            },
            subscribe: ({ callback, id: layerIdMethod }: { callback: (data: unknown) => void; id?: string }) => {
                const finalId = layerIdMethod || layerIdHook || layerIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the UpperLayer item");
                }
                return subscribe(finalId, callback);
            },
            unsubscribe: ({ callback, id: layerIdMethod }: { callback: (data: unknown) => void; id?: string }) => {
                const finalId = layerIdMethod || layerIdHook || layerIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the UpperLayer item");
                }
                return unsubscribe(finalId, callback);
            },
        }),
        [layerIdHook, layerIdContext, update, reset, get, subscribe, unsubscribe],
    );
};

export const useUpperLayerData = <T = unknown>({ id: layerIdHook }: { id?: string } = {}) => {
    const { id: layerIdContext } = useContext(UpperLayerContext);
    const { get, subscribe, unsubscribe } = useContext(UpperLayersContext);
    const finalId = layerIdHook || layerIdContext;

    if (!get || !subscribe || !unsubscribe) {
        throw new Error("Please, do not use this hook outside of the TopLayerProvider");
    }

    if (!finalId) {
        throw new Error("Please, provide ID or use this hook inside the UpperLayer item");
    }

    const data = useSyncExternalStore<T>(
        (callback: (data: unknown) => void) => subscribe(finalId, callback),
        () => get<T>(finalId),
        () => get<T>(finalId),
    );

    return data;
};
