import { KeyRound } from "lucide-react";

type RegisterOtpContextProps = {
  registeredEmail: string;
};

export default function RegisterOtpContext({
  registeredEmail,
}: RegisterOtpContextProps) {
  return (
    <div className="text-center">
      <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-900/40">
        <KeyRound className="h-7 w-7 text-teal-600 dark:text-teal-400" />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enter the code sent to
      </p>

      <p className="font-semibold text-gray-800 dark:text-white">
        {registeredEmail}
      </p>
    </div>
  );
}
