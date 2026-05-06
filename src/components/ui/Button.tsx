interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline"
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const styles = {
    primary: {
      backgroundColor: "var(--color-brand-primary)",
      color: "#ffffff",
      border: "none",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--color-text-secondary)",
      border: "none",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--color-text-primary)",
      border: `1px solid var(--color-border-default)`,
    },
  }

  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-500 transition-all
                  hover:opacity-80 disabled:opacity-40 ${className}`}
      style={styles[variant]}
      {...props}
    />
  )
}