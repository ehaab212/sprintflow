export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Project {projectId}</h1>
      <p className="text-muted-foreground">Placeholder for project dashboard and backlog.</p>
    </div>
  );
}
