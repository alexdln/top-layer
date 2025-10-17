"use client";

import { useContext } from "react";

import {
    DialogContext,
    RegisterDialogContext,
    type DialogContextType,
    type RegisterDialogContextType,
} from "./contexts";
import { type DialogConfiguration } from "./types";

export const useDialogs = <OpenData = unknown, CloseData = unknown>() => {
    const dialog = useContext<DialogContextType<OpenData, CloseData>>(DialogContext);

    return {
        openDialog: (id: string, data?: OpenData) => {
            dialog.open(id, data);
        },
        closeDialog: (id: string, data?: CloseData) => {
            dialog.close(id, data);
        },
    };
};

export const useDialogAction = <OpenData = unknown, CloseData = unknown>(id: string) => {
    const dialog = useContext<DialogContextType<OpenData, CloseData>>(DialogContext);

    return {
        openDialog: (data?: OpenData) => {
            dialog.open(id, data);
        },
        closeDialog: (data?: CloseData) => {
            dialog.close(id, data);
        },
    };
};

export const useDialogRegister = <OpenData = unknown, CloseData = unknown>(
    configuration: DialogConfiguration<OpenData, CloseData>,
) => {
    const dialogRegister = useContext<RegisterDialogContextType<OpenData, CloseData>>(RegisterDialogContext);
    const dialog = useContext<DialogContextType<OpenData, CloseData>>(DialogContext);

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
        openDialog: (data?: OpenData) => {
            dialog.open(configuration.id, data);
        },
        closeDialog: (data?: CloseData) => {
            dialog.close(configuration.id, data);
        },
    };
};
