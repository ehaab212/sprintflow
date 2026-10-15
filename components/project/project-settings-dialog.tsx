'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProjectSchema, UpdateProjectInput } from '@/lib/validations/project';
import { updateProjectAction } from '@/actions/project';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Settings, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ProjectStatus } from '@prisma/client';

interface ProjectSettingsDialogProps {
  projectId: string;
  initialData: {
    name: string;
    description?: string | null;
    status: ProjectStatus;
  };
  trigger?: React.ReactNode;
}

export function ProjectSettingsDialog({
  projectId,
  initialData,
  trigger,
}: ProjectSettingsDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description || '',
      status: initialData.status,
    },
  });

  const onSubmit = async (data: UpdateProjectInput) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      setSuccessMessage(null);

      const result = await updateProjectAction(projectId, data);

      if (!result.success) {
        setFormError(result.error || 'Failed to update project settings.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage('Project settings saved successfully.');
      setTimeout(() => {
        setOpen(false);
        setSuccessMessage(null);
        router.refresh();
      }, 800);
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormError(null);
      setSuccessMessage(null);
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
              <Button {...props} variant="outline" size="icon" title="Project Settings">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Project Settings</span>
              </Button>
            )
          )
        }
      />

      <DialogPopup>
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle>Project Settings</DialogTitle>
            <DialogDescription className="mt-1">
              Update project details and status. Restricted to Owners and Admins.
            </DialogDescription>
          </div>
        </div>

        {formError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3.5 text-sm text-green-500 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="settings-project-name" className="text-sm font-medium text-foreground">
              Project Name <span className="text-destructive">*</span>
            </label>
            <input
              id="settings-project-name"
              type="text"
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
            <label htmlFor="settings-project-description" className="text-sm font-medium text-foreground">
              Description <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
            </label>
            <textarea
              id="settings-project-description"
              rows={3}
              disabled={isSubmitting}
              {...register('description')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-project-status" className="text-sm font-medium text-foreground">
              Status
            </label>
            <select
              id="settings-project-status"
              disabled={isSubmitting}
              {...register('status')}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
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
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
