import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../mutations/auth/loginMutation';

export function useLogin() {
    return useMutation(LOGIN_MUTATION);
}
