type RegisterOtpDevBadgeProps = {
  devOtp: string | null;
};

export default function RegisterOtpDevBadge({
  devOtp,
}: RegisterOtpDevBadgeProps) {
  if (!devOtp) return null;

  return (
    <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-3 text-center dark:border-yellow-700 dark:bg-yellow-950">
      <p className="text-xs font-medium uppercase tracking-wide text-yellow-600 dark:text-yellow-400">
        Dev Mode — Your OTP
      </p>
      <p className="mt-1 text-3xl font-bold tracking-[0.5em] text-yellow-800 dark:text-yellow-300">
        {devOtp}
      </p>
    </div>
  );
}
