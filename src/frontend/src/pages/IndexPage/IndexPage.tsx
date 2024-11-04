import { FC } from "react";
import { Header } from "./ui/Header";
import { Content } from "./ui/Content";

export const Component: FC = () => {
	return (
		<main className="flex flex-col flex-grow w-full max-w-layout mx-auto pt-3 gap-10">
			<Header />
			<Content />
		</main>
	)
};
