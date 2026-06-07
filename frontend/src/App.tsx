import { WorkshopProvider } from "./contexts/WorkshopContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <WorkshopProvider>
      <AppRoutes />
    </WorkshopProvider>
  );
}

export default App;
