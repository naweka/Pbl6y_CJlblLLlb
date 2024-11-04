import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IndexPage } from "@/pages/IndexPage";
import { ROUTE_CONSTANTS } from "@/shared/config";
import { Layout } from "@/widgets/Layout";

const router = createBrowserRouter([
	{
		path: ROUTE_CONSTANTS.INDEX,
		element: <Layout />,
		children: [
			{
				index: true,
				lazy: IndexPage,
			},
		],
	},
]);

/**
 * @hoc Инициализация роутера
 */
const withRouter = () => () => {
	return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
};

export default withRouter;
