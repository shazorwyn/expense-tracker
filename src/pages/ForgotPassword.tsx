import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const { sendResetEmail } = useAuth();
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setStatus('idle');
    try {
      await sendResetEmail(values.email);
      // Always show success, whether or not the email exists, to avoid leaking
      // which addresses are registered.
      setStatus('sent');
    } catch (err) {
      setStatus('sent');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 dark:text-gray-100">Reset your password</h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Enter the email you signed up with and we'll send you a reset link.
          </p>
        </div>

        <div className="card">
          {status === 'sent' ? (
            <div className="space-y-4 text-center">
              <div className="rounded-lg bg-income-50 px-3 py-2 text-sm text-income-600">
                If an account exists for that email, a password reset link is on its way. Check your inbox
                (and spam folder).
              </div>
              <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Remembered it after all?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
