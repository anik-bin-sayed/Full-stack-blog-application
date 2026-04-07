import React, { useState, useEffect } from "react";

import SubmitButton from "../../utils/Button";
import Input from "../../components/inputs/Input";
import PasswordInput from "../../components/inputs/PasswordInput";
import { useRegisterUserMutation } from "../../features/auth/authApi";
import type { FormData, FormErrors } from "../../types/RegisterTypes";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast } from "../../utils/showErrorToast";
import { showSuccessToast } from "../../utils/showSuccessToast";

const initialState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>(initialState);
  // Query
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [passwordStrength, setPasswordStrength] =
    useState<StrengthLevel>("Weak");
  const [strengthScore, setStrengthScore] = useState(0);

  useEffect(() => {
    if (
      formData.confirmPassword &&
      formData.password &&
      formData.password === formData.confirmPassword &&
      errors.confirmPassword
    ) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  }, [formData.password, formData.confirmPassword, errors.confirmPassword]);

  useEffect(() => {
    const pwd = formData.password;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    setStrengthScore(score);

    if (pwd.length === 0) {
      setPasswordStrength("Weak");
    } else if (score <= 2) {
      setPasswordStrength("Weak");
    } else if (score === 3) {
      setPasswordStrength("Fair");
    } else if (score === 4) {
      setPasswordStrength("Good");
    } else {
      setPasswordStrength("Strong");
    }
  }, [formData.password]);

  // Validation functions
  const validateUsername = (value: string): string => {
    if (!value.trim()) return "Username is required";
    if (value.length < 3) return "Username must be at least 3 characters";
    return "";
  };

  const validateEmail = (value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateConfirm = (
    confirmValue: string,
    passwordValue: string,
  ): string => {
    if (!confirmValue) return "Please confirm your password";
    if (confirmValue !== passwordValue) return "Passwords do not match";
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur =
    (field: keyof FormData) => (e: React.FocusEvent<HTMLInputElement>) => {
      const value = formData[field];
      let error = "";

      switch (field) {
        case "username":
          error = validateUsername(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "password":
          error = validatePassword(value);
          // Also validate confirm password if it has a value
          if (!error && formData.confirmPassword) {
            const confirmError = validateConfirm(
              formData.confirmPassword,
              value,
            );
            if (confirmError) {
              setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
            }
          }
          break;
        case "confirmPassword":
          error = validateConfirm(value, formData.password);
          break;
      }

      setErrors((prev) => ({ ...prev, [field]: error }));
    };

  const validateAll = (): boolean => {
    const newErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirm(
        formData.confirmPassword,
        formData.password,
      ),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateAll()) {
      try {
        const { confirmPassword, ...registerPayload } = formData;
        const res = await registerUser(registerPayload).unwrap();
        showSuccessToast(res);

        setFormData(initialState);
        setErrors(initialState);
        setPasswordStrength("Weak");
        setStrengthScore(0);

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error) {
        showErrorToast(error);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-70px)] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transition-all duration-300 hover:shadow-xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Join the Blog
          </h1>
          <p className="text-gray-500 mt-2">
            Create an account to start writing
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onBlur={handleBlur("username")}
              error={errors.username}
              label="Username"
              required
              placeholder="john_doe"
              autoComplete="username"
            />
          </div>
          <div className="mb-5">
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur("email")}
              error={errors.email}
              label="Email Address"
              required
              placeholder="hello@example.com"
              autoComplete="email"
            />
          </div>
          <div className="mb-5">
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur("password")}
              error={errors.password}
              label="Password"
              required
              showStrength
              strength={passwordStrength}
              strengthScore={strengthScore}
            />
          </div>

          <div className="mb-6">
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur("confirmPassword")}
              error={errors.confirmPassword}
              label="Confirm Password"
              required
              autoComplete="new-password"
              showStrength={false}
            />
          </div>

          <SubmitButton
            isLoading={isLoading}
            loadingText="Creating account..."
            text="Create Account"
          />

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
