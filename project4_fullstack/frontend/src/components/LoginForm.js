import React, { useState, useContext } from "react";
import { Context } from "../context";
import Alert from "./Alert";
import Loader from "./Loader";
import AuthService from "../services/auth.service";

const LoginForm = () => {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");

    const { dispatch } = useContext(Context); //load that 

    const [processing, setProcessing] = useState(false);
    const [alertState, setAlertState] = useState({
      show: false,
      color: "green",
      msg: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        AuthService.login({ emailOrUsername, password })
        .then((res) => {
            console.log(res);
            //authenticate the user on the frontend
            localStorage.setItem("user", JSON.stringify(res));
            //and modify the context API state via dispatch
            dispatch({
              type: "LOGIN",
              payload: {
                user: res,
                token: res.token,
              },
            }); //make the auth=true in the Context to render the view correctly (Navbar, Home, etc.)
            // console.log("Localstorage: ", localStorage);
            setProcessing(false);
        })
        .catch((err) => {
            console.error(err);
            setProcessing(false);
            setAlertState({
              show: true,
              color: "red",
              msg: err.response.data || "Failed to process the data",
            });
        });
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center">
          {alertState.show ? (
            <Alert color={alertState.color} msg={alertState.msg} />
          ) : null}
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address or Username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
    
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Login
            </button>
          </div>

          <div className="flex justify-center">
            {processing ? <Loader /> : null}
          </div>
        </form>
    );

}
export default LoginForm;