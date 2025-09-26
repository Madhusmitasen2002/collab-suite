import { useEffect, useState } from "react";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/workspace");
        setWorkspaces(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Good Morning, John 👋</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Projects" value={workspaces.length} />
        <StatCard title="Active Tasks" value="147" />
        <StatCard title="Team Members" value="32" />
        <StatCard title="Completion Rate" value="87%" />
      </div>

      <h2 className="text-xl font-semibold mb-2">Recent Projects</h2>
      <div className="space-y-2">
        {workspaces.map((ws) => (
          <div key={ws.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{ws.name}</h3>
            <p className="text-sm text-gray-500">Created by {ws.created_by}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
