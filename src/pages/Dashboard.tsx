import React from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  BarChart,
  LineChart,
  LogOut,
  Settings,
  User,
  Activity,
  Home,
  AlertCircle,
  Shield,
} from "lucide-react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = React.useState("home");

  // Activity chart
  const activityChartOptions: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#3a86ff", "#5e60ce"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  const activityChartSeries = [
    {
      name: "Sessions",
      data: [30, 40, 35, 50, 49, 60, 70],
    },
    {
      name: "Users",
      data: [20, 35, 40, 45, 39, 52, 45],
    },
  ];

  //Security Stats
  const securityChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    colors: ["#5e60ce"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " auth attempts";
        },
      },
    },
  };

  const securityChartSeries = [
    {
      name: "Authentication Attempts",
      data: [44, 55, 57, 56, 61, 58, 63],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-green-300 to-blue-500">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white/80 backdrop-blur-md shadow-xl z-10 hidden md:block rounded-tr-3xl">
        <div className="flex flex-col h-full">
          <div className="p-7 border-b"></div>

          <nav className="flex-1 p-4 space-y-4 flex flex-col items-center">
            <button
              onClick={() => setActivePage("home")}
              className={`hover:text-primary-700 ${
                activePage === "home"
                  ? "text-primary-700 font-semibold border-l-4 border-primary-500 pl-3"
                  : "text-gray-500"
              }`}
            >
              <Home className="h-6 w-6" />
            </button>

            <div className="p-2 text-gray-600 hover:text-primary-700 hover:bg-gray-100 rounded-md">
              <Settings className="h-6 w-6" />
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <header className="bg-white shadow-sm p-4 relative flex items-center justify-between">
          <div className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-900">
            Analytics Dashboard
          </div>{" "}
          <div className="ml-auto flex items-center space-x-4">
            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-6 w-6" />
            </button>
            <span className="hidden md:inline text-sm text-gray-700 font-medium">
              Logout
            </span>
            <div className="relative">
              <button className="flex text-5xl rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <span className="sr-only">Open user menu</span>
                <div className="h-18 w-18 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                  <User className="h-5 w-5" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Content2 */}
        <main className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.email.split("@")[0]}
              </h1>
              <p className="text-gray-500">
                Here's what's happening with your account today.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800">
                <span className="w-2 h-2 mr-2 rounded-full bg-success-500"></span>
                Secure Session
              </span>
            </div>
          </div>

          {/* Fake Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">
                  Login Success Rate
                </h3>
                <div className="bg-success-100 p-2 rounded-md">
                  <Activity className="h-5 w-5 text-success-600" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">98.3%</span>
                <span className="text-sm text-success-600 font-medium">
                  +2.5%
                </span>
              </div>
              <div className="mt-4 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-success-500 rounded-full"
                  style={{ width: "98.3%" }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">
                  Failed Login Attempts
                </h3>
                <div className="bg-error-100 p-2 rounded-md">
                  <AlertCircle className="h-5 w-5 text-error-600" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">5</span>
                <span className="text-sm text-error-600 font-medium">+1</span>
              </div>
              <div className="mt-4 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-error-500 rounded-full"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">
                  OTP Delivery Rate
                </h3>
                <div className="bg-primary-100 p-2 rounded-md">
                  <Shield className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">99.7%</span>
                <span className="text-sm text-success-600 font-medium">
                  +0.3%
                </span>
              </div>
              <div className="mt-4 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-primary-500 rounded-full"
                  style={{ width: "99.7%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Fake Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Activity Overview
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Last 7 days
                  </span>
                  <LineChart className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="h-72">
                <Chart
                  options={activityChartOptions}
                  series={activityChartSeries}
                  type="area"
                  height="100%"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Authentication Stats
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                    Weekly
                  </span>
                  <BarChart className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="h-72">
                <Chart
                  options={securityChartOptions}
                  series={securityChartSeries}
                  type="bar"
                  height="100%"
                />
              </div>
            </div>
          </div>

          {/* Static Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </button>
            </div>

            <div className="space-y-4">
              {[
                { type: "login", time: "2 minutes ago", status: "success" },
                { type: "logout", time: "3 hours ago", status: "normal" },
                { type: "login", time: "3 hours ago", status: "success" },
                { type: "failed", time: "1 day ago", status: "error" },
                { type: "login", time: "2 days ago", status: "success" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        activity.status === "success"
                          ? "bg-success-100"
                          : activity.status === "error"
                          ? "bg-error-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {activity.status === "success" ? (
                        <Shield className={`h-5 w-5 text-success-600`} />
                      ) : activity.status === "error" ? (
                        <AlertCircle className={`h-5 w-5 text-error-600`} />
                      ) : (
                        <LogOut className={`h-5 w-5 text-gray-600`} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === "login"
                          ? "Successful login"
                          : activity.type === "logout"
                          ? "User logged out"
                          : "Failed login attempt"}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div>
                    {activity.status === "success" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Success
                      </span>
                    )}
                    {activity.status === "error" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                        Failed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
