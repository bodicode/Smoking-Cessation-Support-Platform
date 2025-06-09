import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

export function useHydrateUser() {
    const dispatch = useDispatch();
    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            if (userData && userData.accessToken) {
                dispatch(setUser(userData));
            }
        }
    }, [dispatch]);
}
