import { CircularProgress } from '@mui/material';

export function SmallLoading() {
  return (
    <div className="flex justify-center flex-col text-center text-sm items-center w-full gap-4">

      <CircularProgress size={10} />

    </div>
  );
}
