import "./index.css";
import { withProviders } from "./providers";

const App = () => <></>;

const ProvidedApp: React.FC = withProviders(App);

export { ProvidedApp as App };
