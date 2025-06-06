import { Associations } from "./associations";

export interface Customer {
    customFields: Record<string, any>;
    associations: Associations;
}
