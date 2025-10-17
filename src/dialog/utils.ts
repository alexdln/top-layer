import { CLOSE_DIALOG_EVENT, OPEN_DIALOG_EVENT } from "./constants";

export const openDialog = <OpenData = unknown>(id: string, data?: OpenData) => {
    const event = new CustomEvent(OPEN_DIALOG_EVENT, { detail: { id, data } });
    document.dispatchEvent(event);
};

export const closeDialog = <CloseData = unknown>(id: string, data?: CloseData) => {
    const event = new CustomEvent(CLOSE_DIALOG_EVENT, { detail: { id, data } });
    document.dispatchEvent(event);
};
