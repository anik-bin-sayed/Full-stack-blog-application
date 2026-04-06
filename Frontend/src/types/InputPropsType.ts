export interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  autoComplete?: string;
  showStrength?: boolean;
  strength?: "Weak" | "Fair" | "Good" | "Strong";
  strengthScore?: number;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "url" | "number" | "search";
}

export interface LoginFormData {
  identifier: string;
  password: string;
}

export interface LoginErrors {
  identifier: string;
  password: string;
}
