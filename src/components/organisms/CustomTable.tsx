import { camelCaseToUpperCaseWords } from '@/lib/utils/camelCaseToWords';
import cc from 'classcat';
import { Check, Trash2, X } from 'lucide-react';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { PlusIcon } from '../atoms';
import useCommunitiesController from '../community/hooks/controller';
import { useStellarContractBadge } from '@/lib/stellar/transactions/hooks/useStellarContractBadge';

export interface CustomTableProps<T extends Record<string, any>>
  extends React.ComponentPropsWithoutRef<'div'> {
  childrenForEmptyTable: ReactNode;
  data?: T[];
  headers: string[];
  headersClassnames?: string[];
  status?: any;
  isLogged?: boolean;
  isCreated?: boolean;
}

export const CustomTable = <T extends Record<string, any>>({
  className,
  childrenForEmptyTable,
  data,
  headers,
  headersClassnames,
  isLogged,
  isCreated,
}: CustomTableProps<T>): ReactElement => {
  const hasRowsToDisplay = !!data && data.length > 0;
  const [isNewBadge, setIsNewBadge] = useState(false);
  const { stellarContractBadges } = useCommunitiesController();
  const [newBadgeData, setNewBadgeData] = useState<{
    name: string;
    issuer: string;
    score?: number | string;
  }>({
    name: '',
    issuer: '',
    score: '',
  });

  const isDisabled =
    !!newBadgeData.name && !!newBadgeData.issuer && !!newBadgeData.score;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setNewBadgeData({ name: '', issuer: '', score: '' });

    if (
      newBadgeData.score === undefined ||
      typeof newBadgeData.score === 'string'
    ) {
      return;
    }

    console.log('Badge enviado:', newBadgeData);

    const result = await stellarContractBadges.addBadge(
      newBadgeData.name,
      newBadgeData.issuer,
      newBadgeData.score
    );

    if (result.success) {
      console.log('Transaction successful:', result.txHash);
    } else {
      console.error('Transaction failed:', result.error);
    }

    setIsNewBadge(false);
  };

  useEffect(() => {
    console.log(newBadgeData.score);
    console.log(isDisabled);
  }, [newBadgeData, isDisabled]);

  const handleRemoveBadge = async (badge: any) => {
    console.log(badge);

    // const nameBadge = 'SQL0280';
    // const issuer = 'GCPZPQYGG3QBIRA5ZIKLD3WQWFGESFA453TUXHRMP7NZYTTERIK2CXGE';
    // const score = 5;

    // const result = await stellarContractBadges.removeBadge(
    //   nameBadge,
    //   issuer,
    //   score
    // );

    // if (result.success) {
    //   console.log('Transaction successful:', result.txHash);
    // } else {
    //   console.error('Transaction failed:', result.error);
    // }
  };

  return (
    <table className={cc(['custom-table bg-whiteOpacity008', className])}>
      <thead className="rounded-md">
        <tr>
          {headers.map((header, index) => {
            return (
              <th
                key={header}
                className={cc([
                  'text-left py-4 px-7',
                  headersClassnames?.[index],
                ])}
              >
                <span className="text-whiteOpacity05 text-sm font-light">
                  {camelCaseToUpperCaseWords(header)}
                </span>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody className="w-full">
        {hasRowsToDisplay ? (
          data.map((row, index) => {
            return (
              <tr key={index}>
                {headers.map(header => {
                  return (
                    <>
                      <td key={header} className="px-7 py-4">
                        {row[header] as ReactNode}
                      </td>
                    </>
                  );
                })}

                {isCreated && (
                  <td className="px-7 py-4 text-right">
                    <button
                      onClick={() => handleRemoveBadge(row)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-whiteOpacity05" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })
        ) : (
          <tr className={cc([{ hidden: hasRowsToDisplay }])}>
            <td colSpan={headers.length}>{childrenForEmptyTable}</td>
          </tr>
        )}
        {isLogged && (
          <tr>
            <td colSpan={headers.length} className="py-2">
              {isNewBadge ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex gap-2 items-center w-full">
                    <input
                      type="text"
                      placeholder="Badge name"
                      value={newBadgeData.name}
                      onChange={e =>
                        setNewBadgeData({
                          ...newBadgeData,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 rounded-lg p-2 bg-whiteOpacity008"
                    />
                    <input
                      type="text"
                      placeholder="Issuer"
                      value={newBadgeData.issuer}
                      onChange={e =>
                        setNewBadgeData({
                          ...newBadgeData,
                          issuer: e.target.value,
                        })
                      }
                      className="w-full bg-gray-700 rounded-lg p-2 bg-whiteOpacity008"
                    />
                    <input
                      type="number"
                      placeholder="Score"
                      value={newBadgeData.score}
                      onChange={e =>
                        setNewBadgeData({
                          ...newBadgeData,
                          score: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-700 rounded-lg p-2 bg-whiteOpacity008"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-lg"
                      disabled={!isDisabled}
                    >
                      <Check className="text-white w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg"
                      onClick={() => setIsNewBadge(false)}
                    >
                      <X className="text-white w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex gap-2 py-2 items-center">
                  <PlusIcon className="text-whiteOpacity05" />
                  <button onClick={() => setIsNewBadge(true)}>New Badge</button>
                </div>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
