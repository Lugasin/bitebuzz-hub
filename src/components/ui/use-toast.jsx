
import { useToast as useOriginalToast, toast as originalToast } from "@/hooks/use-toast";

// Set default duration for toasts to 3 seconds
const useToast = () => {
  const { toast: originalToastFn, ...rest } = useOriginalToast();
  
  const toast = (props) => {
    // Ensure all toasts have a duration (default 3 seconds) and automatically close
    return originalToastFn({
      ...props,
      duration: props.duration || 3000, // Default 3 seconds if not specified
    });
  };
  
  return { ...rest, toast };
};

// Also update the default toast function
const toast = (props) => {
  // Ensure all toasts have a duration (default 3 seconds) and automatically close
  return originalToast({
    ...props,
    duration: props.duration || 3000, // Default 3 seconds if not specified
  });
};

export { useToast, toast };
