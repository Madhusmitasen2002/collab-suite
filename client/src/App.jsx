import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardLayout from "./components/DahboardLayout";
import Workspace from "./pages/Workspace";
import TaskPage from "./pages/TaskPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/workspace" element={<DashboardLayout />}>
          <Route index element={<Workspace />} /> {/* Default workspace page */}
          <Route path=":id/tasks" element={<TaskPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
