import { createContext } from "react";
import { DialogConfiguration } from "./types";

export type DialogContextType<OpenData = unknown, CloseData = unknown> = {
    open(id: string, data?: OpenData): void;
    close(id: string, data?: CloseData): void;
};

export type RegisterDialogContextType<OpenData = unknown, CloseData = unknown> = {
    register(node: HTMLDialogElement, dialogConfiguration: DialogConfiguration<OpenData, CloseData>): void;
    unregister(node: HTMLDialogElement): void;
    remove(id: string): void;
};

export const DialogContext = createContext<DialogContextType>({ open: () => {}, close: () => {} });
export const RegisterDialogContext = createContext<RegisterDialogContextType>({
    register: () => {},
    unregister: () => {},
    remove: () => {},
});
