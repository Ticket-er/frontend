import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fundWallet,
  checkWalletBalance,
  withdrawFromWallet,
  getWalletTransactions,
} from "./wallet";
import type { FundWalletPayload, WithdrawPayload } from "@/types/wallet.type";

// Fund wallet (initiate payment)
export const useFundWallet = () =>
  useMutation({
    mutationFn: (data: FundWalletPayload) => fundWallet(data),

    onSuccess: ({ checkoutUrl }) => {
      window.location.href = checkoutUrl;
    },
  });

// Get wallet balance
export const useWalletBalance = () =>
  useQuery({
    queryKey: ["wallet-balance"],
    queryFn: checkWalletBalance,
  });

// Withdraw from wallet
export const useWithdrawWallet = () =>
  useMutation({
    mutationFn: (data: WithdrawPayload) => withdrawFromWallet(data),
  });

// Get all wallet transactions
export const useWalletTransactions = () =>
  useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: getWalletTransactions,
  });
