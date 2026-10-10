import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/packages/db/auth/auth";
import Onboarding from "@/authorizations/onboarding/onboarding";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  // A username means onboarding is already done.
  if (session.user.username) redirect("/home");

  return <Onboarding />;
}