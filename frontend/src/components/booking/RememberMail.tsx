import "../../index.css";
import {useContext} from "react";
import Context from "./Context.tsx";
import {Header} from "../KleineDingetjes.tsx";
import { Icon } from "@iconify/react";
import {CancelButton} from "./BookingFlowManager.tsx";


export function RememberMail() {
    const context = useContext(Context);

    return (
        <div className="flex flex-col gap-3 h-full">
            <Header>
            <span
                className="select-none rounded-t-lg bg-green-600 px-8 mb-1 font-semibold text-5xl text-white">
              Mail
            </span>
            </Header>
            <div className="flex-1 overflow-auto">
                <div className="w-full h-full overflow-auto flex flex-col justify-center items-center bg-white shadow-md rounded-lg">
                        <h1 className="text-5xl font-bold mb-10 mt-5">
                            Mail onthouden?
                        </h1>

                            <Icon className="mt-5  cursor-pointer" icon="streamline-sharp:mail-loading-remix" width="300" height="300"/>

                        <h1 className="text-2xl  mt-10">
                            Hierdoor krijgt u updates over de activiteiten die u specifiek geboekt heeft
                        </h1>
                        
                </div>

                

            </div>
            <div className="flex">
                <CancelButton/> 
                <div>
                    <button>
                        <Icon onClick={context.next} className="mt-5  cursor-pointer ml-200" icon="material-symbols:check" width="100" height="100"/>
                    </button>

                    <button>
                        <Icon onClick={context.next} className="mt-5  cursor-pointer ml-5" icon="material-symbols:cancel-outline" width="100" height="100"/>
                    </button>
                </div>
            </div>
        </div>
    );
}
