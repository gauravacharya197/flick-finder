

import { Card } from "antd";
import { FaChartLine, FaUsers } from "react-icons/fa";
import AdminLayout from "./layout";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Total Users</h2>
            <p className="text-2xl font-bold">1,230</p>
          </div>
          <FaUsers className="text-4xl text-blue-500" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Revenue</h2>
            <p className="text-2xl font-bold">$12,500</p>
          </div>
          <FaChartLine className="text-4xl text-green-500" />
        </Card>
      </div>
    </>
  );
}
