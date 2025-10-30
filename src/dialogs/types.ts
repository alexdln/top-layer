export type DialogContext = {
    open<T = unknown>(id: string, data?: T): void;
    close<T = unknown>(id: string, data?: T): void;
    get<T = unknown>(id: string): T;
    update<T = unknown>(id: string, data: T | ((prevData: T) => T)): void;
    reset(id: string): void;
    subscribe(id: string, callback: (data: unknown) => void): () => void;
    unsubscribe(id: string, callback: (data: unknown) => void): void;
};

export type DialogWrapperContext = {
    id?: string | null;
};
