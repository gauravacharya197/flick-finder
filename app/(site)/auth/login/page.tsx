import Login from "@/components/Auth/Login";


export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const code = resolvedSearchParams.code;

  return <Login code={code} />;
}

