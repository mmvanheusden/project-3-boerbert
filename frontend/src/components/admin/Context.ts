/**
 * Hier defineren we de context, daarin staat gedeelde "context" die relevant is voor de componenten in het beheerderspaneel.
 * Elk component kan de context benaderen.
 * **/
import { createContext } from "react";
import {BACKEND} from "../../App.tsx";
import type {Treaty} from "@elysiajs/eden";

// https://react.dev/learn/passing-data-deeply-with-context

// De structuur die de context aanhoudt.
type ContextPayload = {
    activities?: Treaty.Data<typeof BACKEND.activities.get>;
};


export const Context = createContext<ContextPayload>({
    activities: undefined!,
});


export default Context;

export const { Provider, Consumer } = Context;
