import { KeywordSelector } from "./components/keywordSelector"
import { useKeywords } from "./contexts/keywordsContext"

function App() {
	const { suffixKeyword, productsKeyword } = useKeywords();

	return (
		<KeywordSelector.Root>
			<KeywordSelector.Products />
			<KeywordSelector.Suffix />
			{suffixKeyword.length > 0 && productsKeyword.length > 0 ? (<KeywordSelector.List />) : (<div></div>)}
		</KeywordSelector.Root>

	)
}

export default App
