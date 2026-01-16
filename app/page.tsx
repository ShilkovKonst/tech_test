import { Suspense } from "react";
import UnipileConnectionsClient from "@/components/UnipileConnectionsClient";

const UnipileConnections = () => {
  return (
    <Suspense fallback={null}>
      <UnipileConnectionsClient />
    </Suspense>
  );
};

export default UnipileConnections;
