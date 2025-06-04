import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../mutations/signupMutation';

export function useSignup() {
    return useMutation(SIGNUP_MUTATION);
}
