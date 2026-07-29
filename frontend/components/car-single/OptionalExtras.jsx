import React from "react";

const OptionalExtras = () => (
  <section style={{border: '1px solid #eee', borderRadius: 8, padding: 24, marginBottom: 24}}>
    <h4 style={{marginTop: 0}}>Optional extras</h4>
    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{flex: 1}}>
        <span>Additional driver</span>
        <span style={{marginLeft: 16, color: '#888'}}>£E 5578.48 rental period</span>
      </div>
      <button style={{background: '#f5f5f5', border: '1px solid #ccc', borderRadius: 4, padding: '4px 16px', cursor: 'pointer'}}>+</button>
    </div>
    <div style={{color: '#888', fontSize: 13, marginTop: 8}}>
      Please note that prices and availability of optional extras are fully controlled by the rental supplier and that prices are subject to change. Those listed here are to be used as a guide only.
    </div>
  </section>
);

export default OptionalExtras; 