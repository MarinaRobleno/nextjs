"use client";

import { useRef } from "react";

import { useCustomersStore } from "@/app/lib/store";

function StoreInitializer({ customers }: { customers: any }) {
  const initialized = useRef(false);

  if (!initialized.current) {
    // Verificar si la longitud del array de customers coincide con la longitud del fetch
    if (
      customers &&
      customers.length !== useCustomersStore.getState().customers.length
    ) {
      useCustomersStore.setState({ customers });
      console.log("client", useCustomersStore.getState().customers);
      initialized.current = true;
    }
  }

  return null;
}

export default StoreInitializer;
