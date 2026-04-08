'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateProjectSchema, UpdateProjectSchema } from '@/validators';
import { createProject, updateProject, deleteProject } from './services';

export async function createProjectAction(prevState: any, formData: FormData) {
  let projectId: string | null = null;

  try {
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string | undefined,
      status: formData.get('status') as string | undefined,
      priority: formData.get('priority') as string | undefined,
      dueDate: formData.get('dueDate') as string | undefined,
      progressMode: formData.get('progressMode') as string | undefined,
      manualProgress: formData.get('manualProgress')
        ? parseInt(formData.get('manualProgress') as string)
        : undefined,
    };

    const validated = CreateProjectSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    const project = await createProject(validated.data);
    projectId = project.id;
    revalidatePath('/projects');
  } catch (error) {
    return { error: '创建项目失败' };
  }

  redirect(`/projects/${projectId}`);
}

export async function updateProjectAction(prevState: any, formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) {
    return { error: '缺少项目ID' };
  }

  try {
    const data = {
      title: formData.get('title') as string | undefined,
      description: formData.get('description') as string | undefined,
      status: formData.get('status') as string | undefined,
      priority: formData.get('priority') as string | undefined,
      dueDate: formData.get('dueDate') as string | undefined,
      progressMode: formData.get('progressMode') as string | undefined,
      manualProgress: formData.get('manualProgress')
        ? parseInt(formData.get('manualProgress') as string)
        : undefined,
    };

    const validated = UpdateProjectSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    await updateProject(id, validated.data);
    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);
    return { error: null };
  } catch (error) {
    return { error: '更新项目失败' };
  }
}

export async function deleteProjectAction(id: string) {
  let deleted = false;

  try {
    await deleteProject(id);
    revalidatePath('/projects');
    deleted = true;
  } catch (error) {
    return { error: '删除项目失败' };
  }

  if (deleted) {
    redirect('/projects');
  }
}

export async function updateProjectStatusAction(projectId: string, status: string) {
  try {
    await updateProject(projectId, { status });
    revalidatePath('/projects');
    revalidatePath(`/projects/${projectId}`);
    return { error: null };
  } catch (error) {
    return { error: '更新项目状态失败' };
  }
}
