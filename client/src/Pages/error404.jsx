import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeIcon } from 'lucide-react'

const Error404 = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-blue-600">404</h1>
                <h2 className="text-3xl font-semibold text-gray-900 mt-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mt-4 mb-8 max-w-md mx-auto">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <button onClick={() => navigate('/')} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out">
                    <HomeIcon className="h-5 w-5 mr-2" />
                    Back to Home
                </button>
            </div>
        </div>
    )
}
export default Error404
