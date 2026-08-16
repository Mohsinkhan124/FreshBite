import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = { title: "Reset password" };

/**
 * The backend emails a link shaped /reset-password/:token (see
 * forgotPassword's resetLink). The flat /reset-password page from an
 * earlier feature had no way to receive that token, so this dynamic
 * segment was added alongside it — the flat page now serves as a
 * fallback for anyone who lands on /reset-password without one.
 */
export default async function ResetPasswordTokenPage({ params }) {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}
