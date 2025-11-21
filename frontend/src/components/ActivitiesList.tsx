import "../index.css";

export function ActivitiesList() {
	return (
            <div className="flex flex-col bg-white shadow-md rounded-lg p-6 w-96">
                <ul>
                    <li className="mb-4">
                        <h3 className="text-xl font-semibold">tekst...</h3>
                        <p className="text-gray-600">tekst...</p>
                    </li>
                </ul>
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-20 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Meer info</button>
            </div>
	)
}