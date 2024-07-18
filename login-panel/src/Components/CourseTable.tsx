import React from 'react';

type CourseTableProps = {
    columns: string[];
    data: any[];
    renderCell: (item: any, column: string) => JSX.Element | string;
};

export const CourseTable: React.FC<CourseTableProps> = ({ columns, data, renderCell }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    {columns.map((column) => (
                        <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {column}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {data.map((item, index) => (
                    <tr key={index}>
                        {columns.map((column) => (
                            <td key={column} className="px-6 py-4 whitespace-nowrap">
                                {renderCell(item, column)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};