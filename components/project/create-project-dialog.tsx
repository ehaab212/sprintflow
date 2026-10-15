'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, CreateProjectInput } from '@/lib/validations/project';
import { createProjectAction } from '@/actions/project';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Loader2, AlertCircle, FolderKanban } from 'lucide-react';

interface CreateProjectDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateProjectDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      const result = await createProjectAction(data);

      if (!result.success) {
        setFormError(result.error || 'Failed to create project.');
        setIsSubmitting(false);
        return;
      }

      // Reset and close dialog
      reset();
      setOpen(false);

      // Navigate to the newly created project
      if (result.data?.slug) {
        router.push(`/projects/${result.data.slug}`);
      }
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setFormError(null);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ? (
            (props) => <div {...props}>{trigger}</div>
          ) : (
            (props) => (
              <Button {...props} className="shrink-0 gap-2">
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Button>
            )
          )
        }
      />

      <DialogPopup>
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription className="mt-1">
              Start a new agile project to organize stories, sprints, and tasks.
            </DialogDescription>
          </div>
        </div>

        {formError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="project-name" className="text-sm font-medium text-foreground">
              Project Name <span className="text-destructive">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              placeholder="e.g. SprintFlow SaaS Overhaul"
              disabled={isSubmitting}
              {...register('name')}
              className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.name ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="project-description" className="text-sm font-medium text-foreground">
              Description <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
            </label>
            <textarea
              id="project-description"
              rows={3}
              placeholder="Brief description of the project goals, scope, and target outcomes..."
              disabled={isSubmitting}
              {...register('description')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
