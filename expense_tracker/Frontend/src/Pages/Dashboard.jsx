import { useEffect, useRef, useState } from "react";
import API from "../axios/axios.js";
import AddExpenseModal from "../components/AddExpenseModal.jsx";
import { 
  Plus, 
  TrendingUp, 
  PieChart, 
  Calendar, 
  Tag, 
  DollarSign,
  MoreVertical,
  Download,
  Filter,
  TrendingDown,
  RefreshCw
} from "lucide-react";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  // top-level quick select filter
  const [filter, setFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("month");

  // filter panel state — now anchored in Recent Expenses header
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [panelCategory, setPanelCategory] = useState("all");
  const [panelStartDate, setPanelStartDate] = useState("");
  const [panelEndDate, setPanelEndDate] = useState("");
  const filterAreaRef = useRef(null);

  // category list helper
  const categoryList = () => {
    const fromAnalytics = analytics?.categoryWise ? Object.keys(analytics.categoryWise) : [];
    const fromExpenses = Array.from(new Set(expenses.map(e => e.category).filter(Boolean)));
    return Array.from(new Set([...fromAnalytics, ...fromExpenses]));
  };

  const computeAnalyticsFrom = (expList) => {
    const totalSpend = expList.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const categoryWise = {};
    expList.forEach(e => {
      const cat = e.category || "other";
      categoryWise[cat] = (categoryWise[cat] || 0) + (Number(e.amount) || 0);
    });
    return { totalSpend, categoryWise };
  };

  // loadData with optional query params
  const loadData = async (opts = {}) => {
    setLoading(true);
    try {
      const params = {};
      if (opts.category && opts.category !== "all") params.category = opts.category;
      if (opts.startDate) params.startDate = opts.startDate;
      if (opts.endDate) params.endDate = opts.endDate;

      const [expRes, anaRes] = await Promise.all([
        API.get("/expenses", { params }),
        API.get("/expenses/analytics", { params }).catch(() => null)
      ]);

      const expData = expRes?.data || [];
      setExpenses(expData);

      if (anaRes?.data) setAnalytics(anaRes.data);
      else setAnalytics(computeAnalyticsFrom(expData));
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // close panel when clicking outside
    const handleDocClick = (e) => {
      if (showFilterPanel && filterAreaRef.current && !filterAreaRef.current.contains(e.target)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []); // eslint-disable-line

  // apply & clear
  const applyPanelFilters = () => {
    setFilter(panelCategory || "all");
    loadData({
      category: panelCategory,
      startDate: panelStartDate || undefined,
      endDate: panelEndDate || undefined
    });
    setShowFilterPanel(false);
  };

  const clearPanelFilters = () => {
    setPanelCategory("all");
    setPanelStartDate("");
    setPanelEndDate("");
    setFilter("all");
    loadData();
    setShowFilterPanel(false);
  };

  // helpers: colors & formatting
  const getCategoryColor = (category) => {
    const colors = {
      food: "bg-orange-500",
      transportation: "bg-blue-500",
      entertainment: "bg-purple-500",
      shopping: "bg-pink-500",
      bills: "bg-green-500",
      healthcare: "bg-red-500",
      education: "bg-indigo-500",
      other: "bg-gray-500"
    };
    return colors[category?.toLowerCase()] || "bg-gray-500";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPercentageChange = () => -12;

  // filteredExpenses by quick select
  const filteredExpenses = expenses.filter(expense => {
    if (filter === "all") return true;
    return expense.category === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Expense Dashboard</h1>
            <p className="text-gray-600 mt-2">Track and manage your expenses effectively</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => loadData({ category: filter !== "all" ? filter : undefined })}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-sm font-medium text-gray-700">Time Range:</span>
          {["week", "month", "quarter", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-full capitalize ${
                timeRange === range
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              getPercentageChange() < 0 
                ? "bg-red-100 text-red-800" 
                : "bg-green-100 text-green-800"
            }`}>
              {getPercentageChange() < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
              {Math.abs(getPercentageChange())}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(analytics.totalSpend || 0)}
          </h3>
          <p className="text-gray-600 text-sm">Total Spent</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="p-3 bg-orange-100 rounded-lg mb-4 w-fit">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(Math.round((analytics.totalSpend || 0) / 30))}
          </h3>
          <p className="text-gray-600 text-sm">Avg. Daily Spend</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="p-3 bg-purple-100 rounded-lg mb-4 w-fit">
            <PieChart className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {expenses.length}
          </h3>
          <p className="text-gray-600 text-sm">Total Expenses</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="p-3 bg-green-100 rounded-lg mb-4 w-fit">
            <Tag className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1 capitalize">
            {Object.entries(analytics.categoryWise || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
          </h3>
          <p className="text-gray-600 text-sm">Top Category</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Category Breakdown</h2>
                  <p className="text-gray-600 text-sm">Distribution by categories</p>
                </div>

                {/* Compact "All Categories" select moved into Category Breakdown header (swapped) */}
                <div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categoryList().map(cat => (
                      <option key={cat} value={cat} className="capitalize">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* empty spacer to keep layout balanced */}
              <div />
            </div>

            {analytics.categoryWise && Object.entries(analytics.categoryWise).map(([cat, amt]) => {
              const percentage = analytics.totalSpend ? ((amt / analytics.totalSpend) * 100).toFixed(1) : 0;
              return (
                <div key={cat} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(cat)} mr-3`}></div>
                      <span className="font-medium text-gray-700 capitalize">{cat}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{formatCurrency(amt)}</span>
                      <span className="text-gray-500 text-sm ml-2">{percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getCategoryColor(cat)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
                <p className="text-gray-600 text-sm">Latest transactions</p>
              </div>

              {/* --- SWAPPED CONTROLS: Filter popover first, then All Categories select --- */}
              <div className="flex items-center space-x-2" ref={filterAreaRef}>
                {/* Filter popover (opens on click) */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFilterPanel(prev => !prev);
                      setPanelCategory(filter || "all");
                    }}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </button>

                  {showFilterPanel && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Category</label>
                          <select
                            value={panelCategory}
                            onChange={(e) => setPanelCategory(e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="all">All</option>
                            {categoryList().map(cat => (
                              <option key={cat} value={cat} className="capitalize">{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">From</label>
                          <input
                            type="date"
                            value={panelStartDate}
                            onChange={(e) => setPanelStartDate(e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">To</label>
                          <input
                            type="date"
                            value={panelEndDate}
                            onChange={(e) => setPanelEndDate(e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>

                        <div className="flex justify-between mt-2">
                          <button
                            onClick={clearPanelFilters}
                            className="px-3 py-1 text-sm bg-white border rounded"
                          >
                            Clear
                          </button>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setShowFilterPanel(false)}
                              className="px-3 py-1 text-sm border rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={applyPanelFilters}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* All Categories select (quick filter) */}
                <div className="relative">
                  {/* <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="all">All Categories</option>
                    {analytics.categoryWise && Object.keys(analytics.categoryWise).map(cat => (
                      <option key={cat} value={cat} className="capitalize">{cat}</option>
                    ))}
                  </select> */}
                  {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div> */}
                </div>

                {/* Export button */}
                <button
                  onClick={() => {
                    const rows = filteredExpenses.map(e => ({
                      date: e.date,
                      category: e.category,
                      amount: e.amount,
                      note: e.note || e.description || ""
                    }));
                    const csv = [
                      ["date","category","amount","note"],
                      ...rows.map(r => [r.date, r.category, r.amount, `"${(r.note || "").replace(/"/g, '""')}"`])
                    ].map(r => r.join(",")).join("\n");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "expenses.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredExpenses.length > 0 ? (
              <div className="space-y-4">
                {filteredExpenses.slice(0, 5).map((e) => (
                  <div key={e._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${getCategoryColor(e.category)} bg-opacity-10 mr-4`}>
                        <Tag className="w-5 h-5" style={{ color: getCategoryColor(e.category).replace('bg-', 'text-').replace('-500', '-600') }} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">{e.description || e.category}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(e.date)}
                          <span className="mx-2">•</span>
                          <span className="capitalize">{e.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-lg text-gray-900 mr-4">
                        {formatCurrency(e.amount)}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredExpenses.length > 5 && (
                  <div className="text-center pt-4 border-t border-gray-100">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View All Expenses →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Tag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
                <p className="text-gray-600 mb-6">Start by adding your first expense</p>
                <button
                  onClick={() => setShowAdd(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Insights</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Spending Trend</h3>
                <div className="flex items-end h-24 space-x-1">
                  {[40, 60, 75, 55, 80, 65, 90].map((height, index) => (
                    <div 
                      key={index}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">↑ 12% from last month</p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Top Categories</h3>
                <div className="space-y-3">
                  {analytics.categoryWise && Object.entries(analytics.categoryWise)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([cat, amt]) => (
                      <div key={cat} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${getCategoryColor(cat)} mr-3`}></div>
                          <span className="text-sm text-gray-700 capitalize">{cat}</span>
                        </div>
                        <span className="font-medium text-gray-900">{formatCurrency(amt)}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Monthly Budget</h3>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600">Spent</span>
                  <span className="font-medium text-gray-900">{formatCurrency(analytics.totalSpend || 0)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min((analytics.totalSpend || 0) / 50000 * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹0</span>
                  <span>Goal: ₹50,000</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                    <DollarSign className="w-5 h-5 mb-2" />
                    <span className="text-sm font-medium">Set Budget</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                    <Download className="w-5 h-5 mb-2" />
                    <span className="text-sm font-medium">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showAdd && <AddExpenseModal onClose={() => setShowAdd(false)} onAdd={() => {
        loadData({ category: filter !== "all" ? filter : undefined });
        setShowAdd(false);
      }} />}
    </div>
  );
}
