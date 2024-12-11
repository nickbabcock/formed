import { type ActionFunctionArgs, redirect } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "~/components/Card";
import { Pie } from "~/components/Pie";
import { fakeData } from "~/lib/data";
import { Button } from "~/components/Button";
import { useAppSubmission, useCustomFields } from "~/store";
import { cx } from "class-variance-authority";
import { PencilSquare } from "~/icons/PencilSquare";
import { useForm } from "~/hooks/useForm";
import { FormFields } from "~/components/FormFields";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  await new Promise((res) => setTimeout(res, 1000));
  console.log("form saved", form);
  return redirect("/dashboard", 302);
}

type Entry = { Name: string; Age: number; Email: string } & {
  [key: string]: string | number;
};

const serverData: Entry[] = [];
function useServerData({ page }: { page: number }) {
  const submission = useAppSubmission();
  const customFields = useCustomFields();
  const [localData, setLocalData] = useState<Entry[]>([]);
  useEffect(() => {
    if (serverData.length !== 0) {
      return;
    }

    if (submission) {
      const submissionData = Object.fromEntries(
        submission.entries(),
      ) as Entry;
      submissionData.Age = +submissionData.Age;
      serverData.push(submissionData);
    }

    for (let i = 0; i < 10_000; i++) {
      serverData.push({
        ...fakeData(`${i}`),
        ...Object.fromEntries(customFields.map((x) => [x.label, ""]))
    });
    }

    setLocalData(serverData);
  }, [submission, customFields]);

  return useMemo(
    () => localData.slice(page * 50, (page + 1) * 50),
    [localData, page],
  );
}

export default function DashboardRoute() {
  const [dataUpdates, rerender] = useState(0);
  const [page, setPage] = useState(0);
  const data = useServerData({ page });

  const ageBuckets = useMemo(() => {
    const _ignored = dataUpdates; // mutating large list work around
    const buckets: number[] = [];
    for (const { Age: age } of data) {
      const ind = Math.floor((age + 1) / 10);
      const current = buckets[ind];
      buckets[ind] = (current ?? 0) + 1;
    }
    return buckets.map((bucket, i) => ({ x: `${(i + 1) * 10}`, y: bucket }));
  }, [data, dataUpdates]);

  const editDialog = useRef<HTMLDialogElement>(null);
  const [modalInstance, setModalInstance] = useState(0);
  const [editInstance, setEditInstance] = useState(0);
  const showEditModal = (instance: number) => () => {
    setEditInstance(instance);
    setModalInstance(modalInstance + 1);
    editDialog.current?.showModal();
  };

  const customFields = useCustomFields();
  const { formRef, valid } = useForm();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Card
        variant="ghost"
        className="mx-auto my-8 h-[400px] w-[600px] bg-gray-100 p-4"
      >
        <h2 className="all-small-caps text-center text-2xl tracking-wider text-slate-800">
          AGE GROUPS
        </h2>
        <Pie data={ageBuckets} />
      </Card>

      <table className="border-separate border-spacing-2">
        <caption className="text-xl font-semibold">Submissions</caption>
        <thead>
          <tr>
            {Object.keys(data[0] ?? {}).map((x, i) => (
              <th key={i}>{x}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((x, i) => (
            <tr key={i}>
              {Object.values(x).map((v, i) => (
                <td
                  key={i}
                  className={cx(typeof v === "number" && "text-right")}
                >
                  {v}
                </td>
              ))}
              <td>
                <Button variant="ghost">
                  <PencilSquare
                    className="brightness-75"
                    onClick={showEditModal(i)}
                  />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center gap-4">
        <Button
          variant="standard"
          disabled={page === 0}
          onClick={() => setPage((page) => page - 1)}
        >
          Previous
        </Button>
        <Button variant="standard" onClick={() => setPage((page) => page + 1)}>
          Next
        </Button>
      </div>
      <dialog
        className="rounded-lg border border-solid border-gray-400/50 px-4 py-4 shadow-md backdrop:bg-black/20 backdrop:backdrop-blur-sm sm:px-8 sm:py-6 lg:px-16 lg:py-8 dark:bg-slate-800 dark:text-slate-300"
        ref={editDialog}
      >
        <div key={modalInstance} className="flex">
          <form
            ref={formRef}
            className="flex flex-col gap-4"
            action="POST"
            onSubmit={(e) => {
              e.preventDefault();
              const newData = Object.fromEntries(
                new FormData(e.currentTarget).entries(),
              ) as Entry;
              for (const key of Object.keys(newData)) {
                if (typeof data[editInstance][key] === "number") {
                  newData[key] = +newData[key];
                }
              }

              data[editInstance] = newData;
              rerender((x) => x + 1);
              editDialog.current?.close();
            }}
          >
            <FormFields
              customFields={customFields}
              defaultValues={data[editInstance]}
            />
            <Button type="submit" disabled={!valid} className="w-fit self-end">
              Update
            </Button>
          </form>
          <Button
            variant="ghost"
            className="self-start text-white"
            onClick={() => editDialog.current?.close()}
          >
            X
          </Button>
        </div>
      </dialog>
    </div>
  );
}
