import './index.css'

import ReactDOM from 'react-dom/client'
import { useEffect } from "react";
import main from "./core/main.ts";

function App() {
    useEffect(() => {
        main()
    }, [])

    return (
        <div id="pixi">
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
