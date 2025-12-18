import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })

  const { email, password } = formData 

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === 'admin@gmail.com' && password === '1234') {
      navigate('/admin/dashboard');
    } else if (email === 'staff@gmail.com' && password === '1234') {
      navigate('/staff/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="min-h-screen flex ">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[linear-gradient(180deg,#05303B_-50.4%,#2B7C7E_20.34%,#91D8C1_80.01%)] items-center justify-center p-12 relative overflow-hidden">
        
        <div className="relative z-10 text-center max-w-md">
          {/* Medical Image Placeholder */}
          <div className="mb-8 mx-auto w-64 h-64 bg-[#d2eaf4] bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-xl">
            <svg className="w-32 h-32 text-[#246e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to Srinivasa Pharma
          </h1>
          
          <p className="text-white text-lg mb-8 leading-relaxed opacity-95">
            Your comprehensive medical store management solution. Streamline operations, manage inventory, and serve patients better.
          </p>  

          <div className="space-y-3 text-left">
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Inventory Management</span>
            </div>
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Order Tracking</span>
            </div>
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Staff Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#d2eaf4]">
        <div className="w-full max-w-md">
          {/* Logo Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#246e72] rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-600">Access your medical store dashboard</p>
          </div>

          {/*Login Tab */}
          <div className="mb-6">
            <button className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-[#246e72] shadow-md">
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Login Here
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Email/Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#246e72] focus:border-transparent outline-none bg-white"
                  placeholder="Enter email"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#246e72] focus:border-transparent outline-none bg-white"
                placeholder="Enter password"
              />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#246e72] focus:ring-[#246e72]"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button 
                onClick={() => console.log('Forgot password')}
                className="text-sm text-[#246e72] hover:text-[#5fb3f0] font-medium transition"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-[#246e72] hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#d2eaf4] text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={() => console.log('Google Login Clicked')}
              className="w-full py-3 px-6 rounded-xl font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.691 1.145 6.655l4.121 3.11z"
                />
                <path
                  fill="#34A853"
                  d="M16.04 18.013c-1.09.593-2.325.896-3.618.896-3.24 0-6.063-2.09-7.12-5.007L1.145 17.02C3.191 21.018 7.273 24 12 24c3.11 0 5.927-1.09 8.09-2.936l-4.05-3.051z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.275c0-.827-.073-1.623-.21-2.396H12v4.54h6.44c-.28 1.487-1.12 2.753-2.4 3.594l4.05 3.051c2.373-2.183 3.4-5.39 3.4-8.789z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.266 14.235A6.974 6.974 0 0 1 4.909 12c0-.782.136-1.536.357-2.235L1.145 6.655A11.97 11.97 0 0 0 0 12c0 1.92.445 3.736 1.245 5.345l4.021-3.11z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-3">Need help accessing your account?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => console.log('Contact support')}
                className="text-sm text-gray-700 hover:text-[#246e72] transition flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Contact Support
              </button>
              <button 
                onClick={() => console.log('Help center')}
                className="text-sm text-gray-700 hover:text-[#246e72] transition flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help Center
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            © 2024 Srinivasa Pharma. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;