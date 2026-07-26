import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { getCategoriesForType } from '../../utils/categories';
import { todayISO } from '../../utils/formatters';
import type { NewTransaction, Transaction, TransactionType } from '../../types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().max(300).optional(),
});

type FormValues = z.infer<typeof schema>;

interface TransactionFormProps {
  initialValues?: Transaction;
  onSubmit: (values: NewTransaction) => Promise<void>;
  onCancel: () => void;
}

export default function TransactionForm({ initialValues, onSubmit, onCancel }: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues
      ? {
          title: initialValues.title,
          amount: initialValues.amount,
          type: initialValues.type,
          category: initialValues.category,
          date: initialValues.date,
          notes: initialValues.notes ?? '',
        }
      : {
          title: '',
          amount: 0,
          type: 'expense' as TransactionType,
          category: '',
          date: todayISO(),
          notes: '',
        },
  });

  const type = watch('type');

  useEffect(() => {
    const categories = getCategoriesForType(type);
    if (!categories.includes(watch('category'))) {
      setValue('category', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  async function submitHandler(values: FormValues) {
    await onSubmit({
      title: values.title,
      amount: values.amount,
      type: values.type,
      category: values.category,
      date: values.date,
      notes: values.notes || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <Input label="Title" placeholder="e.g. Grocery shopping" error={errors.title?.message} {...register('title')} />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select label="Type" {...field}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
          )}
        />
        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" error={errors.category?.message} {...register('category')}>
          <option value="">Select a category</option>
          {getCategoriesForType(type).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
      </div>

      <div>
        <label className="label">Notes (optional)</label>
        <textarea className="input" rows={3} placeholder="Add any details..." {...register('notes')} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialValues ? 'Save Changes' : 'Add Transaction'}
        </Button>
      </div>
    </form>
  );
}
