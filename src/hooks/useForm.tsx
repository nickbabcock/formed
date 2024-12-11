"use client";
import { useState } from "react";

export const useForm = () => {
  const [valid, setValid] = useState(true);

  const formRef = (node: HTMLFormElement) => {
    const callback = () => {
      setValid(node.checkValidity());
    };

    const observer = new MutationObserver(callback);
    observer.observe(node, { childList: true, subtree: true });
    setValid(node.checkValidity());

    node.addEventListener("input", callback);
    return () => {
      observer.disconnect();
      node.removeEventListener("input", callback);
    };
  };

  return {
    valid,
    formRef,
  };
};
