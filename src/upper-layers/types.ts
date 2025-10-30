export type UpperLayerContext = {
    id: string;
};

export type UpperLayersContext = {
    get: <T = unknown>(id: string) => T;
    update: <T = unknown>(id: string, state: T | ((prevState: T) => T)) => void;
    reset: (id: string) => void;
    subscribe: (id: string, callback: (data: unknown) => void) => () => void;
    unsubscribe: (id: string, callback: (data: unknown) => void) => void;
};
