import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type SynamatrixUser = {
  id: string;
  email: string | null;
  phone: string | null;
  displayName: string;
  identityKey: string;
};

export async function getSynamatrixUser(): Promise<SynamatrixUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  const email = user.primaryEmailAddress?.emailAddress
    ?? user.emailAddresses[0]?.emailAddress
    ?? null;
  const phone = user.primaryPhoneNumber?.phoneNumber
    ?? user.phoneNumbers[0]?.phoneNumber
    ?? null;
  const displayName = user.fullName
    || user.username
    || email
    || phone
    || "Synamatrix 用户";

  return {
    id: user.id,
    email,
    phone,
    displayName,
    identityKey: email?.toLowerCase() || `clerk:${user.id}`,
  };
}

export async function requireSynamatrixUser(returnTo: string): Promise<SynamatrixUser> {
  const user = await getSynamatrixUser();
  if (user) return user;
  redirect(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
}
