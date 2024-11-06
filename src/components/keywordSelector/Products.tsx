import { useState } from "react";
import { useKeywords } from "../../contexts/keywordsContext"
import * as XLSX from 'xlsx';

export const Products = () => {
	const { productsKeyword, addProductsKeyword, removeProductsKeyword } = useKeywords();
	const [inputKeywords, setInputKeywords] = useState<string>("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleAddProducts = () => {
		addProductsKeyword(inputKeywords);
		setInputKeywords("");
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setSelectedFile(file);
	};

	const handleFileUpload = () => {
		if (selectedFile) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const data = new Uint8Array(event.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: 'array' });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
				jsonData.forEach(row => {
					addProductsKeyword(row[0])
					console.log(productsKeyword)
				})

			};

			reader.readAsArrayBuffer(selectedFile);
		} else {
			alert('Por favor, selecione um arquivo antes de importar.');
		}
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleAddProducts()
		}
	}

	return (
		<div className="keyword__container__form">
			<div className="keyword__container__form__table">
				<table className="keyword__container__form__table__list">
					<thead>
						<tr className="keyword__container__form__table__list__head">
							<th className="keyword__container__form__table__list__head__item">Produtos/Serviços</th>
							<th className="keyword__container__form__table__list__head__item">Ações</th>
						</tr>
					</thead>
					<tbody>
						{productsKeyword?.map((product, index) => (
							<tr key={index} className="keyword__container__form__table__list__row">
								<td>{product}</td>
								<td><button onClick={() => removeProductsKeyword(index)}>X</button></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="keyword__container__form__wrapper">
				<input onInput={(e) => setInputKeywords(e.currentTarget.value)} value={inputKeywords} className="keyword__container__form__wrapper__input" name="products" type="text" placeholder="..." onKeyDown={handleKeyPress} />
				<button onClick={handleAddProducts} className="keyword__container__form__wrapper__button">Adicionar</button>
			</div>
			<div className="keyword__container__form__import">
				<input type="file" id="file" name="file" accept=".xlsx" className="keyword__container__form__import__file" onChange={handleFileChange} />
				<button className="keyword__container__form__import__button" onClick={handleFileUpload}>Importar</button>
			</div>
		</div>
	)
}
