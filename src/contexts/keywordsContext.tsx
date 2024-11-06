import { createContext, ReactNode, useContext, useState } from "react"

type SuffixKeywordType = [string, string][]

type KeywordsContextType = {
	productsKeyword: string[]
	addProductsKeyword: (keyword: string) => void
	removeProductsKeyword: (deleteIndex: number) => void
	suffixKeyword: SuffixKeywordType
	addSuffixKeyword: (keyword: [string, string]) => void
	removeSuffixKeyword: (deleteIndex: number) => void
}

const KeywordsContext = createContext<KeywordsContextType | undefined>(undefined);

interface KeywordsProviderProps {
	children: ReactNode;
}

export const KeywordsProvider: React.FC<KeywordsProviderProps> = ({ children }) => {
	const [productsKeyword, setProductsKeyword] = useState<string[]>([]);
	const [suffixKeyword, setSuffixKeyword] = useState<SuffixKeywordType>([]);

	const addSuffixKeyword = (keyword: [string, string]) => {
		setSuffixKeyword((prevKeywords) => [...prevKeywords, keyword])
	}

	const addProductsKeyword = (keyword: string) => {
		setProductsKeyword((prevKeywords) => [...prevKeywords, keyword]);
	}

	const removeProductsKeyword = (deleteIndex: number) => {
		const filteredProducts = productsKeyword.filter((_product, index) => index !== deleteIndex);
		setProductsKeyword(filteredProducts);
	}
	const removeSuffixKeyword = (deleteIndex: number) => {
		const filteredSuffix = suffixKeyword.filter((_suffix, index) => index !== deleteIndex);
		setSuffixKeyword(filteredSuffix);
	}

	return (
		<KeywordsContext.Provider value={{ productsKeyword, addProductsKeyword, removeProductsKeyword, addSuffixKeyword, suffixKeyword, removeSuffixKeyword }}>
			{children}
		</KeywordsContext.Provider>
	)
}


export const useKeywords = (): KeywordsContextType => {
	const context = useContext(KeywordsContext);

	if (!context) {
		throw new Error('useKeywords must be used within a Keywords')
	}

	return context;
}
