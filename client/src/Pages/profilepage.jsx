import React from "react";
import Profile from "../Components/profile/profile";

const Profilepage = () => {
    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <Profile />
            </div>
        </>
    );
};

export default Profilepage;