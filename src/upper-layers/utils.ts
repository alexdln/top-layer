import { RESET_UPPER_LAYER_DATA_EVENT, UPDATE_UPPER_LAYER_DATA_EVENT } from "./constants";

export const updateUpperLayerData = (id: string, state: unknown | ((prevState: unknown) => unknown)) => {
    const event = new CustomEvent(UPDATE_UPPER_LAYER_DATA_EVENT, { detail: { id, state } });
    document.dispatchEvent(event);
};

export const resetUpperLayerData = (id: string) => {
    const event = new CustomEvent(RESET_UPPER_LAYER_DATA_EVENT, { detail: { id } });
    document.dispatchEvent(event);
};
