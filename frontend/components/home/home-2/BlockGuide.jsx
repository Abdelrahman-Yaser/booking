const BlockGuide = () => {
  const blockContent = [
    {
      id: 1,
      icon: "/img/featureIcons/2/1.svg",
      title: "Best Flight Prices",
      text: `Compare prices from 500+ airlines and get the best deals on flights worldwide.`,
      delayAnim: "0",
    },
    {
      id: 2,
      icon: "/img/featureIcons/2/2.svg",
      title: "Instant Flight Booking",
      text: `Book your flights in seconds with our fast and secure booking system.`,
      delayAnim: "50",
    },
    {
      id: 3,
      icon: "/img/featureIcons/2/3.svg",
      title: "24/7 Flight Support",
      text: `Get round-the-clock assistance for flight changes, cancellations, and travel support.`,
      delayAnim: "100",
    },
    {
      id: 4,
      icon: "/img/featureIcons/1/1.svg",
      title: "Flexible Flight Options",
      text: `Choose from economy, business, and first-class options with flexible date changes.`,
      delayAnim: "150",
    },
    {
      id: 5,
      icon: "/img/featureIcons/1/2.svg",
      title: "Mobile Check-in",
      text: `Skip the lines with mobile boarding passes and online check-in services.`,
      delayAnim: "200",
    },
    {
      id: 6,
      icon: "/img/featureIcons/1/3.svg",
      title: "Reward Points",
      text: `Earn points on every flight booking and redeem them for future travel discounts.`,
      delayAnim: "250",
    },
  ];

  return (
    <>
      {blockContent.map((item) => (
        <div
          className="col-lg-4 col-sm-6"
          data-aos="fade"
          data-aos-delay={item.delayAnim}
          key={item.id}
        >
          <div className="featureIcon -type-1 -hover-shadow px-50 py-50 lg:px-24 lg:py-15">
            <div className="d-flex justify-center">
              <img src={item.icon} alt="image" className="js-lazy" />
            </div>
            <div className="text-center mt-30">
              <h4 className="text-18 fw-500">{item.title}</h4>
              <p className="text-15 mt-10">{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlockGuide;
