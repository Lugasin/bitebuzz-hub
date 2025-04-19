
import { useToast, toast } from "@/hooks/use-toast";

// Set default duration for toasts
const useTimedToast = () => {
  const { toast: originalToast, ...rest } = useToast();
  
  const timedToast = (props) => {
    return originalToast({
      ...props,
      duration: props.duration || 3000, // Default 3 seconds if not specified
    });
  };
  
  return { ...rest, toast: timedToast };
};

export { useTimedToast as useToast, toast };
