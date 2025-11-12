   
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
   <AuthProvider>
      <>
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeButton />
        <App />
      </>
    </AuthProvider> 
);