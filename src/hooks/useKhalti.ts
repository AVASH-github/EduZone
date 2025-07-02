// src/hooks/useKhalti.ts
import { useState } from "react";
import axios from "axios";
import { KHALTI_CONFIG } from "../config/khaltiConfig";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { setAuthorizationHeader } from "@/hooks/fetch/useUser";

export interface PaymentRequest {
  amount: number; // Amount in paisa (1 NPR = 100 paisa)
  purchase_order_id: string; // Your unique order ID
  purchase_order_name: string; // Product or order name
  return_url: string; // Where to redirect after payment
  website_url: string; // Your website URL
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
}
 
export interface PaymentInitiateResponse {
  pidx: string; // Payment ID from Khalti
  payment_url: string; // URL where user will make payment
}
 
export interface PaymentLookupResponse {
  payment_id: string | number | (string | number)[] | null | undefined;
  transaction_id: string;
  status: "Completed" | "Pending" | "Failed";
  total_amount: number;
  purchase_order_id: string;
  purchase_order_name: string;
  mobile?: string;
}
 
type UseKhaltiOptions = {
  onSuccess?: (response: PaymentLookupResponse) => void;
  onError?: (error: Error) => void;
  autoRedirect?: boolean;
};


export function useKhalti({
  onSuccess,
  onError,
  autoRedirect = true,
}: UseKhaltiOptions = {}) {
  const [pidx, setPidx] = useState<string | null>(null);
  const [initiationError, setInitiationError] = useState<Error | null>(null);
  const [statusError, setStatusError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
 
const initiate = async (data: PaymentRequest) => {
  setIsLoading(true);
  setInitiationError(null);

  try {
    const response = await axios.post<PaymentInitiateResponse>(
      `${KHALTI_CONFIG.baseUrl}/epayment/initiate/`,
      data,
      {
        headers: {
          Authorization: `Key ${KHALTI_CONFIG.secretKey}`,
        },
      }
    );

    const paymentResponse = response.data;
    setPidx(paymentResponse.pidx);

    return paymentResponse;
  } catch (error: any) {
    console.error("Khalti initiate error response:", error.response?.data || error.message || error);
    setInitiationError(error as Error);
    onError?.(error as Error);
    return undefined;
  } finally {
    setIsLoading(false);
  }
};


 
  const checkPaymentStatus = async () => {
    if (!pidx) {
      throw new Error("Payment ID not found");
    }
 
    setIsLoading(true);
    setStatusError(null);
 
    try {
      const response = await axios.post<PaymentLookupResponse>(
        `${KHALTI_CONFIG.baseUrl}/epayment/lookup/`,
        { pidx }
      );
 
      const paymentStatus = response.data;
      if (paymentStatus.status === "Completed") {
        onSuccess?.(paymentStatus);
      }
 
      return paymentStatus;
    } catch (error) {
      setStatusError(error as Error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
 
  return {
    initiate,
    checkPaymentStatus,
    pidx,
    initiationError,
    statusError,
    isLoading,
  };
}