import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App, Footer} from './App.tsx'

createRoot(document.getElementById('app-body')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



createRoot(document.getElementById('app-foot')!).render(
	<StrictMode>
		<Footer />
	</StrictMode>,
)
