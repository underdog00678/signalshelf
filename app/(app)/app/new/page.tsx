"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SignalForm from "../../../../components/signals/SignalForm";

type SignalStatus = "inbox" | "reading" | "done";

type SignalFormValue = {
  url: string;
  title: string;
  notes: string;
  tags: string[];
  status: SignalStatus;
};

export default function Page() {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState<Record<string, string>>();

  const initialValue = useMemo<SignalFormValue>(
    () => ({
      url: "",
      title: "",
      notes: "",
      tags: [],
      status: "inbox",
    }),
    []
  );

  const handleSubmit = async (value: SignalFormValue) => {
    setApiErrors(undefined);

    const response = await fetch("/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });

    if (response.status === 201) {
      const data = (await response.json()) as { item?: { id?: string } };
      if (data.item?.id) {
        router.push(`/app/inbox/${data.item.id}`);
        return;
      }
      router.push("/app/inbox");
      return;
    }

    if (response.status === 400) {
      const data = (await response.json()) as { errors?: Record<string, string> };
      setApiErrors(data.errors ?? { form: "Please review the form." });
      return;
    }

    setApiErrors({ form: "Something went wrong. Please try again." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/app/inbox"
          className="text-sm text-neutral-400 transition hover:text-neutral-200"
        >
          Back to inbox
        </Link>
        <h1 className="text-2xl font-semibold text-neutral-100">New</h1>
        <p className="text-neutral-400">
          Save a link and come back to it later.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <SignalForm
          mode="create"
          initialValue={initialValue}
          submitLabel="Create signal"
          onSubmit={handleSubmit}
          apiErrors={apiErrors}
        />
      </div>
    </div>
  );
}
