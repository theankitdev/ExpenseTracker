import { useState } from "react";
import API from "../axios/axios.js";
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn } from "lucide-react";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await API.post("/auth/login", formData);
            localStorage.setItem("token", res.data.token);

            // Show success feedback before redirect
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Invalid credentials. Please try again.";
            setErrors(prev => ({
                ...prev,
                general: errorMessage
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
                {/* Decorative header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-blue-100 text-sm">Sign in to your account</p>
                </div>

                <div className="p-8">
                    {/* General error message */}
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center animate-fadeIn">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                            <p className="text-red-800">{errors.general}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Email field */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <div className="flex items-center mt-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Password field */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <a
                                    href="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="flex items-center mt-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        {/* Remember me checkbox */}
                        <div className="flex items-center mb-8">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Sign In
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 mb-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">New to our platform?</span>
                        </div>
                    </div>

                    {/* Register link */}
                    <div className="text-center">
                        <a
                            href="/register"
                            className="inline-flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            Create an account
                        </a>
                    </div>


                </div>
            </div>
        </div>
    );
}