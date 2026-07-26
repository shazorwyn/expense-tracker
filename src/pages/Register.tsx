import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FirebaseError } from 'firebase/app';
import { Wallet } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required').max(60),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailInUse, setEmailInUse] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setAuthError(null);
    setEmailInUse(false);
    try {
      await registerUser(values.name, values.email, values.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err instanceof FirebaseError && err.code === 'auth/email-already-in-use') {
        setEmailInUse(true);
      } else {
        setAuthError('Could not create account. Please try again.');
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Wallet size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create your account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Start tracking your finances today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {authError && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{authError}</div>
            )}
            {emailInUse && (
              <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                An account with this email already exists.{' '}
                <Link to="/login" className="font-medium underline">
                  Sign in
                </Link>{' '}
                or{' '}
                <Link to="/forgot-password" className="font-medium underline">
                  reset your password
                </Link>{' '}
                instead.
              </div>
            )}
            <Input label="Full Name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
