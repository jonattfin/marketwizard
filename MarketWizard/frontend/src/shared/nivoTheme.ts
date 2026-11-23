import { useContext } from "react";
import { AppThemeContext } from "@/shared/context/theme-context";

export const useNivoTheme = () => {
  const appTheme = useContext(AppThemeContext);
  if (appTheme === "dark") {
    return {
      tooltip: {
        container: {
          background: "#000000",
        },
      },
    };
  }

  return {
    tooltip: {
      container: {
        background: "#ffffff",
      },
    },
  };
};
