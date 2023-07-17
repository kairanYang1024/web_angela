import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

import AuthService from "../services/auth.service";

const Confirmation = () => {
    const {confirmToken} = useParams();
    const [processing, setProcessing] = useState(true); //initially the page is running processing animation
    const [alertState, setAlertState] = useState({
        show: false,
        color: "green",
        msg: "",
    });

    // console.log(alertState);

    useEffect(() => {
        AuthService.verify(confirmToken)
        .then((res) => {
            // console.log(`before set: ${alertState.color}, ${alertState.show}, ${alertState.msg}`);
            // console.log(`data:`, res.data);
            setAlertState({
              show: true,
              color: "green",
              msg: res.data.message,
            }); //caught up the result from verify the confirmToken (from server BE)
            setProcessing(false);
            // console.log(`after set: ${alertState.color}, ${alertState.show}, ${alertState.msg}`);
        })
        .catch((err) => {
            setAlertState({
              show: true,
              color: "red",
              msg: "Failed to verify your email",
            });
            setProcessing(false);
            console.error(err);
        });
    }, []); //no extra args []

    //return the page view of the comfirmation page (embedding the Alert)
    return (
        <>
        <div className="flex h-screen">
            <div className="m-auto">
            {processing ? <Loader /> : null}
            {alertState.show ? (
                <Alert color={alertState.color} msg={alertState.msg} />
            ) : null}
            </div>
        </div>
        </>
    );
}

export default Confirmation;