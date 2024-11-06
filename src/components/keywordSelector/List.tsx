import { useKeywords } from "../../contexts/keywordsContext";
import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import axios from "axios";

export const List = () => {

	const { productsKeyword, suffixKeyword } = useKeywords();
	const [combinations, setCombinations] = useState<string[]>([]);
	const [trendData, setTrendData] = useState<{ [key: string]: number | undefined }>({});

	const generateCombinations = () => {
		let newCombinations: string[] = [];

		productsKeyword.forEach(product => {
			suffixKeyword.forEach(([before, after]) => {
				const combination = `${before} ${product} ${after}`.trim();
				newCombinations.push(combination);
			});
		});

		setCombinations(newCombinations);
	};

	const fetchTrends = async (keyword: string) => {
		try {
			const response = await axios.get(`https://brunobackend.digitalltemporario.com.br/api/trends?keyword=${keyword}`);
			const averageWeekly = response.data.average;

			return averageWeekly;
		} catch (error) {
			console.error("Erro ao buscar dados de tendência:", error);
			return 0;
		}
	};

	useEffect(() => {
		const fetchAllDataSequentially = async () => {
			for (const combination of combinations) {
				const averageTrend = await fetchTrends(combination);
				setTrendData(prevData => ({ ...prevData, [combination]: averageTrend }));

			}
		};

		if (combinations.length > 0) {
			fetchAllDataSequentially();
		}
	}, [combinations]);

	const exportToExcel = () => {
		const dataForExcel = combinations.map(item => [
			item,
			typeof trendData[item] === 'number' ? trendData[item] === 0 ? "Sem dados." : trendData[item].toFixed(2) : "Carregando..."
		]);

		const worksheet = XLSX.utils.aoa_to_sheet([
			["Palavras-chave", "Interesse Brasileiro de Pesquisa"],
			...dataForExcel
		]);

		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Palavras-Chave");

		XLSX.writeFile(workbook, "palavras-chave_trend_data.xlsx");
	};

	useEffect(() => {
		generateCombinations();
	}, [productsKeyword, suffixKeyword]);

	return (
		<div className="keyword__container__form">
			<div className="keyword__container__form__table">
				<table className="keyword__container__form__table__list">
					<thead className="keyword__container__form__table__list__head">
						<tr>
							<th className="keyword__container__form__table__list__head__item">Palavras-chave</th>
							<th className="keyword__container__form__table__list__head__item">Interesse Brasileiro de Pesquisa</th>
						</tr>
					</thead>
					<tbody className="keyword__container__form__table__list__combinations">
						{combinations.map((combination, index) => (
							<tr key={index}>
								<td>{combination}</td>
								<td>
									{typeof trendData[combination] === 'number'
										? (trendData[combination] === 0 ? "Sem dados." : trendData[combination].toFixed(2))
										: "Carregando..."}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="keyword__container__form__wrapper">
				<button className="keyword__container__form__wrapper__submit" onClick={exportToExcel}>Exportar</button>
			</div>
		</div>
	);
};

