"use client";

import { useContext } from "react";

import { type ToasterLayerConfiguration } from "./types";
import { ToasterLayerContext, RegisterToasterLayerContext } from "./contexts";

export const useToasts = () => {
    const toaster = useContext(ToasterLayerContext);

    return {
        showToast: (id: string, data: unknown, layers?: string[]) => {
            toaster.show(id, data, layers);
        },
        hideToast: (id: string) => {
            toaster.hide(id);
        },
    };
};

export const useToastAction = (id: string) => {
    const toaster = useContext(ToasterLayerContext);

    return {
        openToaster: (data: unknown, layers: string[]) => {
            toaster.show(id, data, layers);
        },
        closeToaster: () => {
            toaster.hide(id);
        },
    };
};

export const useToasterRegister = (configuration: ToasterLayerConfiguration) => {
    const toasterLayerRegister = useContext(RegisterToasterLayerContext);

    return {
        register: () => {
            toasterLayerRegister.register(configuration);

            return () => {
                toasterLayerRegister.unregister(configuration.id);
            };
        },
    };
};

export const useToasterActivate = (id: string) => {
    const toasterLayerRegister = useContext(RegisterToasterLayerContext);

    return {
        activate: () => {
            toasterLayerRegister.activate(id);
        },
        deactivate: () => {
            toasterLayerRegister.deactivate(id);
        },
    };
};
