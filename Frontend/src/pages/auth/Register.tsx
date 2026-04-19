import React, { useState, useEffect, useCallback } from "react";
import SubmitButton from "../../utils/Button";
import Input from "../../components/common/inputs/Input";
import PasswordInput from "../../components/common/inputs/PasswordInput";
import { useRegisterUserMutation } from "../../features/auth/authApi";
import type { FormData, FormErrors } from "../../types/RegisterTypes";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast } from "../../utils/showErrorToast";
import { showSuccessToast } from "../../utils/showSuccessToast";

const initialState: FormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

type StrengthLevel = "Weak" | "Fair" | "Good" | "Strong";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>(initialState);

  const [passwordStrength, setPasswordStrength] =
    useState<StrengthLevel>("Weak");
  const [strengthScore, setStrengthScore] = useState(0);

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  useEffect(() => {
    const pwd = formData.password;

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    setStrengthScore(score);

    if (pwd.length === 0) setPasswordStrength("Weak");
    else if (score <= 2) setPasswordStrength("Weak");
    else if (score === 3) setPasswordStrength("Fair");
    else if (score === 4) setPasswordStrength("Good");
    else setPasswordStrength("Strong");

    if (formData.confirmPassword) {
      setErrors((prev) => {
        if (formData.confirmPassword === pwd) {
          if (!prev.confirmPassword) return prev;
          return { ...prev, confirmPassword: "" };
        } else {
          if (prev.confirmPassword === "Passwords do not match") return prev;
          return { ...prev, confirmPassword: "Passwords do not match" };
        }
      });
    }
  }, [formData.password, formData.confirmPassword]);

  const validateUsername = useCallback((value: string): string => {
    if (!value.trim()) return "Username is required";
    if (value.length < 3) return "Username must be at least 3 characters";
    return "";
  }, []);

  const validateEmail = useCallback((value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  }, []);

  const validatePassword = useCallback((value: string): string => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  }, []);

  const validateConfirm = useCallback(
    (confirm: string, password: string): string => {
      if (!confirm) return "Please confirm your password";
      if (confirm !== password) return "Passwords do not match";
      return "";
    },
    [],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        if (prev[name as keyof FormData] === value) return prev;
        return { ...prev, [name]: value };
      });

      setErrors((prev) => {
        if (!prev[name as keyof FormErrors]) return prev;
        return { ...prev, [name]: "" };
      });
    },
    [],
  );

  const handleBlur = useCallback(
    (field: keyof FormData) => (e: React.FocusEvent<HTMLInputElement>) => {
      const value = formData[field];
      let error = "";

      if (field === "username") error = validateUsername(value);
      else if (field === "email") error = validateEmail(value);
      else if (field === "password") {
        error = validatePassword(value);

        if (!error && formData.confirmPassword) {
          const confirmError = validateConfirm(formData.confirmPassword, value);

          setErrors((prev) => {
            if (prev.confirmPassword === confirmError) return prev;
            return { ...prev, confirmPassword: confirmError };
          });
        }
      } else if (field === "confirmPassword") {
        error = validateConfirm(value, formData.password);
      }

      setErrors((prev) => {
        if (prev[field] === error) return prev;
        return { ...prev, [field]: error };
      });
    },
    [
      formData,
      validateUsername,
      validateEmail,
      validatePassword,
      validateConfirm,
    ],
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirm(
        formData.confirmPassword,
        formData.password,
      ),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((e) => e);
  }, [
    formData,
    validateUsername,
    validateEmail,
    validatePassword,
    validateConfirm,
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateAll()) return;

    try {
      const res = await registerUser(formData).unwrap();
      showSuccessToast(res);

      setFormData(initialState);
      setErrors(initialState);
      setPasswordStrength("Weak");
      setStrengthScore(0);

      navigate("/login");
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <div className="h-[calc(100vh-70px)] bg-linear-to-r from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Join the Blog
          </h1>
          <p className="text-gray-500 mt-2">
            Create an account to start writing
          </p>
          <div className="w-16 h-1 bg-linear-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
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

          <SubmitButton
            isLoading={isLoading}
            loadingText="Creating account..."
            text="Create Account"
          />

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
