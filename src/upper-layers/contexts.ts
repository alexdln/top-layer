import { createContext } from "react";

import {
    type UpperLayersContext as UpperLayersContextType,
    type UpperLayerContext as UpperLayerContextType,
} from "./types";

export const UpperLayersContext = createContext<UpperLayersContextType | Partial<UpperLayersContextType>>({});

export const UpperLayerContext = createContext<UpperLayerContextType | Partial<UpperLayerContextType>>({});
