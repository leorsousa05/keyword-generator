import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./assets/styles/main.scss";
import { KeywordsProvider } from './contexts/keywordsContext.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<KeywordsProvider>
			<App />
		</KeywordsProvider>
	</StrictMode>,
)
