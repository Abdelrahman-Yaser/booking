import React from "react";

const Summary = () => (
  <section style={{border: '1px solid #eee', borderRadius: 8, padding: 24, marginBottom: 24, maxWidth: 340, float: 'right'}}>
    <h4 style={{marginTop: 0}}>Summary</h4>
    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
      <span>Cost of rental</span>
      <span>£E 4636.53</span>
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
      <span>Full Coverage</span>
      <span>£E 3779.84</span>
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#0071e3', fontWeight: 600}}>
      <span>Total</span>
      <span>£E 8416.37</span>
    </div>
    <div style={{background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 4, padding: 8, margin: '12px 0', color: '#ad8b00', fontSize: 14}}>
      <b>Don't miss out!</b> Prices are currently lower than usual in Catania.<br/>
      Book now and save up to 84%.
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 16, marginBottom: 8}}>
      <span>Pay now</span>
      <span>£E 4126.75</span>
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: 14}}>
      <span>Pay at pick-up</span>
      <span>£E 4289.62</span>
    </div>
  </section>
);

export default Summary; 