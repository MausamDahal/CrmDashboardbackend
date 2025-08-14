import { Associations } from "./associations";

export interface Order {
    id?: string;
    customFields?: Record<string, any>;
    associations: Associations;
}
