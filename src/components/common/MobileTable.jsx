import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MoreVertical } from 'lucide-react';
import MobileCard from './MobileCard';

const MobileTable = ({ 
  data = [], 
  columns = [], 
  onRowClick,
  actions,
  className = '',
  emptyMessage = 'কোনো ডেটা পাওয়া যায়নি'
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (rowIndex) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowIndex)) {
      newExpanded.delete(rowIndex);
    } else {
      newExpanded.add(rowIndex);
    }
    setExpandedRows(newExpanded);
  };

  if (data.length === 0) {
    return (
      <MobileCard className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </MobileCard>
    );
  }

  return (
    <div className={className}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white rounded-xl border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  কার্যক্রম
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={`hover:bg-gray-50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {actions(row, rowIndex)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.map((row, rowIndex) => {
          const isExpanded = expandedRows.has(rowIndex);
          const primaryColumn = columns[0];
          const secondaryColumn = columns[1];
          const remainingColumns = columns.slice(2);

          return (
            <MobileCard 
              key={rowIndex}
              className="relative"
              isClickable={!!onRowClick}
              onClick={() => onRowClick?.(row, rowIndex)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {/* Primary Information */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {primaryColumn?.render ? 
                        primaryColumn.render(row[primaryColumn.key], row, rowIndex) : 
                        row[primaryColumn?.key]
                      }
                    </h3>
                    {actions && (
                      <button 
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle action menu
                        }}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>

                  {/* Secondary Information */}
                  {secondaryColumn && (
                    <p className="text-sm text-gray-500 mb-2">
                      {secondaryColumn.render ? 
                        secondaryColumn.render(row[secondaryColumn.key], row, rowIndex) : 
                        row[secondaryColumn.key]
                      }
                    </p>
                  )}

                  {/* Expandable Content */}
                  {remainingColumns.length > 0 && (
                    <>
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                          {remainingColumns.map((column, colIndex) => (
                            <div key={colIndex} className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-500">
                                {column.header}:
                              </span>
                              <span className="text-sm text-gray-900">
                                {column.render ? 
                                  column.render(row[column.key], row, rowIndex) : 
                                  row[column.key]
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRowExpansion(rowIndex);
                        }}
                        className="flex items-center mt-2 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronDown className="w-3 h-3 mr-1" />
                            কম দেখুন
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-3 h-3 mr-1" />
                            আরো দেখুন
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Actions */}
              {actions && isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    {actions(row, rowIndex)}
                  </div>
                </div>
              )}
            </MobileCard>
          );
        })}
      </div>
    </div>
  );
};

// Horizontal Scroll Table for complex data
export const HorizontalScrollTable = ({ 
  data = [], 
  columns = [], 
  className = '',
  emptyMessage = 'কোনো ডেটা পাওয়া যায়নি'
}) => {
  if (data.length === 0) {
    return (
      <MobileCard className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </MobileCard>
    );
  }

  return (
    <MobileCard className={`p-0 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm">
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Scroll Indicator */}
      <div className="flex justify-center py-2 border-t border-gray-100">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </MobileCard>
  );
};

export default MobileTable;