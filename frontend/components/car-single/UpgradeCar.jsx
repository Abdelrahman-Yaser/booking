import React from "react";

const UpgradeCar = () => (
  <section style={{border: '1px solid #eee', borderRadius: 8, padding: 24, marginBottom: 24}}>
    <h4 style={{marginTop: 0}}>Upgrade to a better car class for just £E 36.53 per day</h4>
    <div style={{display: 'flex', gap: 24, flexWrap: 'wrap'}}>
      {/* سيارة 1 */}
      <div style={{flex: 1, minWidth: 220, border: '1px solid #eee', borderRadius: 8, padding: 16, textAlign: 'center'}}>
        <img src="https://cdn.discovercars.com/car/lancia/ypsilon/primary.png" alt="Lancia Ypsilon" style={{width: 120, marginBottom: 8}} />
        <div style={{fontWeight: 600}}>Lancia Ypsilon <span style={{color: '#888', fontWeight: 400, fontSize: 14}}>or similar Economy</span></div>
        <div style={{fontSize: 14, color: '#888', margin: '8px 0'}}>Manual | 1 bag | Air Conditioning | 5 seats</div>
        <div style={{fontWeight: 600, margin: '8px 0'}}>Total for 8 days: <span style={{color: '#0071e3'}}>EGP 4,928.82</span></div>
        <button style={{background: '#0071e3', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 600, cursor: 'pointer'}}>View offer</button>
      </div>
      {/* سيارة 2 */}
      <div style={{flex: 1, minWidth: 220, border: '1px solid #eee', borderRadius: 8, padding: 16, textAlign: 'center'}}>
        <img src="https://cdn.discovercars.com/car/jeep/renegade/primary.png" alt="Jeep Renegade" style={{width: 120, marginBottom: 8}} />
        <div style={{fontWeight: 600}}>Jeep Renegade <span style={{color: '#888', fontWeight: 400, fontSize: 14}}>or similar Intermediate SUV</span></div>
        <div style={{fontSize: 14, color: '#888', margin: '8px 0'}}>Manual | 3 bags | Air Conditioning | 5 seats</div>
        <div style={{fontWeight: 600, margin: '8px 0'}}>Total for 8 days: <span style={{color: '#0071e3'}}>EGP 9,598.47</span></div>
        <button style={{background: '#0071e3', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 600, cursor: 'pointer'}}>View offer</button>
      </div>
    </div>
  </section>
);

export default UpgradeCar; 