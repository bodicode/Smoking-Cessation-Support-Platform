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
    }, [dispatch]);

    const logout = useCallback(() => {
        dispatch(clearUser());
        localStorage.removeItem("access_token");
    }, [dispatch]);

    return { user, login, logout };
}
