import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { checkSession } from "./store/slices/authSlice";
import { Loader } from "./components/ui/Loader";
import { AppRoutes } from "./routes/AppRoutes";
import { ChatbotWidget } from "./components/ai/ChatbotWidget";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("[========== 2");
    dispatch(checkSession());
    console.log("[========== 3");
  }, [dispatch]);


  return (
    <Router>
      <Toaster position="bottom-center" />
      <AppRoutes />
      <ChatbotWidget />
    </Router>
  );
}

export default App;
