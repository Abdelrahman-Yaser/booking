import React from "react";

const BookingInfo = () => (
  <section style={{border: '1px solid #eee', borderRadius: 8, padding: 24, marginBottom: 24}}>
    <div style={{display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap'}}>
      {/* Pick-up Info */}
      <div style={{flex: 1, minWidth: 260}}>
        <h4 style={{margin: 0, fontWeight: 600}}>PICK-UP</h4>
        <div style={{fontWeight: 500, margin: '8px 0'}}>7 Jul 2025, Monday, 11:00 am</div>
        <div style={{color: '#666'}}>Catania-Fontanarossa Airport (CTA)</div>
        <div style={{color: '#888', fontSize: 14}}>Address: Via Fontanarossa 20, 95121 Catania CT</div>
        <div style={{marginTop: 8, fontSize: 14}}>
          <b>Pick-up location:</b> Car rental center<br/>
          <b>Business hours:</b> Monday 08:00 - 22:00<br/>
          <b>Pick-up instructions:</b> At the exit of terminal A go straight on until the terminal C, in front of you there is the rent a car building inside it ...
        </div>
        <button style={{marginTop: 8, background: '#f5f5f5', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer'}}>Show on map</button>
      </div>
      {/* Drop-off Info */}
      <div style={{flex: 1, minWidth: 260}}>
        <h4 style={{margin: 0, fontWeight: 600}}>DROP-OFF</h4>
        <div style={{fontWeight: 500, margin: '8px 0'}}>15 Jul 2025, Tuesday, 11:00 am</div>
        <div style={{color: '#666'}}>Catania-Fontanarossa Airport (CTA)</div>
        <div style={{color: '#888', fontSize: 14}}>Address: Via Fontanarossa 20, 95121 Catania CT</div>
        <div style={{marginTop: 8, fontSize: 14}}>
          <b>Business hours:</b> Tuesday 08:00 - 22:00<br/>
          <b>Drop-off instructions:</b> Please clarify drop-off instructions with the supplier upon pick-up.
        </div>
      </div>
    </div>
  </section>
);

export default BookingInfo; 