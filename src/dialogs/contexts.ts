import { createContext } from "react";

import {
    type DialogContext as DialogContextType,
    type DialogWrapperContext as DialogWrapperContextType,
} from "./types";

export const DialogContext = createContext<DialogContextType | Partial<DialogContextType>>({});
export const DialogWrapperContext = createContext<DialogWrapperContextType | Partial<DialogWrapperContextType>>({});
