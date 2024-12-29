"use client";

import React, { useEffect, useState } from "react";

import { type Toast } from "./types";
import { useToasterRegister } from "./hooks";

export interface ToasterLayerProps {
    id?: string;
}

export const ToasterLayer: React.FC<ToasterLayerProps> = ({ id = "root" }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const { register } = useToasterRegister({
        id,
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
        <ul>
            {toasts.map(({ id, toast }) => (
                <li key={id}>{toast}</li>
            ))}
        </ul>
    );
};
