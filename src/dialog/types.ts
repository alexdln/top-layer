// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegisterArgs = { id: string; open: (data: any) => void; close: () => void };

export type RegisterDialog = ({ id, open, close }: RegisterArgs) => void;

export type DialogConfiguration<Data = unknown> = {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    open?: (data: Data) => Promise<any> | any;
    close?: () => void | Promise<void>;
    blockOverflow?: boolean;
};

export type DialogInfo<Data = unknown> = {
    node: HTMLDialogElement;
    configuration: DialogConfiguration<Data>;
    state: {
        opened: boolean;
    };
};
