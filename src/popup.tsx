import ReactDOM from "react-dom/client";
import App from "./app";
import React from "react"


const container = document.getElementById('root') as HTMLDivElement;
const root = ReactDOM.createRoot(container);
root.render(
	<React.StrictMode>
		<App/>
	 </React.StrictMode>
);


console.log("From popup")