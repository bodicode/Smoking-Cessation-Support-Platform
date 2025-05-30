import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../mutations/loginMutation';

export function useLogin() {
    return useMutation(LOGIN_MUTATION);
}
