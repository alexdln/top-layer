/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";

import { type DialogConfiguration } from "./types";

export type DialogContextType<OpenData = any, CloseData = any> = {
    open(id: string, data?: OpenData): void;
    close(id: string, data?: CloseData): void;
};

export type RegisterDialogContextType<OpenData = any, CloseData = any> = {
    register(node: HTMLDialogElement, dialogConfiguration: DialogConfiguration<OpenData, CloseData>): void;
    unregister(node: HTMLDialogElement): void;
    remove(id: string): void;
};

export type DialogWrapperContextType = {
    id?: string | null;
};

export const DialogContext = createContext<DialogContextType>({ open: () => {}, close: () => {} });
export const RegisterDialogContext = createContext<RegisterDialogContextType>({
    register: () => {},
    unregister: () => {},
    remove: () => {},
});
export const DialogWrapperContext = createContext<DialogWrapperContextType>({});
