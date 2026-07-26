import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { updateUserName } from '../services/userService';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(60),
});
type FormValues = z.infer<typeof schema>;

export default function Profile() {
  const { currentUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: currentUser?.displayName ?? '' },
  });

  async function onSubmit(values: FormValues) {
    if (!currentUser) return;
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateUserName(currentUser, values.name);
      setSuccessMessage('Profile updated successfully.');
    } catch (err) {
      setErrorMessage('Could not update profile. Please try again.');
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account details.</p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <User size={28} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{currentUser?.displayName ?? 'User'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {successMessage && (
            <div className="rounded-lg bg-income-50 px-3 py-2 text-sm text-income-600">{successMessage}</div>
          )}
          {errorMessage && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div>}
          <Input label="Full Name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" value={currentUser?.email ?? ''} disabled />
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
