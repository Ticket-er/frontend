import { useMutation } from "@tanstack/react-query";
import {
  login,
  register,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
} from "./auth";
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "@/types/auth.type";

export const useRegister = () =>
  useMutation({
    mutationFn: (dto: RegisterDto) => register(dto),
  });

export const useLogin = () =>
  useMutation({
    mutationFn: async (dto: LoginDto) => {
      const data = await login(dto);
      //  Store user and token on successful login
      localStorage.setItem("ticketer-user", JSON.stringify(data.user));
      localStorage.setItem("ticketer-token", data.access_token);
      return data;
    },
  });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: (dto: VerifyOtpDto) => verifyOtp(dto),
  });

export const useResendOtp = () =>
  useMutation({
    mutationFn: (dto: ResendOtpDto) => resendOtp(dto),
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (dto: ForgotPasswordDto) => forgotPassword(dto),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (dto: ResetPasswordDto) => resetPassword(dto),
  });
