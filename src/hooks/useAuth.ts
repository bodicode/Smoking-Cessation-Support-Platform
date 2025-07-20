import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setUser, clearUser } from "@/store/userSlice";
import { useCallback } from "react";

export function useAuth() {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const login = useCallback((userData: any) => {
        dispatch(setUser(userData));
        localStorage.setItem("access_token", userData.accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
    }, [dispatch]);

    const logout = useCallback(() => {
        dispatch(clearUser());
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
    }, [dispatch]);

    return { user, login, logout };
}
