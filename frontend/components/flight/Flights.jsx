"use client";

import Image from "next/image";
import Link from "next/link";

const flightRoutes = [
  {
    id: 1,
    from: "New York",
    to: "London",
    fromCode: "NYC",
    toCode: "LHR",
    price: 599,
    duration: "7h 30m",
    airline: "British Airways",
    image: "/img/general/1.jpg",
    rating: 4.8,
    reviews: 2847,
    departure: "08:30",
    arrival: "16:00",
    stops: "Non-stop"
  },
  {
    id: 2,
    from: "Dubai",
    to: "Paris",
    fromCode: "DXB",
    toCode: "CDG",
    price: 749,
    duration: "8h 15m",
    airline: "Emirates",
    image: "/img/general/2.jpg",
    rating: 4.9,
    reviews: 1923,
    departure: "14:45",
    arrival: "19:00",
    stops: "Non-stop"
  },
  {
    id: 3,
    from: "Tokyo",
    to: "Los Angeles",
    fromCode: "NRT",
    toCode: "LAX",
    price: 899,
    duration: "11h 45m",
    airline: "Japan Airlines",
    image: "/img/general/3.jpg",
    rating: 4.7,
    reviews: 3156,
    departure: "17:20",
    arrival: "10:05",
    stops: "Non-stop"
  },
  {
    id: 4,
    from: "Singapore",
    to: "Sydney",
    fromCode: "SIN",
    toCode: "SYD",
    price: 649,
    duration: "8h 20m",
    airline: "Singapore Airlines",
    image: "/img/general/4.jpg",
    rating: 4.8,
    reviews: 2134,
    departure: "23:55",
    arrival: "09:15+1",
    stops: "Non-stop"
  },
  {
    id: 5,
    from: "Frankfurt",
    to: "New York",
    fromCode: "FRA",
    toCode: "JFK",
    price: 699,
    duration: "8h 50m",
    airline: "Lufthansa",
    image: "/img/general/5.jpg",
    rating: 4.6,
    reviews: 1876,
    departure: "11:10",
    arrival: "14:00",
    stops: "Non-stop"
  },
  {
    id: 6,
    from: "Istanbul",
    to: "Bangkok",
    fromCode: "IST",
    toCode: "BKK",
    price: 549,
    duration: "9h 30m",
    airline: "Turkish Airlines",
    image: "/img/general/6.jpg",
    rating: 4.5,
    reviews: 2567,
    departure: "01:30",
    arrival: "14:00",
    stops: "Non-stop"
  }
];

const Flights = () => {
  return (
    <>
      {flightRoutes.map((route) => (
        <div className="col-xl-4 col-lg-4 col-sm-6" key={route.id}>
          <div className="flightCard -type-1 rounded-4 hover-inside-slider">
            <div className="flightCard__image">
              <div className="cardImage inside-slider">
                <div className="cardImage ratio ratio-6:5">
                  <div className="cardImage__content">
                    <Image
                      width={300}
                      height={250}
                      className="rounded-4 col-12 js-lazy"
                      src={route.image}
                      alt={`${route.from} to ${route.to}`}
                    />
                  </div>
                  <div className="cardImage__wishlist">
                    <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                      <i className="icon-heart text-12" />
                    </button>
                  </div>
                  <div className="cardImage__leftBadge">
                    <div className="py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase bg-blue-1 text-white">
                      {route.stops}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End .flightCard__image */}

            <div className="flightCard__content mt-10">
              <div className="d-flex items-center justify-between">
                <div className="text-14 text-light-1">{route.airline}</div>
                <div className="lh-14 text-right">
                  <div className="d-flex items-center">
                    <div className="icon-star text-yellow-1 text-10 mr-5" />
                    <div className="text-14 text-light-1">
                      {route.rating} ({route.reviews})
                    </div>
                  </div>
                </div>
              </div>

              <div className="flightCard__route mt-10">
                <div className="d-flex items-center justify-between">
                  <div className="text-left">
                    <div className="lh-15 fw-500">{route.departure}</div>
                    <div className="text-15 lh-15 text-light-1">{route.fromCode}</div>
                    <div className="text-13 lh-15 text-light-1">{route.from}</div>
                  </div>

                  <div className="flightCard__content-center text-center">
                    <div className="text-13 text-light-1 mb-10">{route.duration}</div>
                    <div className="flightCard__line">
                      <div></div>
                      <div className="icon-airplane text-blue-1"></div>
                      <div></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="lh-15 fw-500">{route.arrival}</div>
                    <div className="text-15 lh-15 text-light-1">{route.toCode}</div>
                    <div className="text-13 lh-15 text-light-1">{route.to}</div>
                  </div>
                </div>
              </div>

              <div className="mt-15">
                <div className="d-flex items-center justify-between">
                  <div className="d-flex items-center">
                    <div className="text-16 lh-16 fw-500">
                      From ${route.price}
                    </div>
                    <div className="text-14 text-light-1 ml-5">per person</div>
                  </div>
                  <Link
                    href={`/flight-list-v1?from=${route.fromCode}&to=${route.toCode}`}
                    className="button -dark-1 px-30 h-40 bg-blue-1 text-white"
                  >
                    View Deal <div className="icon-arrow-top-right ml-15" />
                  </Link>
                </div>
              </div>
            </div>
            {/* End .flightCard__content */}
          </div>
          {/* End .flightCard */}
        </div>
      ))}
    </>
  );
};

export default Flights; 