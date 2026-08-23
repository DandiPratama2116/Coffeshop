import OrderView from '../_components/OrderView';

export default async function OrderPage({
  params,
}: {
  params: Promise<{ tableId: string }>;
}) {
  const resolvedParams = await params;
  const { tableId } = resolvedParams;

  return <OrderView tableId={tableId} />;
}
