import ProjectForm from "./ProjectForm"

type Props = {
  onSuccess: () => void
}

/** @deprecated Use ProjectForm — kept for existing imports */
export default function ProjectCreateForm({ onSuccess }: Props) {
  return <ProjectForm onSuccess={onSuccess} />
}
