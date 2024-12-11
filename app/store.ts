import { create } from "zustand";

export type CustomFieldId = number;
export type CustomField = {
  id: CustomFieldId;
  label: string;
};

type AppState = {
  customFieldId: CustomFieldId;
  customFields: CustomField[];
  submission?: FormData;
  actions: {
    addSubmission: (submission: FormData) => void;
    addCustomField: () => void;
    deleteCustomField: (id: CustomFieldId) => void;
    updateCustomFieldLabel: (id: CustomFieldId, label: string) => void;
  };
};

export const useAppStore = create<AppState>()((set) => ({
  customFieldId: 0,
  customFields: [],
  submission: undefined,
  actions: {
    addSubmission: (submission) => set({ submission }),
    addCustomField: () =>
      set((state) => ({
        customFieldId: state.customFieldId + 1,
        customFields: [
          ...state.customFields,
          { id: state.customFieldId, label: "text" },
        ],
      })),
    deleteCustomField: (id: number) =>
      set((state) => ({
        customFields: state.customFields.filter((x) => x.id !== id),
      })),
    updateCustomFieldLabel: (id: number, label: string) =>
      set((state) => ({
        customFields: state.customFields.map((x) =>
          x.id === id ? { ...x, label } : x,
        ),
      })),
  },
}));

export const useAppActions = () => useAppStore((x) => x.actions);

export const useCustomFields = () => useAppStore((x) => x.customFields);

export const useAppSubmission = () => {
  const submission = useAppStore((x) => x.submission);

  return submission;
  // return useMemo(() => {
  //   const fields =

  //   const result = [];
  //   // for (let i = 0; i < 1000; i++) {
  //   //   result.push(fakeName(`${i}`));
  //   // }

  //   return result;
  // }, [submission]);
};
