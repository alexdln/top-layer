"use client";

import { useContext, useMemo, useSyncExternalStore } from "react";

import { DialogContext, DialogWrapperContext } from "./contexts";

export const useDialogStore = ({ id: dialogIdHook }: { id?: string } = {}) => {
    const { id: dialogIdContext } = useContext(DialogWrapperContext);
    const { get, update, reset, subscribe, unsubscribe } = useContext(DialogContext);

    if (!get || !update || !reset || !subscribe || !unsubscribe) {
        throw new Error("Please, do not use this hook outside of the DialogsProvider");
    }

    return useMemo(
        () => ({
            get: <T>({ id: dialogIdMethod }: { id?: string } = {}) => {
                const finalId = dialogIdMethod || dialogIdHook || dialogIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the Dialog item");
                }
                return get(finalId) as T;
            },
            update: <T>({ data, id: dialogIdMethod }: { data: T | ((prevData: T) => T); id?: string }) => {
                const finalId = dialogIdMethod || dialogIdHook || dialogIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the Dialog item");
                }
                return update(finalId, data);
            },
            reset: ({ id: dialogIdMethod }: { id?: string } = {}) => {
                const finalId = dialogIdMethod || dialogIdHook || dialogIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the Dialog item");
                }
                return reset(finalId);
            },
            subscribe: ({ callback, id: dialogIdMethod }: { callback: (data: unknown) => void; id?: string }) => {
                const finalId = dialogIdMethod || dialogIdHook || dialogIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the Dialog item");
                }
                return subscribe(finalId, callback);
            },
            unsubscribe: ({ callback, id: dialogIdMethod }: { callback: (data: unknown) => void; id?: string }) => {
                const finalId = dialogIdMethod || dialogIdHook || dialogIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the Dialog item");
                }
                return unsubscribe(finalId, callback);
            },
        }),
        [dialogIdHook, dialogIdContext, get, update, reset, subscribe, unsubscribe],
    );
};

export const useDialogAction = ({ id: dialogIdHook }: { id?: string } = {}) => {
    const { id: dialogIdContext } = useContext(DialogWrapperContext);
    const { open, close } = useContext(DialogContext);

    if (!open || !close) {
        throw new Error("Please, do not use this hook outside of the DialogsProvider");
    }

    return useMemo(
        () => ({
            open: <T>({ data, id: dialogIdMethod }: { data?: T; id?: string } = {}) => {
                const finalId = dialogIdMethod || dialogIdHook || dialogIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the Dialog item");
                }
                open(finalId, data);
            },
            close: <T>({ data, id: dialogIdMethod }: { data?: T; id?: string } = {}) => {
                const finalId = dialogIdMethod || dialogIdHook || dialogIdContext;
                if (!finalId) {
                    throw new Error("Please, provide ID or use this hook inside the Dialog item");
                }
                close(finalId, data);
            },
        }),
        [open, close, dialogIdHook, dialogIdContext],
    );
};

export const useDialogData = <T = unknown>({ id: dialogIdHook }: { id?: string } = {}) => {
    const { id: dialogIdContext } = useContext(DialogWrapperContext);
    const { get, subscribe, unsubscribe } = useContext(DialogContext);
    const finalId = dialogIdHook || dialogIdContext;

    if (!get || !subscribe || !unsubscribe) {
        throw new Error("Please, do not use this hook outside of the DialogsProvider");
    }

    if (!finalId) {
        throw new Error("Please, provide ID or use this hook inside the Dialog item");
    }

    const data = useSyncExternalStore<T>(
        (callback: (data: unknown) => void) => subscribe(finalId, callback),
        () => get<T>(finalId),
        () => get<T>(finalId),
    );

    return data;
};
