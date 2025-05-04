
import React from "react";

const Tabs = ({ defaultValue, value, onValueChange, className = "", ...props }) => {
  const [tabValue, setTabValue] = React.useState(value || defaultValue);
  
  React.useEffect(() => {
    if (value !== undefined) {
      setTabValue(value);
    }
  }, [value]);
  
  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setTabValue(newValue);
    }
    onValueChange?.(newValue);
  };
  
  return (
    <div className={`${className}`} {...props} data-value={tabValue}>
      {React.Children.map(props.children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        if (child.type === TabsList || child.type === TabsContent) {
          return React.cloneElement(child, {
            value: tabValue,
            onValueChange: handleValueChange,
          });
        }
        
        return child;
      })}
    </div>
  );
};

const TabsList = ({ className = "", value, onValueChange, ...props }) => {
  return (
    <div
      className={`inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground ${className}`}
      {...props}
    >
      {React.Children.map(props.children, (child) => {
        if (!React.isValidElement(child) || child.type !== TabsTrigger) return child;
        
        return React.cloneElement(child, {
          value: child.props.value,
          isSelected: value === child.props.value,
          onSelect: () => onValueChange?.(child.props.value),
        });
      })}
    </div>
  );
};

const TabsTrigger = ({ className = "", value, isSelected, onSelect, ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isSelected
          ? "bg-background text-foreground shadow"
          : "hover:bg-background/50 hover:text-foreground"
      } ${className}`}
      onClick={onSelect}
      {...props}
    />
  );
};

const TabsContent = ({ className = "", value, tabValue, ...props }) => {
  const isActive = value === tabValue;
  
  if (!isActive) return null;
  
  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
