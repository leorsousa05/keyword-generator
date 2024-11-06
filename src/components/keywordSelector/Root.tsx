import { ReactNode } from "react";

interface ContentProps {
	children: ReactNode;
}

export const Root = ({ children }: ContentProps) => {
	return (
		<div className="keyword">
			<div className="keyword__container">
				{children}
			</div>
		</div>
	)
}
