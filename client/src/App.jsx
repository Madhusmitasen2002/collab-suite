import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardLayout from "./components/DahboardLayout";
import Workspace from "./pages/Workspace";
import TaskPage from "./pages/TaskPage";
import Chat from "./pages/Chat";

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
          <Route index element={<Workspace />} />
          <Route path=":workspaceId/tasks" element={<TaskPage />} />
          <Route path=":workspaceId/chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
