/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useRef } from "react";

import { OPEN_DIALOG_EVENT, CLOSE_DIALOG_EVENT } from "./constants";
import { DialogContext, DialogWrapperContext } from "./contexts";
import { UpperLayerContext } from "../upper-layers/contexts";

export type DialogsProviderProps = {
    children: React.ReactNode;
    dialogs?: {
        dialog: React.FC;
        id: string;
        props?: React.HTMLAttributes<HTMLDialogElement>;
        defaultData?: unknown;
    }[];
    upperLayers?: { layer: React.FC; id: string; defaultData?: unknown }[];
};

export const DialogsProvider: React.FC<DialogsProviderProps> = ({ children, dialogs, upperLayers }) => {
    const dialogsStore = useRef<{
        [id: string]: {
            node: HTMLDialogElement | null;
            opened: boolean;
            data: unknown;
            listeners: Set<(data: unknown, opened: boolean) => void>;
        };
    }>(
        Object.fromEntries(
            dialogs?.map(({ id, defaultData }) => [
                id,
                { node: null, opened: false, data: defaultData, listeners: new Set() },
            ]) || [],
        ),
    );

    const get = useCallback(<T,>(id: string) => {
        if (!dialogsStore.current[id]) {
            throw new Error(`Dialog with id ${id} not found`);
        }
        return dialogsStore.current[id].data as T;
    }, []);

    const update = useCallback((id: string, state: unknown | ((prevState: unknown) => unknown)) => {
        if (!dialogsStore.current[id]) {
            throw new Error(`Dialog with id ${id} not found`);
        }
        dialogsStore.current[id].data = typeof state === "function" ? state(dialogsStore.current[id].data) : state;
        dialogsStore.current[id].listeners.forEach((callback) =>
            callback(dialogsStore.current[id].data, dialogsStore.current[id].opened),
        );
    }, []);

    const reset = useCallback((id: string) => {
        if (!dialogsStore.current[id]) {
            throw new Error(`Dialog with id ${id} not found`);
        }
        dialogsStore.current[id].data = undefined;
        dialogsStore.current[id].listeners.forEach((callback) => callback(undefined, dialogsStore.current[id].opened));
    }, []);

    const subscribe = useCallback((id: string, callback: (data: unknown, opened: boolean) => void) => {
        if (!dialogsStore.current[id]) {
            throw new Error(`Dialog with id ${id} not found`);
        }
        dialogsStore.current[id].listeners.add(callback);
        return () => {
            dialogsStore.current[id].listeners.delete(callback);
        };
    }, []);

    const unsubscribe = useCallback((id: string, callback: (data: unknown, opened: boolean) => void) => {
        if (!dialogsStore.current[id]) {
            throw new Error(`Dialog with id ${id} not found`);
        }
        dialogsStore.current[id].listeners.delete(callback);
    }, []);

    const open = useCallback((id: string, data: unknown) => {
        if (!dialogsStore.current[id]) {
            throw new Error(`Dialog with id ${id} not found`);
        }
        if (!dialogsStore.current[id].node) {
            throw new Error(`Dialog with id ${id} not registered`);
        }
        dialogsStore.current[id].opened = true;
        dialogsStore.current[id].data = data;
        dialogsStore.current[id].node.showModal();
        dialogsStore.current[id].listeners.forEach((callback) => callback(data, dialogsStore.current[id].opened));
    }, []);

    const close = useCallback((id: string, data: unknown) => {
        if (!dialogsStore.current[id]) {
            throw new Error(`Dialog with id ${id} not found`);
        }
        if (!dialogsStore.current[id].node) {
            throw new Error(`Dialog with id ${id} not registered`);
        }
        dialogsStore.current[id].opened = false;
        dialogsStore.current[id].data = data;
        dialogsStore.current[id].node.close();
        dialogsStore.current[id].listeners.forEach((callback) => callback(data, dialogsStore.current[id].opened));
    }, []);

    const register = useCallback((id: string, node: HTMLDialogElement | null) => {
        if (!node) return;

        dialogsStore.current[id] = {
            node,
            opened: false,
            data: undefined,
            listeners: new Set(),
        };

        return () => {
            delete dialogsStore.current[id];
        };
    }, []);

    useEffect(() => {
        const handler = (event: CustomEvent<{ id: string; data: any }>) => {
            const { id, data } = event.detail;
            open(id, data);
        };
        document.addEventListener(OPEN_DIALOG_EVENT, handler as EventListener);

        return () => document.removeEventListener(OPEN_DIALOG_EVENT, handler as EventListener);
    }, [open]);

    useEffect(() => {
        const handler = (event: CustomEvent<{ id: string; data: any }>) => {
            const { id, data } = event.detail;
            close(id, data);
        };
        document.addEventListener(CLOSE_DIALOG_EVENT, handler as EventListener);

        return () => document.removeEventListener(CLOSE_DIALOG_EVENT, handler as EventListener);
    }, [close]);

    return (
        <DialogContext.Provider value={{ open, close, get, update, reset, subscribe, unsubscribe }}>
            {children}
            {dialogs?.map(({ dialog: Dialog, id, props }) => (
                <DialogWrapperContext.Provider key={id} value={{ id }}>
                    <dialog
                        ref={(node) => register(id, node)}
                        style={{
                            width: "100%",
                            height: "100%",
                            background: "none",
                            maxWidth: "none",
                            maxHeight: "none",
                        }}
                        {...props}
                    >
                        <Dialog />
                        {upperLayers?.map(({ layer: Layer, id }) => (
                            <UpperLayerContext.Provider key={id} value={{ id }}>
                                <Layer />
                            </UpperLayerContext.Provider>
                        ))}
                    </dialog>
                </DialogWrapperContext.Provider>
            ))}
        </DialogContext.Provider>
    );
};
