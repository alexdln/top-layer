export type RegisterArgs<OpenData = unknown, CloseData = unknown> = {
    id: string;
    open: (data?: OpenData) => void;
    close: (data?: CloseData) => void;
};

export type RegisterDialog<OpenData = unknown, CloseData = unknown> = ({
    id,
    open,
    close,
}: RegisterArgs<OpenData, CloseData>) => void;

export type DialogConfiguration<OpenData = unknown, CloseData = unknown> = {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    open?: (data?: OpenData) => Promise<any> | any;
    close?: (data?: CloseData) => void | Promise<void>;
    blockOverflow?: boolean;
};

export type DialogInfo<Data = unknown> = {
    node: HTMLDialogElement;
    configuration: DialogConfiguration<Data>;
    state: {
        opened: boolean;
    };
};
