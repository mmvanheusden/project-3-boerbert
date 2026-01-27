import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {EvilHeader} from "../KleineDingetjes.tsx";
import {t} from "i18next";
import useFirstRender, {BACKEND} from "../../App.tsx";

export function Evil() {
	const context = useContext(Context);
	const laugh = new Audio("Evil Laugh.mp3");

	useFirstRender(async () => {
		await laugh.play();
	})

	return (<div className="bg-gray-900/90 border-2 h-full border-gray-800 p-4 rounded-3xl select-none">
			<div className="flex flex-col gap-3 h-full">
				<style>{`
                body {
                    background: url(/evil.jpg); !important
                }
                
                .bg-white/90 {
                    background: gray; !important
                }
                `}
				</style>
				<EvilHeader>
            <span
	            className="select-none rounded-t-lg bg-red-600 px-4 md:px-8 mb-1 font-semibold text-3xl md:text-5xl text-white">
              Betaal met je bloed en ziel!!👿
            </span>
				</EvilHeader>
				<div className="flex-1 overflow-auto ">
					<div
						className="w-full h-full overflow-auto flex flex-col justify-start items-center bg-black shadow-md rounded-lg p-4">

						<div className="text-red-600 text-2xl md:text-5xl mt-5 md:mt-10 text-center">
							Niet genoeg geld om voor de activieteit te betalen?
						</div>
						<div className="text-red-600 text-2xl md:text-5xl mt-3 md:mt-5 mb-6 md:mb-10 text-center">
							Geen probleem! Je ziel is ook een valuta😈
						</div>
						<div className="">
							<img src="./evilbert.png" className="w-48 h-64 md:w-260 md:h-300"/>
						</div>

					</div>
				</div>
				<div className="flex flex-col md:flex-row justify-evenly gap-4 md:gap-8 md:h-40">
					<button
						className="ml-0 md:ml-2 w-full text-3xl md:text-7xl rounded-2xl cursor-pointer px-4 py-6 md:py-0 font-medium hover:ring-2 bg-orange-600"
						onClick={async () => {
							const Kidz = new Audio("Jeh_toch.mp3");
							await Kidz.play();
							context.setCurrentStep(4);
						}}>
						Nee ben te bang papi🙉
					</button>
					<button
						className="ml-0 md:ml-2 w-full text-3xl md:text-7xl rounded-2xl cursor-pointer px-4 py-6 md:py-0 font-medium hover:ring-2 bg-red-600"
						onClick={async () => {
							await BACKEND.bookings.put({
								slotId: context.selectedSlot!.id,
								amount: context.selectedAmount,
								campingSpot: context.selectedCampingSpot,
							})
							context.setCurrentStep(9)
						}}>
						Betalen😈😈
					</button>
				</div>

			</div>
		</div>

	);
}






