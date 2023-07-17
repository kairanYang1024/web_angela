import React, { useContext, useEffect } from "react";
import { Context } from "./context";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";

// Import the wrapper page for the user features
import Signup from "./pages/Signup";
import Confirmation from "./pages/Confirmation";
import Login from "./pages/Login";

import welcome from "./assets/welcome.png";

const RequireAuth = ({ children }) => {
  const { state } = useContext(Context);
  //define the set of children to be viewed under auth otherwise redirect to /login
  //defined in the App component, serves as protection logic
  return state.auth ? children : <Navigate to="/login" replace />;
};

const OnlyNotAuth = ({ children }) => {
  const { state } = useContext(Context);
  //define the set of children to be viewed under not auth otherwise redirect to home
  //defined in the App component, serves as protection logic
  return !state.auth ? children : <Navigate to="/" replace />;
};

const Home = () => { //stub to be expanded
  const { state } = useContext(Context);
  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {`Welcome, ${state.user.firstName}!`}
          </h2>
          <p className="mt-6 text-center text-3xl text-gray-900">
            You can upload your content easily to manage your files
          </p>
          <img className="mx-auto w-auto my-12" src={welcome} alt="Workflow" />
        </div>
      </div>
    </>
  );
};

const App = () => {
  //if using the useContext here, must wrap parent component of this component with contextProvider
  const { state, dispatch } = useContext(Context);
  
  //this triggered once the logged in user refresh the page / re-enter the page
  useEffect(()=>{
    const userItem = localStorage.getItem("user");
    if (userItem) {
      const user = JSON.parse(userItem);
      // console.log(`User is successfully loaded from localStorage: ${user}`);
      if (user) {
        dispatch({
          type: "LOGIN",
          payload: {
            user: user,
            token: user?.token || "",
          },
        });
      }
    }
  }, []); //empty argument

  // Define the Routes components which wraps all of the application routes
  return (
    <>
      <Navbar auth={false}/>
      <Routes>
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/signup" element={<OnlyNotAuth><Signup /></OnlyNotAuth>} />
        <Route path="/login" element={<OnlyNotAuth><Login /></OnlyNotAuth>} />
        <Route path="/verify/:confirmToken" element={<OnlyNotAuth><Confirmation /></OnlyNotAuth>} />
      </Routes>
    </>
  );
}

export default App;