import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login.tsx";
import About from "./pages/About.tsx";
import Services from "./pages/Services.tsx";
import Signup from "./pages/Signup.tsx";
import RootLayout from "./pages/RootLayout.tsx";
import Userlayout from "./pages/users/Userlayout.tsx";
import Userhome from "./pages/users/Userhome.tsx";
import Userprofile from "./pages/users/Userprofile.tsx";
import OAuthSuccess from "./pages/OAuthSuccess.tsx";
import UsersManagement from "./pages/admin/UsersManagement.tsx";
import RolesManagement from "./pages/admin/RolesManagement.tsx";
import PermissionRoute from "./components/PermissionRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Userlayout />}>
          <Route index element={<Userhome />} />
          <Route path="profile" element={<Userprofile />} />
          <Route element={<PermissionRoute permission="USER:READ" />}>
            <Route path="admin/users" element={<UsersManagement />} />
          </Route>
          <Route element={<PermissionRoute permission="ROLE:READ" />}>
            <Route path="admin/roles" element={<RolesManagement />} />
          </Route>
        </Route>
        <Route path="oauth/success" element={<OAuthSuccess />} />
        <Route path="oauth/failure" element={<OAuthSuccess />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
