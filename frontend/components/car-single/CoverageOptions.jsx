import React from "react";

const CoverageOptions = () => (
  <section style={{border: '1px solid #eee', borderRadius: 8, padding: 24, marginBottom: 24}}>
    <h3 style={{marginTop: 0}}>Upgrade to Full Coverage and relax…</h3>
    <div style={{color: '#0071e3', fontWeight: 600, marginBottom: 8}}>
      Get refunded up to £E 174300.00 in case of an incident with your rental car that you might have to pay for.
    </div>
    <a href="#" style={{color: '#0071e3', fontSize: 14, textDecoration: 'underline'}}>Full Coverage explained</a>
    <div style={{display: 'flex', gap: 32, marginTop: 24, flexWrap: 'wrap'}}>
      {/* قائمة التغطيات */}
      <div style={{flex: 1, minWidth: 260}}>
        <h4 style={{margin: '0 0 8px 0'}}>One of the most comprehensive coverages on the market</h4>
        <ul style={{paddingLeft: 20, color: '#333', fontSize: 15}}>
          <li>Damage, theft, vandalism, hit-and-run</li>
          <li>Windows, mirrors, lamps, wheels, tires</li>
          <li>Bodywork, underbody, roof, mechanical damage</li>
          <li>Roadside assistance, towing, and taxi expenses</li>
          <li>Lost keys and lockout fees</li>
          <li>Misfuelling-related costs</li>
          <li>Administrative fees related to the damage</li>
          <li>All drivers covered</li>
          <li>Cancel your coverage for free anytime before pick-up</li>
        </ul>
      </div>
      {/* صورة السيارة مع علامات التغطية */}
      <div style={{flex: 1, minWidth: 260, textAlign: 'center'}}>
        <img src="https://cdn.discovercars.com/car/coverage/coverage-car.png" alt="Full Coverage" style={{width: 220, marginBottom: 8}} />
      </div>
      {/* خيارات التغطية */}
      <div style={{flex: 1, minWidth: 220}}>
        <div style={{border: '1px solid #0071e3', borderRadius: 8, padding: 16, marginBottom: 12}}>
          <input type="radio" id="full" name="coverage" defaultChecked />
          <label htmlFor="full" style={{marginLeft: 8, fontWeight: 600}}>Full Coverage</label>
          <span style={{float: 'right', fontWeight: 600}}>£E 472.48/day</span>
        </div>
        <div style={{border: '1px solid #eee', borderRadius: 8, padding: 16}}>
          <input type="radio" id="risk" name="coverage" />
          <label htmlFor="risk" style={{marginLeft: 8}}>I'm willing to take the risk</label>
          <span style={{float: 'right', color: '#888'}}>Included coverage only</span>
        </div>
      </div>
    </div>
    <div style={{marginTop: 16, color: '#4caf50', fontWeight: 600}}>
      Enjoy the best value with our coverage compared to rental desk options
    </div>
  </section>
);

export default CoverageOptions; 