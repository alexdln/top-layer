import React from "react";

import { DialogsProvider, type DialogsProviderProps } from "./dialogs/provider";
import { UpperLayersProvider, type UpperLayersProviderProps } from "./upper-layers/provider";

export type TopLayerProviderProps = Partial<DialogsProviderProps> & Partial<UpperLayersProviderProps>;

export const TopLayerProvider: React.FC<TopLayerProviderProps> = ({ dialogs, upperLayers, children }) => {
    const UpperLayersWrapper = upperLayers?.length ? UpperLayersProvider : React.Fragment;
    const DialogsWrapper = dialogs?.length ? DialogsProvider : React.Fragment;

    return (
        <UpperLayersWrapper upperLayers={upperLayers}>
            <DialogsWrapper dialogs={dialogs} upperLayers={upperLayers}>
                {children}
            </DialogsWrapper>
        </UpperLayersWrapper>
    );
};
