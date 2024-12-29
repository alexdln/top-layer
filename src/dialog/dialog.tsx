"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { type DialogConfiguration } from "./types";
import { useToasterActivate } from "../toaster/hooks";
import { useDialogRegister } from "./hooks";
import { ToasterLayer } from "../toaster/toaster-layer";

export interface DialogProps extends React.HTMLAttributes<HTMLDialogElement> {
    onOpen?: DialogConfiguration<any>["open"];
    onClose?: DialogConfiguration<any>["close"];
    id: string;
    blockOverflow?: boolean;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ id, onClose, onOpen, blockOverflow, children, ...props }) => {
    const { activate, deactivate } = useToasterActivate(id);
    const openHandler = (data: any) => {
        activate();
        if (onOpen) {
            return onOpen(data);
        }
    };

    const closeHandler = () => {
        deactivate();
        if (onClose) {
            return onClose();
        }
    };

    const { register } = useDialogRegister({
        open: openHandler,
        close: closeHandler,
        id,
        blockOverflow,
    });

    return (
        <dialog id={id} ref={register} {...props}>
            {children}
            <ToasterLayer id={id} />
        </dialog>
    );
};
