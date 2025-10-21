"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { type DialogConfiguration } from "./types";
import { useToasterActivate } from "../toaster/hooks";
import { useCurrentDialogId, useDialogRegister } from "./hooks";
import { ToasterLayer } from "../toaster/toaster-layer";

export interface DialogProps extends React.HTMLAttributes<HTMLDialogElement> {
    onOpen?: DialogConfiguration["open"];
    onClose?: DialogConfiguration["close"];
    blockOverflow?: boolean;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ id, onClose, onOpen, blockOverflow, children, ...props }) => {
    const currentDialogId = useCurrentDialogId();
    const dialogId = id || currentDialogId;
    const { activate, deactivate } = useToasterActivate(dialogId || "");
    const openHandler = (data: any) => {
        activate();
        if (onOpen) {
            return onOpen(data);
        }
    };

    const closeHandler = (data?: any) => {
        deactivate();
        if (onClose) {
            return onClose(data);
        }
    };

    const { register } = useDialogRegister({
        open: openHandler,
        close: closeHandler,
        id: dialogId || "",
        blockOverflow,
    });
    if (!dialogId) {
        console.error(
            "Cannot detect dialog id. Please provide this component inside a provider or provide a dialog ID.",
        );
        return null;
    }
    if (id && currentDialogId && currentDialogId !== id && process?.env?.NODE_ENV === "development") {
        console.warn(
            "The provided dialog ID does not match the current dialog ID. Please make sure it is correct. This warning will be shown only in development mode.",
        );
    }

    return (
        <dialog id={dialogId} ref={register} {...props}>
            {children}
            <ToasterLayer layerId={dialogId} />
        </dialog>
    );
};
