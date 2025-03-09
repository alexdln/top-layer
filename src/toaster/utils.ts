import { HIDE_TOAST_EVENT, SHOW_TOAST_EVENT } from "./constants";

export const showToast = (id: string, data: unknown, layers?: string[]) => {
    const event = new CustomEvent(SHOW_TOAST_EVENT, { detail: { id, data, layers } });
    document.dispatchEvent(event);
};

export const hideToast = (id: string) => {
    const event = new CustomEvent(HIDE_TOAST_EVENT, { detail: { id } });
    document.dispatchEvent(event);
};
