import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { useEffect } from "react";
import Landing from "@/pages/Landing";
import Assets from "@/pages/Assets";
import Portfolio from "@/pages/Portfolio";
import MemberPage from "@/pages/MemberPage";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function AppContent() {
  useEffect(() => {
    // Check if we were redirected from 404.html
    const redirect = sessionStorage.redirect;
    if (redirect) {
      delete sessionStorage.redirect;
      // Extract the path from the full URL
      const url = new URL(redirect);
      // Replace the history to clean up
      window.history.replaceState(null, "", url.pathname);
    }
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/queries" component={Assets} />
        <Route path="/:memberId/blog/:slug" component={BlogPost} />
        <Route path="/:memberId" component={MemberPage} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
