import { CLOSE_DIALOG_EVENT, OPEN_DIALOG_EVENT } from "./constants";

export const openDialog = (id: string, data: unknown) => {
    const event = new CustomEvent(OPEN_DIALOG_EVENT, { detail: { id, data } });
    document.dispatchEvent(event);
};

export const closeDialog = (id: string) => {
    const event = new CustomEvent(CLOSE_DIALOG_EVENT, { detail: { id } });
    document.dispatchEvent(event);
};
