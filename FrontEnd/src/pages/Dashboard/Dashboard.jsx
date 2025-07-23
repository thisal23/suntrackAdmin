import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ChevronRight, User, Settings, Edit, Trash2, Plus, Eye } from "lucide-react";
import NavBar from "../../components/NavBar/NavBar";
import apiService from "../../config/axiosConfig";

const Dashboard = () => {
  const [registrationData, setRegistrationData] = useState([]);
  const [totalRegistrationData, setTotalRegistrationData] = useState({});
  const [adminActivities, setAdminActivities] = useState([]);
  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'
  const [timeRange, setTimeRange] = useState('7days'); // '7days', '30days', '90days'
  const [recentUsers, setRecentUsers] = useState([]);

  // Sample data for fleet manager registrations - replace with actual API calls
  const fetchRegistrationData = async () => {
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
  
    try {
      const response = await apiService.get(`/fleet-manager-registrations?days=${days}`);
      const data = response.data;
  
      return data.map(item => {
        const date = new Date(item.date);
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: item.date,
          registrations: parseInt(item.registrations)
        };
      });
    } catch (error) {
      console.error('Error fetching registration data:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.get('/registration-stats');

        console.log(response.data);
  
        setTotalRegistrationData(response.data);
        // setAdminActivities(data.adminActivities || []);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
  
    fetchStats();
  }, []);


  useEffect(() => {
    // Simulate API calls - replace with actual fetch calls to your backend
    const fetchData = async () => {
      try {
        const regData = await fetchRegistrationData();
        setRegistrationData(regData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [timeRange]);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await apiService.get('/recent-registrations');
        console.log(response.data);
        setRecentUsers(response.data);
      } catch (error) {
        console.error('Error fetching recent users:', error);
      }
    };
    fetchRecentUsers();
  }, []);

  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <h1 className="text-left text-gray-800 mt-8 ml-8 py-10" style={{ color: 'black', fontSize: '2.5rem' }}>
        Welcome to Admin Dashboard !
      </h1>


      {/* Charts and Activities Section */}
      <div className="container_custom pb-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Fleet Manager Registration Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold" style={{ color: 'black' }}>Fleet Manager Registrations</h2>
              <div className="flex gap-2">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 3 Months</option>
                </select>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1 text-sm ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1 text-sm ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Bar
                  </button>
                </div>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={registrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value) => [value, 'Registrations']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="registrations" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={registrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value) => [value, 'Registrations']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="registrations" 
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Admin Activity History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold" style={{ color: 'black' }}>Recent Registrations</h2>
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              <ul>
              {recentUsers.length === 0 ? (
                <li className="text-gray-500">No recent users</li>
              ) : (
                recentUsers.map(user => (
                  <li key={user.id} className="flex justify-between py-2 border-b last:border-b-0 text-gray-500 text-sm">
                    <span>
                      {(user.firstName || user.lastName)
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                        : user.email}
                    </span>
                    <span className="text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </li>
                ))
              )}
            </ul>
            </div>
          </div>

          
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRegistrationData?.total || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. per Day</p>
                <p className="text-2xl font-bold text-gray-900">
         {
    totalRegistrationData?.registrationData?.length > 0
      ? Math.round(totalRegistrationData.total / totalRegistrationData.registrationData.length)
      : 0
  }
</p>

              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <ChevronRight className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Peak Day</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registrationData.length > 0 
  ? Math.max(...registrationData.map(item => item.registrations)) 
  : 0}

                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Actions</p>
                <p className="text-2xl font-bold text-gray-900">{adminActivities.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Edit className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;