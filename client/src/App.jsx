import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardLayout from "./components/DahboardLayout";
import Workspace from "./pages/Workspace";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
<Route path="/workspace" element={<DashboardLayout />}>
  <Route index element={<Workspace />} />
</Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
