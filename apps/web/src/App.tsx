import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

function App() {
  return <RouterProvider router={router} context={{}} />;
}

export default App;
