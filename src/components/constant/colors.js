export const THEME_COLORS = {
  // Primary colors - blue/green theme
  primary: {
    50: "bg-blue-50",
    100: "bg-blue-100",
    200: "bg-blue-200",
    500: "bg-blue-500",
    600: "bg-blue-600",
    700: "bg-blue-700",
    800: "bg-blue-800",
  },
  // Text colors
  text: {
    primary50: "text-blue-50",
    primary100: "text-blue-100",
    primary200: "text-blue-200",
    primary600: "text-blue-600",
    primary700: "text-blue-700",
    
  },
  // Border colors
  border: {
    primary200: "border-blue-200",
    primary500: "border-blue-500",
  },
  // Hover colors
  hover: {
    primary100: "hover:bg-blue-100",
    primary500: "hover:bg-blue-500",
    primary700: "hover:bg-blue-700",
  },
  // Background colors
  background: {
    primary: "bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50",
    secondary: "bg-gradient-to-r from-blue-50 to-cyan-50",
    card: "bg-white",
    muted: "bg-gray-50",
    accent: "bg-blue-50",
  },
}

// CSS custom properties for dynamic colors
export const CSS_COLORS = {
  primary: "#3b82f6",          // blue-500
  primaryDark: "#1e40af",      // blue-800
  primaryLight: "#93c5fd",     // blue-300
  primaryVeryLight: "#dbeafe", // blue-100
  primaryExtraLight: "#eff6ff",// blue-50

  // Background colors
  background: {
    primary: "linear-gradient(135deg, #eff6ff 0%, #ecfeff 50%, #e0f2fe 100%)", // blue-50 to cyan-50 to light-blue-50
    secondary: "linear-gradient(90deg, #eff6ff 0%, #ecfeff 100%)", // blue-50 to cyan-50
    card: "#ffffff",           // white card
    muted: "#f9fafb",          // gray-50
    accent: "#eff6ff",         // blue-50
    overlay: "rgba(59, 130, 246, 0.05)", // blue-500 with 5% opacity
    sidebar: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)",
    activeSidebar: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 40%, #2563eb 100%)",

  },



}
