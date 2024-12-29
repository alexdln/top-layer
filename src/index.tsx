import React from "react";

import { ToasterProvider, type ToasterProviderProps } from "./toaster/provider";
import { DialogsProvider, type DialogsProviderProps } from "./dialog/provider";

export type TopLayerProviderProps = ToasterProviderProps & DialogsProviderProps;

export const TopLayerProvider: React.FC<TopLayerProviderProps> = ({ toast, dialogs, children }) => (
    <ToasterProvider toast={toast}>
        <DialogsProvider dialogs={dialogs}>{children}</DialogsProvider>
    </ToasterProvider>
);
