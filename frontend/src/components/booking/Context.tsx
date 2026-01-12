/**
 * Hier defineren we de context, daarin staat gedeelde "context" die relevant is voor elke stap in het boekingsproces.
 * Elk component kan de context benaderen.
 * **/
import { createContext } from "react";
import { BACKEND } from "../../App.tsx";
import type { Treaty } from "@elysiajs/eden";

// https://react.dev/learn/passing-data-deeply-with-context

// De structuur die de context aanhoudt.
type ContextPayload = {
	refetchData: () => void;
	clearPreviousSession: () => void;
	currentStep: number;
	setCurrentStep: (step: number) => void;
	next: () => void;
	prev: () => void;
	activities?: Treaty.Data<typeof BACKEND.activities.get>;
	selectedActivity: Treaty.Data<typeof BACKEND.activities.get>[0] | null;
	selectActivity: (activity: Treaty.Data<typeof BACKEND.activities.get>[0]) => void;
	selectedPaymentMethod?: "PIN" | "CONTANT" | null;
	selectPaymentMethod: (paymentMethod: "PIN" | "CONTANT" | null) => void;
	selectedPrice?: number;
	selectPrice: (amount: number) => void;
	slideshow?: Treaty.Data<typeof BACKEND.slideshow.get>;
	selectSlot: (activity: Treaty.Data<typeof BACKEND.slots.get>[0]) => void;
	selectedSlot: Treaty.Data<typeof BACKEND.slots.get>[0] | null,
	selectedAmount: number;
	selectAmount: (amount: number) => void;
	selectedCampingSpot?: number;
	selectCampingSpot: (spot: number) => void;
};


export const Context = createContext<ContextPayload>({
	refetchData: () => {},
	clearPreviousSession: () => {},
	currentStep: undefined!,
	setCurrentStep: () => {},
	next: () => {},
	prev: () => {},
	activities: undefined!,
	slideshow: undefined!,
	selectedActivity: undefined!,
	selectedPaymentMethod: undefined!,
	selectPaymentMethod: () => {},
	selectActivity: () => {},
	selectPrice: () => {},
	selectedPrice: undefined!,
	selectedSlot: undefined!,
	selectSlot: () => {},
	selectedAmount: undefined!,
	selectAmount: () => {},
	selectedCampingSpot: undefined!,
	selectCampingSpot: () => {},
});


export default Context;

export const { Provider, Consumer } = Context;
