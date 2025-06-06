import { Associations } from "./associations";

export interface Payment {
    id?: string;
    customFields?: Record<string, any>;
    associations: Associations;
}
