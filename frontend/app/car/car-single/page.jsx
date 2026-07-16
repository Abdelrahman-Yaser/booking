import BookingInfo from '@/components/car-single/BookingInfo';
import CarInfo from '@/components/car-single/CarInfo';
import CoverageOptions from '@/components/car-single/CoverageOptions';
import OptionalExtras from '@/components/car-single/OptionalExtras';
import UpgradeCar from '@/components/car-single/UpgradeCar';
import Summary from '@/components/car-single/Summary';
import DriverForm from '@/components/car-single/DriverForm';
import Reviews from '@/components/car-single/Reviews';

export default function CarSinglePage() {
  return (
    <div style={{maxWidth: 1200, margin: '0 auto', padding: 24, background: '#fafcff'}}>
      <div style={{marginBottom: 32}}>
      <CarInfo />
        <BookingInfo />

    
        <CoverageOptions />
        <OptionalExtras />
        <UpgradeCar />
        <div style={{display: 'flex', gap: 32, alignItems: 'flex-start'}}>
          <div style={{flex: 2}}>
            <DriverForm />
            <Reviews />
          </div>
          <div style={{flex: 1}}>
            <Summary />
          </div>
        </div>
      </div>
    </div>
  );
} 