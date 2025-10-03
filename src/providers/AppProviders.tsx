import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useTheme } from "@mui/material/styles";
import { ThemeProvider } from "./ThemeProvider";
import { AppRoutes } from "../routes";

const queryClient = new QueryClient();

// A new component to contain the providers that need the theme
function ThemedProviders() {
    const theme = useTheme();
    return (
        <>
            <AppRoutes />
            <Toaster 
                theme={theme.palette.mode === 'dark' ? 'dark' : 'light'} 
                richColors 
                position="bottom-right" 
            />
        </>
    );
}

export function AppProviders() {
  return (
    <ThemeProvider>
        <QueryClientProvider client={queryClient}>
            <ThemedProviders />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </ThemeProvider>
  );
}