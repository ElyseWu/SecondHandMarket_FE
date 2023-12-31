import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import DetailPage from "./components/DetailPage";
import UnauthedDetailPage from "./components/UnauthedDetailPage";
import ChatBox from "./components/ChatBox";
import PersonMessage from "./components/PersonMessage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "items/:itemId/:userName",
    element: <DetailPage />,
  },
  {
    path: "items/:itemId",
    element: <UnauthedDetailPage />,
  },
  { path: "chatbox/:userName", element: <ChatBox /> },

  {
    path: "chats/:chat_id",
    element: <PersonMessage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
