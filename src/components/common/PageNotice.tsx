interface PageNoticeProps {
  error?: string;
  success?: string;
}

export function PageNotice({ error, success }: PageNoticeProps) {
  if (error) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
        {decodeURIComponent(error)}
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
        {success}
      </div>
    );
  }

  return null;
}
