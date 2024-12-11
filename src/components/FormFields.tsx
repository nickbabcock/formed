import { FormField } from "~/components/FormField";
import { CustomField, CustomFieldId } from "~/store";

export function FormFields({
  customFields,
  defaultValues,
  onLabelChange,
  onDeletion,
}: {
  customFields: CustomField[];
  defaultValues?: Record<string, string | number>;
  onLabelChange?: (id: CustomFieldId, label: string) => void;
  onDeletion?: (id: CustomFieldId) => void;
}) {
  return (
    <div className="flex w-min flex-col gap-2">
      <FormField
        label="Name"
        className="min-w-64 px-4 pb-3 pt-5"
        defaultValue={defaultValues?.["Name"]}
        required
      />

      <FormField
        label="Email"
        className="w-64 px-4 pb-3 pt-5"
        type="email"
        required
        defaultValue={defaultValues?.["Email"]}
      />

      <FormField
        label="Age"
        className="w-20 px-4 pb-3 pt-5 text-right"
        type="number"
        min={0}
        max={200}
        required
        defaultValue={defaultValues?.["Age"]}
      />

      {customFields.map((x) => (
        <FormField
          key={x.id}
          label={x.label}
          className="w-64 px-4 pb-3 pt-5"
          required
          onLabelChange={
            onLabelChange ? (label) => onLabelChange(x.id, label) : undefined
          }
          onDeletion={onDeletion ? () => onDeletion(x.id) : undefined}
          defaultValue={defaultValues?.[x.label]}
        />
      ))}
    </div>
  );
}
