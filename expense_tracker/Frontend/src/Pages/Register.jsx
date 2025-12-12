import React from "react";
import { useState } from "react";
import API from "../axios/axios.js";
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }
        
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
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

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setSuccess(false);
        
        try {
            await API.post("/auth/register", formData);
            setSuccess(true);
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
                {/* Decorative header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Join Our Community</h1>
                    <p className="text-blue-100 text-sm">Create your account to get started</p>
                </div>

                <div className="p-8">
                    {/* Success message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center animate-fadeIn">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-green-800 font-medium">Account created successfully!</p>
                                <p className="text-green-600 text-sm">Redirecting to homepage...</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        {/* Name field */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                            </div>
                            {errors.name && (
                                <div className="flex items-center mt-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.name}
                                </div>
                            )}
                        </div>

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
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
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
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
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
                            <p className="mt-2 text-xs text-gray-500">
                                Must be at least 6 characters long
                            </p>
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
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 mb-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    {/* Login link */}
                    <div className="text-center">
                        <a
                            href="/"
                            className="inline-flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            Sign in to your account
                        </a>
                    </div>

                    {/* Terms */}
                    <p className="mt-8 text-center text-xs text-gray-500">
                        By registering, you agree to our{" "}
                        <a href="/terms" className="text-blue-600 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}