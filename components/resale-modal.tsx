"use client";

import { Ticket } from "@/types/tickets.type";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, formatPrice } from "@/lib/dummy-data";
import { useState } from "react";
import { useBankCodes } from "@/api/banks/bank.queries";
import { Bank } from "@/types/bank.type";

interface ResaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTicket: Ticket | null;
  onConfirmResale: (payload: {
    resalePrice: string;
    bankCode: string;
    accountNumber: string;
  }) => void;
  isPending: boolean;
}

export function ResaleModal({
  isOpen,
  onClose,
  selectedTicket,
  onConfirmResale,
  isPending,
}: ResaleModalProps) {
  const [resalePrice, setResalePrice] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const { data: banks, isLoading, error } = useBankCodes();



  const handleSubmit = () => {
    if (!resalePrice || !bankCode || !accountNumber) return;
    onConfirmResale({ resalePrice, bankCode, accountNumber });
    setResalePrice("");
    setBankCode("");
    setAccountNumber("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setResalePrice("");
        setBankCode("");
        setAccountNumber("");
      }}
      title="List Ticket for Resale"
      className="max-w-lg rounded-xl"
    >
      {selectedTicket && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {selectedTicket.event.name}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedTicket.event.location}
            </p>
            <p className="text-sm text-gray-600">
              {formatDate(selectedTicket.event.date)}
            </p>
            <p className="text-sm text-gray-600">
              Ticket #{selectedTicket.code}
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Original Price:</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(selectedTicket.event.price)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="resalePrice"
              className="text-sm font-medium text-gray-900"
            >
              Resale Price (₦) *
            </label>
            <Input
              id="resalePrice"
              type="number"
              placeholder="Enter resale price"
              value={resalePrice}
              onChange={(e) => setResalePrice(e.target.value)}
              min="0"
              step="100"
            />
            <p className="text-xs text-gray-500">
              You'll receive ₦
              {Math.round(
                Number.parseFloat(resalePrice || "0") * 0.95
              ).toLocaleString()}{" "}
              after 5% service fee
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="bankCode"
              className="text-sm font-medium text-gray-900"
            >
              Select Bank *
            </label>
            <select
              id="bankCode"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700"
            >
              <option value="">-- Select your bank --</option>
              {banks?.map((bank: Bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Pick your bank from the list
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="accountNumber"
              className="text-sm font-medium text-gray-900"
            >
              Account Number *
            </label>
            <Input
              id="accountNumber"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter your 10-digit account number
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Once listed, your ticket will be available
              for purchase by other users. You can remove the listing anytime
              before it's sold.
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent border-gray-300 hover:bg-gray-100"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleSubmit}
              disabled={
                !resalePrice ||
                Number.parseFloat(resalePrice) <= 0 ||
                !bankCode ||
                !accountNumber ||
                isPending
              }
            >
              {isPending ? "Listing..." : "List for Sale"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
