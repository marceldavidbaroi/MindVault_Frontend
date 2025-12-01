import TransactionIndex from "@/components/transaction/TransactionIndex";
import { cookies } from "next/headers";

interface TransactionPageProps {
  params: Promise<{ id?: string }>;
}

const TransactionPage = async ({ params }: TransactionPageProps) => {
  const resolvedParams = await params; // ✅ MUST await params

  const cookieStore = await cookies();

  const accountId = resolvedParams?.id ? Number(resolvedParams.id) : null;

  return (
    <div>
      <TransactionIndex selectedAccountId={accountId} />
    </div>
  );
};

export default TransactionPage;
