import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="container-custom py-10">
      <LoadingSkeleton count={6} />
    </div>
  );
}
