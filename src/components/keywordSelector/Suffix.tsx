import { useState } from "react";
import { useKeywords } from "../../contexts/keywordsContext";
import * as XLSX from 'xlsx';

export const Suffix = () => {
	const { suffixKeyword, addSuffixKeyword, removeSuffixKeyword } = useKeywords();
	const [beforeInput, setBeforeInput] = useState("");
	const [afterInput, setAfterInput] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleAddProducts = () => {
		if (beforeInput.trim() || afterInput.trim()) {
			addSuffixKeyword([beforeInput.trim(), afterInput.trim()]);
			setBeforeInput("");
			setAfterInput("");
		}
	};

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

				// Extrai a primeira e segunda colunas
				const columnsData = jsonData
					.map((row) => {
						const before = row[0] !== undefined ? row[0] : '';
						const after = row[1] !== undefined ? row[1] : '';
						return [before, after];
					})
					.filter((pair) => pair[0] !== '' || pair[1] !== '');


				columnsData.forEach(pairs => {
					addSuffixKeyword([pairs[0], pairs[1]]);
				})
			};
			reader.readAsArrayBuffer(selectedFile);
		} else {
			alert('Por favor, selecione um arquivo antes de importar.');
		}
	};

	return (
		<div className="keyword__container__form">
			<div className="keyword__container__form__table">
				<table className="keyword__container__form__table__list">
					<thead>
						<tr className="keyword__container__form__table__list__head">
							<th className="keyword__container__form__table__list__head__item">Antes</th>
							<th className="keyword__container__form__table__list__head__item">Depois</th>
							<th className="keyword__container__form__table__list__head__item">Ações</th>
						</tr>
					</thead>
					<tbody>
						{suffixKeyword?.map((suffix, index) => (
							<tr key={index} className="keyword__container__form__table__list__row">
								<td>{suffix[0]}</td>
								<td>{suffix[1]}</td>
								<td>
									<button onClick={() => removeSuffixKeyword(index)}>X</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="keyword__container__form__wrapper">
				<input
					onChange={(e) => setBeforeInput(e.currentTarget.value)}
					value={beforeInput}
					className="keyword__container__form__wrapper__input"
					name="before"
					type="text"
					placeholder="Antes"
				/>
				<input
					onChange={(e) => setAfterInput(e.currentTarget.value)}
					value={afterInput}
					className="keyword__container__form__wrapper__input--secondary"
					name="after"
					type="text"
					placeholder="Depois"
				/>
				<button
					onClick={handleAddProducts}
					className="keyword__container__form__wrapper__button"
				>
					Adicionar
				</button>
			</div>
			<div className="keyword__container__form__import">
				<input
					type="file"
					id="file"
					name="file"
					accept=".xlsx"
					className="keyword__container__form__import__file"
					onChange={handleFileChange}
				/>
				<button onClick={handleFileUpload} className="keyword__container__form__import__button">
					Importar
				</button>
			</div>
		</div>
	);
};

