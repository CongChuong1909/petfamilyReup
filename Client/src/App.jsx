

import React, { useEffect, useRef, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profiles/Profile";
import Home from "./pages/home/Home";
import Addpet from "./pages/AddPet/AddPet";
import Friends from "./pages/Friends/Friends";
import Leftbar from "./components/leftBar/LeftBar";
import OnlineFriend from "./components/rightBar/OnlineFriends/OnlineFriend";
import Chat from "./pages/Chat/Chat";
import BecomeMember from "./components/Vererinarian/BecomeMember/BecomeMember";
import RightBar from "./components/rightBar/RightBar";
import { io } from 'socket.io-client';
import { addList } from './redux/chatSlices';
import Group from "./pages/Group/Group";
import PostInfo from "./pages/Post/PostInfo";
import FilterPostcategory from "./pages/FilterPostCategory/FilterPostcategory";
import ProfilePet from "./components/Profile/ProfilePet";
import SearchPost from "./pages/SearchPost/SearchPost";
import VerifiedEmail from "./pages/Login/VerifiedEmail";
import MyAccount from "./pages/MyAccount/MyAccount";
import GmailInput from "./pages/Login/GmailInput";
import ResetPassword from "./pages/Login/ResetPassword";
import NotificationSystem from "./pages/Notification/NotificationSystem";

function App() {
  const queryClient = new QueryClient();
  const { currentUser } = useSelector((state) => state.user);
  const [role, setRole] = useState(null);
  const dispatch = useDispatch();

  const socket = useRef(null);

useEffect(() => {
  socket.current = io("https://api.petfamily.click");
  socket.current.on("connect_error", (error) => {
    console.log(error);
  });

  return () => {
    socket.current.disconnect();
  };
}, []);

useEffect(() => {
    if(currentUser)
    { 
        socket.current.emit("addUser", currentUser.idUser);
        socket.current.on("getUsers", (users) => {
            dispatch(addList(users))
        });
    }
 
}, [currentUser]);


  const Layout = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const isFriendPath = /^\/friends\/[^/]+$/.test(currentPath);
    const ispostPath = /^\/post\/[^/]+$/.test(currentPath);
    const isCategoryPath = /^\/find-by-category\/[^/]+$/.test(currentPath);
    const isPostSearchPath = /^\/search\/[^/]+$/.test(currentPath);
    const userId = useLocation().pathname.split("/")[2];

    

    return (
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="thin-scroll grid grid-cols-10 gap-5 pt-[70px] bg-[#a8afba] w-[1320px] mx-auto">
          {currentPath !== "/chat" ? (
            <>
              <div className="col-span-2">
                <Leftbar />
              </div>
              <div
                className={`${
                  currentPath === "/" || isFriendPath || ispostPath || isCategoryPath || isPostSearchPath? "col-span-5" : "col-span-8"
                }`}
              >
                <Outlet />
              </div>
              <div
                className={`${
                  currentPath === "/" || isFriendPath || ispostPath || isCategoryPath || isPostSearchPath ?"col-span-3" : "hidden"
                }`}
              >
                <RightBar />
              </div>
            </>
          ) : (
            <div className="col-span-11">
              <Outlet />
            </div>
          )}
        </div>
        <OnlineFriend />
      </QueryClientProvider>
    );
  };

  const ProtectRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectRoute>
          <Layout />
        </ProtectRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile/>
        },
        {
            path: "/find-by-category/:id",
            element: <FilterPostcategory/>
        },
        {
            path: "/search/:term",
            element: <SearchPost/>
        },
        {
          path: "/:id/addpet",
          element: <Addpet />,
        },
        {
          path: "/pet/:id",
          element: <ProfilePet />,
        },
        {
            path: "/post/:id",
            element: <PostInfo />,
          },
        {
          path: "/friends/:id",
          element: <Friends />,
        },
        {
          path: "/group",
          element: <Group />,
        },
        {
          path: "/chat",
          element: <Chat socket = {socket}/>,
        },
        {
          path: "/become-member",
          element: <BecomeMember />,
        },
        {
            path: "/notification/:id",
            element: <NotificationSystem />,
          },
        {
            path: "/myAccount",
            element: <MyAccount />,
          },
      ],
    },
    {
      path: "/login",
      element: <Login role={role} setRole={setRole} />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
        path: "/verify-email",
        element: <VerifiedEmail/>,
    },
    {
        path: "/input-gmail",
        element: <GmailInput/>,
    },
    {
        path: "/reset-password",
        element: <ResetPassword/>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;