import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AnnouncementDetails from "./pages/AnnouncementDetails";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";
import Announce from "./pages/Announce";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import EditAnnouncement from "./pages/EditAnnouncement";
import PublicProfile from "./pages/PublicProfile";
import UpdatePassword from "./pages/UpdatePassword";
import Settings from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationsProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/search" element={<Search />} />
              <Route path="/announcement/:id" element={<AnnouncementDetails />} />
              <Route path="/user/:id" element={<PublicProfile />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              
              {/* Rotas Protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/announce" element={<Announce />} />
                <Route path="/announcement/:id/edit" element={<EditAnnouncement />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/chat" element={<ChatList />} />
                <Route path="/chat/announcement/:announcementId" element={<Chat />} />
                <Route path="/chat/user/:userId" element={<Chat />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <PWAInstallPrompt />
          </NotificationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;