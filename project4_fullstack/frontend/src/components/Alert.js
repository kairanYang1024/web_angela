import React, {useState} from "react";

const Alert = ({color, msg}) => {
    const [showAlert, setShowAlert] = useState(true); //set it true here to enable animation display
    // console.log(`inside alert: color: ${color}, and msg: ${msg}`);
    
    //debugging rendering issue at confirmation page
    const colorClasses = {
        green: 'bg-green-500',
        red: 'bg-red-500',
        // add more if needed
    }; 

    return (
        <>
        { showAlert ? (
            <div
            className={`text-white px-6 py-4 border-0 rounded relative mb-4 ${colorClasses[color]}`}
            > 
            <span className="text-xl inline-block mr-5 align-middle">
                <i className="fas fa-bell" />
            </span>
            <span className="inline-block align-middle mr-8">{msg}</span>
            <button
                className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
                onClick={() => setShowAlert(false)}
            >
                <span>X</span>
            </button>
          </div>
        ) : null
        }
        </>
    )
}

export default Alert;