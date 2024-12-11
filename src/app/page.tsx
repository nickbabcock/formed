"use client";
import { cx } from "class-variance-authority";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { PlusCircle } from "~/icons/PlusCircle";
import { SpinnerIcon } from "~/icons/Spinner";
import { useAppActions, useCustomFields } from "~/store";
import { useForm } from "~/hooks/useForm";
import { FormFields } from "~/components/FormFields";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Index() {
  const router = useRouter();
  const customFields = useCustomFields();
  const actions = useAppActions();

  const { formRef, valid } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitEnable = valid && !isSubmitting;

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        ref={formRef}
        method="post"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);
          const submission = new FormData(e.currentTarget);
          try {
            await new Promise((res) => setTimeout(res, 3000));
          } finally {
            setIsSubmitting(false);
          }
          actions.addSubmission(submission);
          router.push("/dashboard");
        }}
      >
        <Card className="flex flex-col px-4 py-4 sm:px-8 sm:py-6 lg:px-16 lg:py-8">
          <h1 className="pb-8 text-center text-4xl font-extrabold tracking-tight">
            Formed
          </h1>
          <FormFields
            customFields={customFields}
            onDeletion={(id) => actions.deleteCustomField(id)}
            onLabelChange={(id, label) =>
              actions.updateCustomFieldLabel(id, label)
            }
          />
          <div className="my-6 border border-gray-300 dark:border-gray-700" />
          <div className="flex flex-col items-end justify-between gap-x-8 gap-y-2 lg:flex-row">
            <Button variant="standard" onClick={() => actions.addCustomField()}>
              <PlusCircle className="mr-2" /> add another field
            </Button>

            <Button disabled={!submitEnable} type="submit" className="relative">
              <span className={cx(isSubmitting && "invisible")}>Submit</span>
              {isSubmitting ? (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <SpinnerIcon className="size-5 animate-spin" />
                </div>
              ) : null}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
