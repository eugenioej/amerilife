import RequestSupportHeader from "@/app/components/request-support/RequestSupportHeader";
import RequestSupportBody from "@/app/components/request-support/RequestSupportBody";
import RequestSupportFooter from "@/app/components/request-support/RequestSupportFooter";

export default function Page() {
  return (
    <div className="request-support-page min-h-screen bg-white">
      <RequestSupportHeader />
      <RequestSupportBody />
      <RequestSupportFooter />
    </div>
  );
}

