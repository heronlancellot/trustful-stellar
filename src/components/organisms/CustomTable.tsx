import { camelCaseToUpperCaseWords } from '@/lib/utils/camelCaseToWords';
import cc from 'classcat';
import { Check, Trash2, X } from 'lucide-react';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { PlusIcon } from '../atoms';
import useCommunitiesController from '../community/hooks/controller';
import { useStellarContractBadge } from '@/lib/stellar/transactions/hooks/useStellarContractBadge';
import toast from 'react-hot-toast';

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
  const { stellarContractBadges, stellarContractRemoveBadges } = useCommunitiesController();

  const [newBadgeData, setNewBadgeData] = useState({
    name: '',
    issuer: '',
    score: '',
  });

  const isFormValid = newBadgeData.name && newBadgeData.issuer && newBadgeData.score;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || typeof newBadgeData.score === 'string' && !newBadgeData.score) {
      return;
    }

    const score = Number(newBadgeData.score);

    try {
      const result = await stellarContractBadges.addBadge(
        newBadgeData.name,
        newBadgeData.issuer,
        score
      );

      if (result.success) {
        console.log(`Badge ${newBadgeData.name} added successfully`);
        toast.success(`Badge ${newBadgeData.name} added successfully`);
        setIsNewBadge(false);
        setNewBadgeData({ name: '', issuer: '', score: '' });
      } else {
        console.error('Failed to add badge:', result.error);
      }
    } catch (error) {
      console.error('Error processing badge addition:', error);
    }
  };

  const handleBadgeInputChange = (field: 'name' | 'issuer' | 'score', value: string) => {
    setNewBadgeData({
      ...newBadgeData,
      [field]: value
    });
  };

  const handleRemoveBadge = async (badge: any) => {
    try {
      const badgeName = badge.Name?.props?.issuerAddress || '';
      const score = badge.Score?.props?.issuerAddress ?
        Number(badge.Score.props.issuerAddress) :
        (badgeName.length > 0 ? Number(badgeName.charAt(badgeName.length - 1)) : undefined);

      const issuerAddress = "GD7IDV44QE7CN35M2QLSAISAYPSOSSZTV7LWMKBU5PKDS7NQKTFRZUTS";

      if (!badgeName || !issuerAddress || score === undefined || isNaN(score)) {
        console.error('Insufficient data for badge removal');
        return;
      }

      if (!stellarContractRemoveBadges) {
        console.error('Badge removal service not available');
        return;
      }

      const result = await stellarContractRemoveBadges.removeBadge(
        badgeName,
        issuerAddress
      );

      if (result.success) {
        console.log(`Badge ${badgeName} successfully removed`);
        // Update interface (could add window.location.reload() or other updates)
      } else {
        console.error('Transaction failed:', result.error);
        alert(`Failed to remove badge: ${result.error}`);
      }
    } catch (error) {
      console.error('Error in removal operation:', error);
      alert('An error occurred while processing the badge removal.');
    }
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
                  'text-left py-4 px-7 border-none',
                  headersClassnames?.[index],
                ])}
              >
                <span className="text-whiteOpacity05 text-sm font-light">
                  {camelCaseToUpperCaseWords(header)}
                </span>
              </th>
            );
          })}
          {isCreated && (
            <th className="text-right py-4 px-7 border-none">
              <span className="text-whiteOpacity05 text-sm font-light"></span>
            </th>
          )}
        </tr>
      </thead>

      <tbody className="w-full">
        {hasRowsToDisplay ? (
          data.map((row, index) => {
            return (
              <tr key={index}>
                {headers.map(header => (
                  <td key={`${index}-${header}`} className="px-7 py-4">
                    {row[header] as ReactNode}
                  </td>
                ))}

                {isCreated && (
                  <td className="px-7 py-4 text-right">
                    <button
                      onClick={() => handleRemoveBadge(row)}
                      className="p-2 rounded-lg bg-whiteOpacity005 hover:bg-red-500/20 transition-colors"
                      title="Remove badge"
                    >
                      <Trash2 className="w-4 h-4 text-whiteOpacity05 hover:text-red-400" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })
        ) : (
          <tr className={cc([{ hidden: hasRowsToDisplay }])}>
            <td colSpan={isCreated ? headers.length + 1 : headers.length}>
              {childrenForEmptyTable}
            </td>
          </tr>
        )}
        {isLogged && (
          <tr>
            <td
              colSpan={isCreated ? headers.length + 1 : headers.length}
              className="py-2"
            >
              {isNewBadge ? (
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="flex gap-2 items-center w-full ml-4">
                    <input
                      type="text"
                      placeholder="Badge name"
                      value={newBadgeData.name}
                      onChange={e => handleBadgeInputChange('name', e.target.value)}
                      className="w-full bg-whiteOpacity008 rounded-lg p-2"
                      autoFocus
                    />
                    <input
                      type="text"
                      placeholder="Issuer"
                      value={newBadgeData.issuer}
                      onChange={e => handleBadgeInputChange('issuer', e.target.value)}
                      className="w-full bg-whiteOpacity008 rounded-lg p-2"
                    />
                    <input
                      type="number"
                      placeholder="Score"
                      value={newBadgeData.score}
                      onChange={e => handleBadgeInputChange('score', e.target.value)}
                      className="w-full bg-whiteOpacity008 rounded-lg p-2"
                    />
                    <button
                      type="submit"
                      className={`p-2.5 rounded-lg transition-colors ${isFormValid ? 'bg-brandGreen text-darkBackground hover:opacity-90' : 'bg-whiteOpacity005 text-whiteOpacity05'}`}
                      disabled={!isFormValid}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2.5 rounded-lg bg-whiteOpacity005 hover:bg-whiteOpacity008 transition-colors"
                      onClick={() => setIsNewBadge(false)}
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex gap-2 py-2 items-center ml-10">
                  <PlusIcon className="text-whiteOpacity05" />
                  <button
                    onClick={() => setIsNewBadge(true)}
                    className="text-whiteOpacity05 hover:text-white transition-colors"
                  >
                    New badge
                  </button>
                </div>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
