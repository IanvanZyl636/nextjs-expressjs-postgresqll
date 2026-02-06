"use client";

import { processPayment } from "@/app/actions/payment.action";
import { ResponseModel } from "@nextjs-expressjs-postgresql/shared/models/response.model";
import { useActionState } from "react";

export function CheckOutButton() {
    const handleCheckout = async (prevState: ResponseModel, formData: FormData) => {
        const data = (await processPayment(prevState, formData)).data as any;

        const form = document.createElement("form");
        form.method = data.checkout.method;
        form.action = data.checkout.action;

        Object.entries(data.checkout.form).forEach(([key, value]: [string, any]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        
        return data;
    }

  const [state, handleAction] = useActionState(
    handleCheckout,
    {} as ResponseModel,
  );

  return (
    <form action={handleAction}>
      <input type="hidden" name="orderId" value="406655a3-771c-4d26-8374-dc7dd3368b99" />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        type="submit"
      >
        Check Out
      </button>
    </form>
  );
}
