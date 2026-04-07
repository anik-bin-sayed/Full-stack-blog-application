import React, { useState } from "react";
import SubmitButton from "../../utils/Button";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/inputs/PasswordInput";
import Input from "../../components/inputs/Input";
import type { LoginErrors, LoginFormData } from "../../types/InputPropsType";
import { showErrorToast } from "../../utils/showErrorToast";
import { useLoginUserMutation } from "../../features/auth/authApi";
import { showSuccessToast } from "../../utils/showSuccessToast";
import { useDispatch } from "react-redux";
import { setAuth } from "../../features/auth/authSlice";

const initialState = {
  identifier: "",
  password: "",
};

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>(initialState);
  const [errors, setErrors] = useState<LoginErrors>(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // query
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const validateIdentifier = (value: string): string => {
    const v = value.trim();
    if (!v) return "Email or username is required";

    if (v.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(v)) return "Please enter a valid email address";
    } else {
      if (v.length < 3) return "Username must be at least 3 characters";
    }
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required";
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (field: keyof LoginFormData) => () => {
    let error = "";
    if (field === "identifier") {
      error = validateIdentifier(formData.identifier);
    } else if (field === "password") {
      error = validatePassword(formData.password);
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateAll = (): boolean => {
    const newErrors = {
      identifier: validateIdentifier(formData.identifier),
      password: validatePassword(formData.password),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateAll()) {
      try {
        const id = formData.identifier.trim();
        const loginPayload = id.includes("@")
          ? { email: id, password: formData.password }
          : { username: id, password: formData.password };

        const res = await loginUser(loginPayload).unwrap();
        showSuccessToast(res);
        dispatch(setAuth());
        setFormData(initialState);
        setErrors(initialState);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        showErrorToast(error);
        console.log(error);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-70px)] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transition-all duration-300 hover:shadow-xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">Log in to continue to the blog</p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <Input
              id="identifier"
              name="identifier"
              type="text"
              value={formData.identifier}
              onChange={handleInputChange}
              onBlur={handleBlur("identifier")}
              error={errors.identifier}
              label="Email Address or Username"
              required
              placeholder="hello@example.com or john_doe"
              autoComplete="email"
            />
          </div>

          <div className="mb-6">
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur("password")}
              error={errors.password}
              label="Password"
              required
              autoComplete="new-password"
              showStrength={false}
            />
          </div>

          <div className="text-right mb-6">
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-800 transition"
            >
              Forgot password?
            </a>
          </div>

          <SubmitButton
            isLoading={isLoading}
            loadingText="Logging in..."
            text="Log In"
          />

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
