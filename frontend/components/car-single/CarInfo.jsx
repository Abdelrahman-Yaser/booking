import React from "react";

const CarInfo = () => (
  <section style={{display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 24}}>
    {/* صورة السيارة */}
    <div style={{flex: '0 0 260px'}}>
      <img src="https://cdn.discovercars.com/car/renault/twingo/primary.png" alt="Mini Renault Twingo" style={{width: '100%', borderRadius: 8}} />
    </div>
    {/* تفاصيل السيارة */}
    <div style={{flex: 1}}>
      <h2 style={{margin: 0}}>Mini <span style={{color: '#888', fontWeight: 400, fontSize: 18}}>Renault Twingo or similar</span></h2>
      <div style={{display: 'flex', gap: 16, margin: '12px 0'}}>
        <span>🚗 4 seats</span>
        <span>🧳 1 bag</span>
        <span>🚪 3 doors</span>
        <span>❄️ Air Conditioning</span>
        <span>🔄 Manual</span>
      </div>
      <button style={{background: '#0071e3', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 600, cursor: 'pointer'}}>PAY PART NOW</button>
      <div style={{marginTop: 16, fontSize: 15}}>
        <div> <b>Full fuel policy</b> <span style={{color: '#888'}}>To full</span> </div>
        <div> <b>Pick-up location</b> <span style={{color: '#888'}}>Car rental center</span> </div>
        <div> <b>Unlimited mileage</b> </div>
        <div> <b>Collision Damage Waiver</b> </div>
        <div> <b>Theft Protection</b> </div>
      </div>
      <div style={{marginTop: 16, fontSize: 15}}>
        <b>Rental conditions</b>
        <div style={{marginTop: 4, color: '#888'}}>Average <b>7.9</b> (28 ratings)</div>
      </div>
    </div>
    {/* السعر */}
    <div style={{flex: '0 0 220px', background: '#f8fafd', borderRadius: 8, padding: 16, textAlign: 'center'}}>
      <div style={{fontSize: 28, fontWeight: 700, color: '#0071e3'}}>£E 4636.53</div>
      <div style={{color: '#4caf50', fontWeight: 600, margin: '8px 0'}}>Good choice</div>
      <ul style={{textAlign: 'left', color: '#333', fontSize: 14, margin: '8px 0 0 0', padding: 0, listStyle: 'none'}}>
        <li>✓ 73% lower price than the average for a Mini car</li>
        <li>✓ Most popular fuel policy: Full to full</li>
        <li>✓ Complete freedom with unlimited mileage</li>
      </ul>
    </div>
  </section>
);

export default CarInfo; 