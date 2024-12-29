"use client";

import { useContext } from "react";

import { DialogContext, RegisterDialogContext } from "./contexts";
import { DialogConfiguration } from "./types";

export const useDialogs = () => {
    const dialog = useContext(DialogContext);

    return {
        openDialog: (id: string, data: unknown) => {
            dialog.open(id, data);
        },
        closeDialog: (id: string) => {
            dialog.close(id);
        },
    };
};

export const useDialogAction = (id: string) => {
    const dialog = useContext(DialogContext);

    return {
        openDialog: (data: unknown) => {
            dialog.open(id, data);
        },
        closeDialog: () => {
            dialog.close(id);
        },
    };
};

export const useDialogRegister = <Data = unknown>(configuration: DialogConfiguration<Data>) => {
    const dialogRegister = useContext(RegisterDialogContext);
    const dialog = useContext(DialogContext);

    return {
        register: (node: HTMLDialogElement | null) => {
            if (!node) return;

            dialogRegister.register(node, configuration);

            return () => {
                dialogRegister.unregister(node);
            };
        },
        remove: (id: string) => {
            dialogRegister.remove(id);
        },
        openDialog: (data: Data) => {
            dialog.open(configuration.id, data);
        },
        closeDialog: () => {
            dialog.close(configuration.id);
        },
    };
};
