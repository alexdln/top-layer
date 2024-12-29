/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useRef } from "react";

import { DialogContext, RegisterDialogContext } from "./contexts";
import { DialogConfiguration, DialogInfo } from "./types";

export type DialogsProviderProps = {
    children: React.ReactNode;
    dialogs?: { dialog: React.FC; id: string }[];
};

export const DialogsProvider: React.FC<DialogsProviderProps> = ({ children, dialogs }) => {
    const dialogsStore = useRef<{ [id: string]: DialogInfo }>({});

    const register = useCallback((node: HTMLDialogElement, dialogConfiguration: DialogConfiguration) => {
        dialogsStore.current[dialogConfiguration.id] = {
            node,
            configuration: dialogConfiguration,
            state: { opened: false },
        };
    }, []);

    const unregister = useCallback((node: HTMLDialogElement) => {
        const nodeId = Object.keys(dialogsStore.current).find((key) => dialogsStore.current[key].node === node);
        if (nodeId) {
            delete dialogsStore.current[nodeId];
        }
    }, []);

    const remove = useCallback((id: string) => {
        delete dialogsStore.current[id];
    }, []);

    const close = useCallback((id: string) => {
        const dialog = dialogsStore.current[id];
        if (dialog) {
            dialog.state.opened = false;
            dialog.node.close();
            dialog.configuration.close?.();
        }
        if (
            Object.values(dialogsStore.current).every(
                (dialogItem) => !dialogItem.state.opened || !dialogItem.configuration.blockOverflow,
            )
        ) {
            document.body.classList.remove("overflow-hidden");
        }
    }, []);

    const open = useCallback(
        async (id: string, data: any) => {
            const dialog = dialogsStore.current[id];
            if (dialog) {
                dialog.state.opened = true;
                dialog.node.showModal();

                if (dialog.configuration.open) {
                    const openResult = await Promise.resolve(dialog.configuration.open(data));
                    if (openResult === false) {
                        return close(id);
                    }
                }

                if (dialog.configuration.blockOverflow) {
                    document.body.classList.add("overflow-hidden");
                }
            }
        },
        [close],
    );

    return (
        <RegisterDialogContext.Provider value={{ register, unregister, remove }}>
            <DialogContext.Provider value={{ open, close }}>
                {children}
                {dialogs?.map(({ dialog: Dialog, id }) => <Dialog key={id} />)}
            </DialogContext.Provider>
        </RegisterDialogContext.Provider>
    );
};
