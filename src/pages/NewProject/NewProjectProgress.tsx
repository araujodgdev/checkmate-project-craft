
type Props = {
  step: number;
  totalSteps: number;
};

export function NewProjectProgress({ step, totalSteps }: Props) {
  return (
    <div className="w-full bg-muted h-2 rounded-full mb-8 overflow-hidden">
      <div
        className="bg-primary h-full transition-all duration-500 ease-in-out"
        style={{ width: `${(step / totalSteps) * 100}%` }}
      />
    </div>
  );
}
