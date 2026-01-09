import {useQuery} from "@tanstack/react-query";
import {BACKEND} from "../App.tsx";
import { t } from "i18next";

export function ConnectivityCheck() {
	const { isPending, error, data } = useQuery({
		queryKey: ['ping'],
		queryFn: () =>
			BACKEND.ping.get().then(r => r.data),
	})

	return (
		<span className="select-none">
			Serververbinding:
				{(() => {
					if (isPending) return (
						<span className="ml-2 rounded border-dashed border-2 bg-orange-500 px-4 font-medium text-xl">
							{t("state_loading")}
						</span>
					)
					if (error || (data !== "pong")) return (
						<span className="ml-2 rounded border-dashed border-2 bg-red-500 px-4 font-medium text-xl">
							{t("state_error")}
						</span>
					)

					if (!error && (data == "pong")) return (
						<span className="ml-2 rounded border-dashed border-2 bg-green-500 px-4 font-medium text-xl">
							{t("state_ok")}
						</span>
					)})()}
		</span>
	)
}