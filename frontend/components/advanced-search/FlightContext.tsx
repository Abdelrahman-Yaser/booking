import React, { createContext, useContext, useState, ReactNode } from "react";
import dayjs from "dayjs";

interface Flight {
  airline: ReactNode;
  flightCode: ReactNode;
  classType: ReactNode;
  departureTime: ReactNode;
  departureDate: ReactNode;
  duration: ReactNode;
  departureAirport: ReactNode;
  arrivalAirport: ReactNode;
  arrivalTime: ReactNode;
  arrivalDate: ReactNode;
  price: any;
  amenities: any;
  flightDetails: ReactNode;
  aircraft: ReactNode;
  fareDetails: any;
  refundPolicy: ReactNode;
  rescheduleOptions: ReactNode;
  promotions: ReactNode;
  id?: string;
  origin?: string;
  destination?: string;
}

interface Trip {
  origin: { code: string; name: string; state_name: string } | null;
  destination: { code: string; name: string; state_name: string } | null;
  departureDate: string;
}

interface FlightContextType {
  flights: Flight[];
  setFlights: (flights: Flight[]) => void;
  showFlightDetails: boolean;
  setShowFlightDetails: (show: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  searchParams: {
    flightRadio: "oneway" | "roundtrip" | "multitrip";
    trips: Trip[];
    returnDate: string;
    adults: number;
    children: number;
    infants: number;
    cabinClass: string;
  };
  setSearchParams: (params: any) => void;
}

const FlightContext = createContext<FlightContextType | undefined>(undefined);

export const FlightProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [showFlightDetails, setShowFlightDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState<FlightContextType["searchParams"]>({
    flightRadio: "oneway",
    trips: [
      {
        origin: null,
        destination: null,
        departureDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
      },
    ],
    returnDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: "Economy",
  });

  return (
    <FlightContext.Provider
      value={{
        searchParams,
        setSearchParams,
        flights,
        setFlights,
        showFlightDetails,
        setShowFlightDetails,
        loading,
        setLoading,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};

export const useFlightContext = () => {
  const context = useContext(FlightContext);
  if (context === undefined) {
    throw new Error("useFlightContext must be used within a FlightProvider");
  }
  return context;
};
