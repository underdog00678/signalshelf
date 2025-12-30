import { Suspense } from "react";

import InboxClient from "./InboxClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-neutral-400">Loading inbox…</div>}>
      <InboxClient />
    </Suspense>
  );
}
