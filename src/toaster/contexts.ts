/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";

import { type ToasterLayerConfiguration } from "./types";

export type ToastContextType = {
    hide(id: string): void;
    show(id: string, data: any, layers?: string[]): void;
};
export type RegisterToasterLayerContextType = {
    register(dialogConfiguration: ToasterLayerConfiguration): void;
    unregister(id: string): void;
    activate(id: string): void;
    deactivate(id: string): void;
};

export const ToasterLayerContext = createContext<ToastContextType>({
    hide: () => {},
    show: () => {},
});
export const RegisterToasterLayerContext = createContext<RegisterToasterLayerContextType>({
    register: () => {},
    unregister: () => {},
    activate: () => {},
    deactivate: () => {},
});
