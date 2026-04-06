export interface SubmitButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}
