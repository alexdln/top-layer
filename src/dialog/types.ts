/* eslint-disable @typescript-eslint/no-explicit-any */
export type RegisterArgs<OpenData = any, CloseData = any> = {
    id: string;
    open: (data?: OpenData) => void;
    close: (data?: CloseData) => void;
};

export type RegisterDialog<OpenData = any, CloseData = any> = ({
    id,
    open,
    close,
}: RegisterArgs<OpenData, CloseData>) => void;

export type DialogConfiguration<OpenData = any, CloseData = any> = {
    id: string;
    open?: (data?: OpenData) => Promise<any> | any;
    close?: (data?: CloseData) => Promise<any> | any;
    blockOverflow?: boolean;
};

export type DialogInfo<OpenData = any, CloseData = any> = {
    node: HTMLDialogElement;
    configuration: DialogConfiguration<OpenData, CloseData>;
    state: {
        opened: boolean;
    };
};
