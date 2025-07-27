"use client";

import { useState } from "react";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWithdrawWallet } from "@/api/wallet/wallet.queries";
import { toast } from "sonner";
import { formatPrice } from "@/lib/dummy-data";
import { useAuth } from "@/lib/auth-context";

// Define Zod schema for WithdrawPayload
const createWithdrawPayloadSchema = (availableBalance: number) =>
  z.object({
    amount: z
      .number({ invalid_type_error: "Please enter a valid amount" })
      .positive("Amount must be greater than 0")
      .max(
        availableBalance,
        `Amount cannot exceed ${formatPrice(availableBalance)}`
      ),
    account_number: z
      .string()
      .regex(/^\d{10}$/, "Please enter a valid 10-digit account number"),
    bank_code: z.string().min(1, "Please select a bank"),
    narration: z.string().optional(),
  });

// Infer type from Zod schema
type WithdrawPayload = z.infer<
  ReturnType<typeof createWithdrawPayloadSchema>
> & {
  email: string;
  name: string;
};

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export function PayoutModal({
  isOpen,
  onClose,
  availableBalance,
}: PayoutModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<
    Omit<WithdrawPayload, "email" | "name">
  >({
    amount: 0,
    account_number: "",
    bank_code: "",
    narration: "",
  });
  const { mutateAsync: requestPayout, isPending } = useWithdrawWallet();
  const banks = [
    { code: "044", name: "Access Bank" },
    { code: "063", name: "Diamond Bank" },
    { code: "035", name: "GTBank" },
    { code: "057", name: "Zenith Bank" },
  ];

  const handleSubmit = async () => {
    // Validate user data from auth context
    if (!user) {
      toast.error("User not authenticated");
      return;
    }
    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      toast.error("Invalid user email address");
      return;
    }
    if (!user.name || user.name.trim().length < 2) {
      toast.error("Invalid user name");
      return;
    }

    const schema = createWithdrawPayloadSchema(availableBalance);
    const result = schema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message).join(", ");
      toast.error(errors);
      return;
    }

    try {
      await requestPayout({
        ...formData,
        email: user.email,
        name: user.name,
        narration: formData.narration || undefined, // Pass undefined if empty
      });
      onClose();
      setFormData({
        amount: 0,
        account_number: "",
        bank_code: "",
        narration: "",
      });
    } catch (error: any) {}
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Payout"
      className="max-w-lg bg-white shadow-lg rounded-xl"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            ₦{formatPrice(availableBalance)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Payout Amount
          </label>
          <Input
            type="number"
            name="amount"
            value={formData.amount || ""}
            onChange={handleInputChange}
            placeholder="Enter amount"
            className="bg-gray-50 border-gray-200 rounded-xl"
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Bank
          </label>
          <Select
            value={formData.bank_code}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, bank_code: value }))
            }
            disabled={isPending}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl">
              <SelectValue placeholder="Select a bank" />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.code} value={bank.code}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Account Number
          </label>
          <Input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleInputChange}
            placeholder="Enter account number"
            className="bg-gray-50 border-gray-200 rounded-xl"
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Narration (Optional)
          </label>
          <Input
            type="text"
            name="narration"
            value={formData.narration}
            onChange={handleInputChange}
            placeholder="Enter narration (optional)"
            className="bg-gray-50 border-gray-200 rounded-xl"
            disabled={isPending}
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Payouts are processed within 3-5 business
            days. Ensure your bank details are correct to avoid delays.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex-1 bg-transparent border-gray-300 hover:bg-gray-100 text-gray-900"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Processing..." : "Request Payout"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
