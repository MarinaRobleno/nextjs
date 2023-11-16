"use client";

import { useRef } from "react";

import { useCustomersStore } from "@/app/lib/store";

function StoreInitializer({ customers }: { customers: any }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useCustomersStore.setState({ customers });
    console.log("client", useCustomersStore.getState().customers);
    initialized.current = true;
  }

  return null;
}

export default StoreInitializer;
