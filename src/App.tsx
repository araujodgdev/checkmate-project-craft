import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme-provider";
import { ProtectedRoute } from "@/components/protected-route";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

// Import page components
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import AuthPage from "@/pages/AuthPage";
import ProjectDetails from "@/pages/ProjectDetails";
import NewProject from "@/pages/NewProject";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 minute
			refetchOnWindowFocus: false,
		},
	},
});

const App = () => {
	useEffect(() => {
		useAuthStore.getState().initializeAuth();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="dark">
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Landing />} />
							<Route
								path="/dashboard"
								element={
									<ProtectedRoute>
										<Dashboard />
									</ProtectedRoute>
								}
							/>
							<Route path="/auth" element={<AuthPage />} />
							<Route
								path="/projects"
								element={<Navigate to="/projects" replace />}
							/>
							<Route
								path="/projects/:projectId"
								element={
									<ProtectedRoute>
										<ProjectDetails />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/new-project"
								element={
									<ProtectedRoute>
										<NewProject />
									</ProtectedRoute>
								}
							/>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default App;
