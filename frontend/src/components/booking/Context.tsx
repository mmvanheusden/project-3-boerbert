/**
 * Hier defineren we de context, daarin staat gedeelde "context" die relevant is voor elke stap in het boekingsproces.
 * Elk component kan de context benaderen.
 * **/
import { createContext } from "react";
import {BACKEND} from "../../App.tsx";
import type {Treaty} from "@elysiajs/eden";

// https://react.dev/learn/passing-data-deeply-with-context

// De structuur die de context aanhoudt.
type ContextPayload = {
	currentStep: number;
	setCurrentStep: (step: number) => void;
	next: () => void;
	prev: () => void;
	availableActivities?: Treaty.Data<typeof BACKEND.activities.get>;
};


export const Context = createContext<ContextPayload>({
	currentStep: undefined!,
	setCurrentStep: () => {},
	next: () => {},
	prev: () => {},
	availableActivities: undefined!,
});


export default Context;

export const { Provider, Consumer } = Context;
