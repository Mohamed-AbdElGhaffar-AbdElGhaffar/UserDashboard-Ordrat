'use client';

import { Button, Title, Text } from 'rizzui';

interface TableFooterProps {
  checkedItems: string[];
  lang?: string;
  handleDelete: (ids: string[]) => void;
}

export default function TableFooter({
  checkedItems,
  lang='en',
  handleDelete,
  children,
}: React.PropsWithChildren<TableFooterProps>) {
  if (checkedItems.length === 0) {
    return null;
  }
  const text = {
    selected: lang === 'ar' ? 'اختيار' : 'selected',
    deleteThem: lang === 'ar' ? 'احذفهم' : 'Delete Them',
  };
  return (
    <div className="sticky bottom-0 left-0 z-10 mt-2.5 flex w-full items-center justify-between rounded-md border border-gray-300 bg-gray-0 px-5 py-3.5 text-gray-900 shadow-sm dark:border-gray-300 dark:bg-gray-100 dark:text-white dark:active:bg-gray-100">
      <div>
        <Text as="strong">{checkedItems.length}</Text> {text.selected}{' '}
        <Button
          size="sm"
          variant="text"
          className="underline"
          color="danger"
          onClick={() => {
            handleDelete(checkedItems);
          }}
        >
          {text.deleteThem}
        </Button>
      </div>
      {children}
    </div>
  );
}
