export type ToasterLayerConfiguration = {
    id: string;
    activate: (toasts: Toast[]) => void;
    deactivate: () => void;
    showToast: (id: string, toast: React.ReactNode) => void;
    hideToast: (id: string) => void;
};

export type Toast = {
    id: string;
    toast: React.ReactNode;
};

export type StoredToast = {
    id: string;
    toast: React.ReactNode;
    layers?: string[];
};
