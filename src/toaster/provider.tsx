/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useRef } from "react";

import { type StoredToast, type ToasterLayerConfiguration } from "./types";
import { ToasterLayerContext, RegisterToasterLayerContext } from "./contexts";
import { ToasterLayer } from "./toaster-layer";
import { HIDE_TOAST_EVENT, SHOW_TOAST_EVENT } from "./constants";

export type ToasterProviderProps = {
    children: React.ReactNode;
    toast: React.FC<any>;
};

export const ToasterProvider: React.FC<ToasterProviderProps> = ({ children, toast: Toast }) => {
    const toasterLayers = useRef<{ [id: string]: ToasterLayerConfiguration }>({});
    const toastsStore = useRef<StoredToast[]>([]);

    const register = useCallback((configuration: ToasterLayerConfiguration) => {
        toasterLayers.current[configuration.id] = configuration;
    }, []);

    const unregister = useCallback((id: string) => {
        delete toasterLayers.current[id];
    }, []);

    const activate = useCallback(async (id: string) => {
        toasterLayers.current[id].activate(toastsStore.current.filter((el) => !el.layers || el.layers.includes(id)));
    }, []);

    const deactivate = useCallback(async (id: string) => {
        toastsStore.current = toastsStore.current.filter(
            (toast) => !toast.layers || toast.layers.length !== 1 || toast.layers[0] !== id,
        );
        toasterLayers.current[id].deactivate();
    }, []);

    const hide = useCallback((id: string) => {
        const toastIndex = toastsStore.current.findIndex((toast) => toast.id === id);
        if (toastIndex !== -1) {
            const [toast] = toastsStore.current.splice(toastIndex, 1);
            if (toast.layers) {
                toast.layers.forEach((layer) => {
                    toasterLayers.current[layer].hideToast(id);
                });
            } else {
                Object.values(toasterLayers.current).forEach((layer) => {
                    layer.hideToast(id);
                });
            }
        }
    }, []);

    const show = useCallback(
        async (id: string, data: any, layers?: string[]) => {
            const toast = <Toast closeHandler={() => hide(id)} {...data} />;

            const prevToastIndex = toastsStore.current.findIndex((toast) => toast.id === id);
            if (prevToastIndex !== -1) {
                toastsStore.current.splice(prevToastIndex, 1);
            }

            toastsStore.current.push({ id, toast, layers });
            if (layers) {
                layers.forEach((layer) => {
                    toasterLayers.current[layer].hideToast(id);
                    toasterLayers.current[layer].showToast(id, toast);
                });
            } else {
                Object.values(toasterLayers.current).forEach((layer) => {
                    layer.hideToast(id);
                    layer.showToast(id, toast);
                });
            }
        },
        [Toast, hide],
    );

    useEffect(() => {
        const handler = (event: CustomEvent<{ id: string; data: any; layers?: string[] }>) => {
            const { id, data, layers } = event.detail;
            show(id, data, layers);
        };

        document.addEventListener(SHOW_TOAST_EVENT, handler as EventListener);

        return () => document.removeEventListener(SHOW_TOAST_EVENT, handler as EventListener);
    }, [show]);

    useEffect(() => {
        const handler = (event: CustomEvent<{ id: string }>) => {
            const { id } = event.detail;
            hide(id);
        };

        document.addEventListener(HIDE_TOAST_EVENT, handler as EventListener);

        return () => document.removeEventListener(HIDE_TOAST_EVENT, handler as EventListener);
    }, [hide]);

    return (
        <RegisterToasterLayerContext.Provider value={{ register, unregister, activate, deactivate }}>
            <ToasterLayerContext.Provider value={{ hide, show }}>
                {children}
                <ToasterLayer layerId="root" />
            </ToasterLayerContext.Provider>
        </RegisterToasterLayerContext.Provider>
    );
};
