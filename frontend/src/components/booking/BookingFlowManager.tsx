import { useContext, useState } from "react";
import Context, { Provider } from "./Context.tsx";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { BACKEND } from "../../App.tsx";
import { useQuery } from "@tanstack/react-query";
import { Treaty } from "@elysiajs/eden";
import { Slideshow } from "../Slideshow.tsx";
import { ActivitiesList } from "./ActivitiesList.tsx";
import { ViewActivity } from "./ViewActivity.tsx";
import { LogIn } from "./LogIn.tsx";
import { RememberMail } from "./RememberMail.tsx";
import { PaymentMethod } from "./PaymentMethod.tsx";
import { Payment } from "./Payment.tsx";
import { PaymentStatus } from "./Paymentstatus.tsx";
import { Endpage } from "./EndPage.tsx";


// Bron: https://codesandbox.io/p/sandbox/react-multi-step-form-dyujr?file=%2Fsrc%2FMultiStepForm%2FMultiStepForm.jsx%3A16%2C30

const renderStep = (step: number) => {
	return (
		<>
			{(() => {
				switch (step) {
					case 0:
						return <Slideshow />;
					case 1:
						return <ActivitiesList />;
					case 2:
						return <ViewActivity />;
					case 3:
						return <LogIn />;
					case 4:
						return <RememberMail />;
					case 5:
						return <PaymentMethod />;
					case 6:
						return <Payment />;
					case 7:
						return <PaymentStatus />;
					case 8:
						return <Endpage />;
					default:
						return null;
				}
			})()}
		</>
	)
};

const BookingFlow = () => {
	const STEPS = 9; // Hoeveel stappen we hebben
	const [currentStep, setCurrentStep] = useState(0); // Dit is de huidige stap als opgeslagen in het manager-component. Deze wordt synchroon gehouden met de context.
	const [selectedActivity, selectActivity] = useState<Treaty.Data<typeof BACKEND.activities.get>[0] | null>(null); // Dit is de huidige stap als opgeslagen in het manager-component. Deze wordt synchroon gehouden met de context.
	const [selectedPaymentMethod, selectPaymentMethod] = useState<"PIN" | "CONTANT" | null>(null); // Dit is de huidige stap als opgeslagen in het manager-component. Deze wordt synchroon gehouden met de context.
	const [selectedPrice, selectPrice] = useState(1); // Dit is de huidige stap als opgeslagen in het manager-component. Deze wordt synchroon gehouden met de context.

	// Haal de activiteiten en slideshow alvast op (en stop in de gedeelde context). Scheelt laadtijd later.
	const activitiesQuery = useQuery<Treaty.Data<typeof BACKEND.activities.get>>({
		queryKey: ['activities'],
		queryFn: () =>
			BACKEND.activities.get().then(r => r.data as Treaty.Data<typeof BACKEND.activities.get>),
	})

	const slidesQuery = useQuery<Treaty.Data<typeof BACKEND.slideshow.get>>({
		queryKey: ['slides'],
		queryFn: () =>
			BACKEND.slideshow.get().then(r => r.data as Treaty.Data<typeof BACKEND.slideshow.get>),
	})

	useTranslation();
	if (activitiesQuery.isPending || slidesQuery.isPending) return 'Laden...'
	if (activitiesQuery.error || slidesQuery.error) return "Er is iets misgegaan!"


	const next = () => {
		if (currentStep === STEPS - 1) {
			// Naar volgende stap bij laatste stap -> terug naar stap 0
			setCurrentStep(0);
			return;
		} else setCurrentStep(currentStep + 1);
	};
	const prev = () => {
		if (currentStep == 0) {
			return
		}
		setCurrentStep(currentStep - 1)
	};

	return (
		<Provider value={{ currentStep, setCurrentStep, next, prev, activities: activitiesQuery.data ?? [], selectedActivity, selectActivity, slideshow: slidesQuery.data ?? [], selectedPaymentMethod, selectPaymentMethod, selectedPrice, selectPrice }}>
			<div className="bg-white/90 border-2 h-full border-black p-4 rounded-3xl select-none">
				{renderStep(currentStep) /* <---- Hier staat de stap content.*/}
			</div>
		</Provider>
	);
};
export default BookingFlow;

export function CancelButton() {
	const { setCurrentStep } = useContext(Context);

	return (
		<button className="inline-flex items-center hover:cursor-pointer py-3 px-5 bg-red-500  hover:bg-red-700 rounded-xl text-4xl text-white" onClick={() => setCurrentStep(0)}>
			{t("cancel")}
		</button>
	)
}
