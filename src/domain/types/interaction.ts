import { Associations } from "./associations";

export interface Interaction {
    id?: string;
    customFields?: Record<string, any>;
    associations: Associations;
}
