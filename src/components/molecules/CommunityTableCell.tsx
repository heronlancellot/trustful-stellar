import tailwindConfig from 'tailwind.config';
import { getEllipsedAddress } from '@/lib/utils/getEllipsedAddress';
import { UserIcon } from '@/components';

interface CommunityTableCellProps
  extends React.ComponentPropsWithoutRef<'div'> {
  issuerAddress: string;
}

export const CommunityTableCell = ({
  issuerAddress,
}: CommunityTableCellProps) => {
  const isStatus = issuerAddress === 'Pending' || issuerAddress === 'Completed';

  return (
    <div className="flex flex-row items-center h-7">
      {isStatus ? (
        <div
          className={`
            font-medium text-center px-4 py-1 rounded-full text-sm
            ${issuerAddress === 'Pending' ? 'text-whiteOpacity05 bg-[rgba(245,255,255,0.08)]' : 'text-brandGreen bg-darkGreenOpacity01'}
          `}
        >
          {issuerAddress}
        </div>
      ) : (
        <div>{issuerAddress}</div>
      )}
    </div>
  );
};
