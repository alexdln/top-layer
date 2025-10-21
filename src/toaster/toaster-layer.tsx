"use client";

import React, { useEffect, useState } from "react";

import { type Toast } from "./types";
import { useToasterRegister } from "./hooks";

export interface ToasterLayerProps {
    layerId?: string;
}

export const ToasterLayer: React.FC<ToasterLayerProps> = ({ layerId = "root" }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const { register } = useToasterRegister({
        id: layerId,
        showToast(id, toast) {
            setToasts((prev) => [...prev, { id, toast }]);
        },
        hideToast(id) {
            setToasts((prev) => prev.filter((el) => el.id !== id));
        },
        deactivate() {
            setToasts([]);
        },
        activate(toasts) {
            setToasts(toasts);
        },
    });

    useEffect(register);

    return (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {toasts.map(({ id, toast }) => (
                <li key={id}>{toast}</li>
            ))}
        </ul>
    );
};
