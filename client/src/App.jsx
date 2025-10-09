import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardLayout from "./components/DahboardLayout";
import Workspace from "./pages/Workspace";
import TaskPage from "./pages/TaskPage";
import Chat from "./pages/Chat";
import Docs from "./pages/Docs";
import DocumentEditor from "./pages/DocumentEditor";

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
          <Route path=":workspaceId/docs" element={<Docs />} />
          <Route path=":workspaceId/docs/:docId" element={<DocumentEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
