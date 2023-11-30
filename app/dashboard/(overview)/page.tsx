import { Card } from '../../ui/dashboard/cards'
import RevenueChart from '../../ui/dashboard/revenue-chart'
import LatestInvoices from '../../ui/dashboard/latest-invoices'
import { lusitana } from '../../ui/fonts'
import { fetchLatestInvoices, fetchCardData, fetchRevenue } from '../../lib/data'
import { Suspense } from 'react'
import CardWrapper from '@/app/ui/dashboard/cards';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard'
}


const Page = async () => {
    const latestInvoices = await fetchLatestInvoices();
    const revenue = await fetchRevenue();
    // const { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices } = await fetchCardData();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart revenue={revenue} />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices latestInvoices={latestInvoices} />
                </Suspense>
            </div>
        </main>
    )
}

export default Page