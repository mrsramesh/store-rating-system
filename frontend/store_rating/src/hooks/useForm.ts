// src/hooks/useForm.ts
import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectSchema } from 'yup';
import { useMemo } from 'react';

export const useAppForm = <T extends Record<string, any>>(
  validationSchema: ObjectSchema<T>,
  defaultValues?: Partial<T>
): UseFormReturn<T> => {
  const formMethods = useForm<T>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
    mode: 'onChange',
  });

  return formMethods;
};