import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/SignUpPage";
import { UIProvider } from "@yamada-ui/react";
import { HomePage } from "./pages/HomePage";
import { RecoilRoot } from "recoil";
import { useEffect } from "react";
import { PostDetailPage } from "./pages/PostDetailPage";
import { UserPage } from "./pages/UserPage";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { useLocation } from "react-router-dom";
import { NotificationPage } from "./pages/NotificationPage";
import { MessagePage } from "./pages/MessagePage";
import { BookmarkPage } from "./pages/BookmarkPage";
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App = () => {
  useEffect(() => {
    const element = document.querySelector("html");
    element.style.overflowY = "scroll";
    element.style.overscrollBehaviorY = "none";
  }, []);

  return (
    <Provider store={store}>
      <RecoilRoot>
        <UIProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<SignUpPage />} />
              <Route path="/login" element={<SignUpPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/:username/:postId" element={<PostDetailPage />} />
              <Route path="/users/:id" element={<UserPage />} />
              <Route path="/settings/profile" element={<UserPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/rooms" element={<MessagePage />} />
              <Route path="/bookmarks" element={<BookmarkPage />} />
            </Routes>
          </Router>
        </UIProvider>
      </RecoilRoot>
    </Provider>
  );
};
