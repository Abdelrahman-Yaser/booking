import dynamic from 'next/dynamic';

const PKfareSearch = dynamic(() => import('@/components/flight/flight-list/pkfare-search/PKfareSearch'), {
  ssr: false,
});

export const metadata = {
  title: 'PKfare Flight Search | Find Cheap Flights & Airline Tickets',
  description: 'Search and compare flights from 600+ airlines across 100+ countries. Find the best deals on airline tickets with our advanced PKfare flight search engine.',
};

export default function Page() {
  return <PKfareSearch />;
} 