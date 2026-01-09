/**
 * Hier defineren we de context, daarin staat gedeelde "context" die relevant is voor de componenten in het beheerderspaneel.
 * Elk component kan de context benaderen.
 * **/
import * as React from "react";
import { createContext, useContext } from "react";
import { BACKEND } from "../../App.tsx";
import type { Treaty } from "@elysiajs/eden";

// https://react.dev/learn/passing-data-deeply-with-context
type Activity = Treaty.Data<typeof BACKEND.activities.get>[0];

// De structuur die de context aanhoudt.s
export type ContextPayload = {
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
};


export const Context = createContext<ContextPayload | null>(null)

export const useActivitiesContext = () => {
    const ctx = useContext(Context);
    if (!ctx) {
        throw new Error("useActivitiesContext must be used within Provider");
    }
    return ctx;
};


export default Context;

export const { Provider, Consumer } = Context;
