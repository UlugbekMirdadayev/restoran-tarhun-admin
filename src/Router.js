import React, { useEffect, useMemo } from "react";
import {
  useNavigate,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import Sidebar from "./components/Sidebar";
import Dashboard from "./page/dashboard";
import { Box, Center, Flex, Loader } from "@mantine/core";
import { useLoader, useUser } from "./redux/selectors";
import Waiter from "./page/waiter";
import Room from "./page/rooms";
import Product from "./page/products";
import Login from "./page/admin/login";
import Category from "./page/category";
import AdminsPage from "./page/admins";
import { setRooms } from "./redux/roomSlice";

const SOCKET_SERVER_URL = "wss://crmtarhun.dadabayev.uz/websocket/";

const routes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/waiter",
    element: <Waiter />,
  },
  {
    path: "/admins",
    element: <AdminsPage />,
  },
  {
    path: "/categories",
    element: <Category />,
  },
  {
    path: "/rooms",
    element: <Room />,
  },
  {
    path: "/products",
    element: <Product />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
];

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useUser();

  const loading = useLoader();
  const { pathname } = useLocation();

  const isHideSideBar = useMemo(
    () => ["/login"].includes(pathname),
    [pathname]
  );

  useEffect(() => {
    if (!user?.is_active && !["/login"].includes(pathname)) {
      navigate("/login");
    }
  }, [user?.is_active, navigate, pathname]);

  useEffect(() => {
    const socket = new WebSocket(SOCKET_SERVER_URL); // Replace with your WebSocket server URL

    socket.onopen = () => {
      console.log("Connected to WebSocket server");

      const message = JSON.stringify({
        method: "createUser",
        ownerId: user?.id, // Replace $owner_id with the actual owner ID value
      });

      socket.send(message);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event?.data || "{}");
      console.log(message);
      if (message?.method === "updateRooms") {
        dispatch(setRooms(message?.rooms));
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };
    return () => {
      socket.close();
    };
  }, [user?.id, dispatch]);

  return (
    <Flex maw={"100vw"} gap={20} gutter={0}>
      <Box miw={200} display={isHideSideBar ? "none" : "block"}>
        <Sidebar />
      </Box>

      <Box
        w={`calc(100dvw - ${isHideSideBar ? "0px" : "200px"})`}
        mih={isHideSideBar ? "100dvh" : "none"}
        pos={"relative"}
        style={{
          overflowY: loading ? "hidden" : "auto",
          maxHeight: `calc(100dvh - ${loading ? 100 : 0}px)`,
          transition: "300ms ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Center
          p={loading ? "lg" : 0}
          h={!loading && 0}
          style={{
            overflow: "hidden",
            transition: "300ms ease",
          }}
        >
          <Loader />
        </Center>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </Box>
    </Flex>
  );
}
