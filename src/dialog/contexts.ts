/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import { DialogConfiguration } from "./types";

export type DialogContextType = { open(id: string, data: any): void; close(id: string): void };

export type RegisterDialogContextType = {
    register(node: HTMLDialogElement, dialogConfiguration: DialogConfiguration<any>): void;
    unregister(node: HTMLDialogElement): void;
    remove(id: string): void;
};

export const DialogContext = createContext<DialogContextType>({ open: () => {}, close: () => {} });
export const RegisterDialogContext = createContext<RegisterDialogContextType>({
    register: () => {},
    unregister: () => {},
    remove: () => {},
});
