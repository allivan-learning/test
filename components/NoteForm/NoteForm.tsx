import css from './NoteForm.module.css';
import { useId } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { NoteTag } from '@/types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';

interface NoteFormValuesProps {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onClose: () => void;
}

const initialValues: NoteFormValuesProps = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Maximum 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleSubmitForm = async (
    values: NoteFormValuesProps,
    actions: FormikHelpers<NoteFormValuesProps>,
  ) => {
    try {
      await mutation.mutateAsync(values);
      actions.resetForm();
      onClose();
    } catch {
      // При ошибке сохраняем введённые значения.
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          {mutation.isError && (
            <p className={css.error}>
              Could not create note. Please try again.
            </p>
          )}
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
