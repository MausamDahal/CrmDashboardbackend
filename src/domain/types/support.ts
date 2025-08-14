import { Associations } from "./associations";

export interface Support {
    id?: string;
    customFields?: Record<string, any>;
    associations: Associations;
}
