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
        // Emit event khi user đăng nhập
        window.dispatchEvent(new Event('userChanged'));
    }, [dispatch]);

    const logout = useCallback(() => {
        dispatch(clearUser());
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        // Emit event khi user logout
        window.dispatchEvent(new Event('userChanged'));
    }, [dispatch]);

    return { user, login, logout };
}
