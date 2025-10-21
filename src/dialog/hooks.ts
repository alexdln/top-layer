/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useContext } from "react";

import {
    DialogContext,
    DialogWrapperContext,
    DialogWrapperContextType,
    RegisterDialogContext,
    type DialogContextType,
    type RegisterDialogContextType,
} from "./contexts";
import { type DialogConfiguration } from "./types";

export const useCurrentDialogId = () => {
    const { id: currentDialogId } = useContext<DialogWrapperContextType>(DialogWrapperContext);
    return currentDialogId;
};

export const useDialogs = <OpenData = any, CloseData = any>() => {
    const currentDialogId = useCurrentDialogId();
    const dialog = useContext<DialogContextType<OpenData, CloseData>>(DialogContext);

    return {
        openDialog: (id?: string | null, data?: OpenData) => {
            const dialogId = id || currentDialogId;
            if (!dialogId) {
                console.error("Cannot detect dialog. Please use this hook inside a dialog or provide a dialog ID.");
                return;
            }
            dialog.open(dialogId, data);
        },
        closeDialog: (id?: string | null, data?: CloseData) => {
            const dialogId = id || currentDialogId;
            if (!dialogId) {
                console.error("Cannot detect dialog. Please use this hook inside a dialog or provide a dialog ID.");
                return;
            }
            dialog.close(dialogId, data);
        },
    };
};

export const useDialogAction = <OpenData = any, CloseData = any>(id?: string | null) => {
    const currentDialogId = useCurrentDialogId();
    const dialogId = id || currentDialogId;
    const dialog = useContext<DialogContextType<OpenData, CloseData>>(DialogContext);

    return {
        openDialog: (data?: OpenData) => {
            if (!dialogId) {
                console.error("Cannot detect dialog. Please use this hook inside a dialog or provide a dialog ID.");
                return;
            }
            dialog.open(dialogId, data);
        },
        closeDialog: (data?: CloseData) => {
            if (!dialogId) {
                console.error("Cannot detect dialog. Please use this hook inside a dialog or provide a dialog ID.");
                return;
            }
            dialog.close(dialogId, data);
        },
    };
};

export const useDialogRegister = <OpenData = any, CloseData = any>(
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
        remove: () => {
            dialogRegister.remove(configuration.id);
        },
        openDialog: (data?: OpenData) => {
            dialog.open(configuration.id, data);
        },
        closeDialog: (data?: CloseData) => {
            dialog.close(configuration.id, data);
        },
    };
};
