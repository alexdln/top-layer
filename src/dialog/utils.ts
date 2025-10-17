/* eslint-disable @typescript-eslint/no-explicit-any */
import { CLOSE_DIALOG_EVENT, OPEN_DIALOG_EVENT } from "./constants";

export const openDialog = <OpenData = any>(id: string, data?: OpenData) => {
    const event = new CustomEvent(OPEN_DIALOG_EVENT, { detail: { id, data } });
    document.dispatchEvent(event);
};

export const closeDialog = <CloseData = any>(id: string, data?: CloseData) => {
    const event = new CustomEvent(CLOSE_DIALOG_EVENT, { detail: { id, data } });
    document.dispatchEvent(event);
};
