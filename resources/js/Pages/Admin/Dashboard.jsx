import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ReactApexChart from 'react-apexcharts';

export default function AdminDashboard({ auth, activeDomainsCount, registeredMailboxesCount, usedStorage }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Dashboard Statistics</h2>
                        <ReactApexChart
                            type="bar"
                            series={[
                                {
                                    name: 'Count',
                                    data: [
                                        activeDomainsCount,
                                        registeredMailboxesCount,
                                        usedStorage,
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
                                        'Registered Mailboxes',
                                        'Used Storage',
                                    ],
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
