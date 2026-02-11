import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SignupForm from '../components/Auth/SignupForm';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (userData) => {
    await signup(userData);
    navigate('/calendar');
  };

  return (
    <div>
      <SignupForm onSubmit={handleSubmit} />
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
