import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ReactApexChart from 'react-apexcharts';

export default function Dashboard({ auth, registerDomainsCount, activeDomainsCount, registeredMailboxesCount, usedStorage }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Statistics</h2>
                        <ReactApexChart
                            type="bar"
                            series={[
                                {
                                    name: 'Count',
                                    data: [
                                        activeDomainsCount,
                                        registerDomainsCount,
                                        registeredMailboxesCount,
                                    ],
                                },
                            ]}
                            options={{
                                chart: {
                                    type: 'bar',
                                    height: 350,
                                },
                                xaxis: {
                                    categories: [
                                        'Active Domains',
                                        'Registered Domains',
                                        'Registered Mailboxes',
                                    ],
                                },
                                title: {
                                    text: 'Domain Statistics',
                                    align: 'center',
                                    style: {
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#333',
                                    },
                                },
                                colors: ['#4F46E5', '#F59E0B', '#10B981'],
                                dataLabels: {
                                    enabled: true,
                                    style: {
                                        colors: ['#333'],
                                    },
                                },
                                grid: {
                                    borderColor: '#E5E7EB',
                                },
                            }}
                        />
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Used Storage</h3>
                            <div className="flex items-center space-x-4">
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-blue-600 h-4 rounded-full"
                                        style={{ width: `${Math.min((usedStorage / 1000) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {usedStorage} MB
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
