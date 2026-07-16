import React from "react";

const DriverForm = () => (
  <section style={{border: '1px solid #eee', borderRadius: 8, padding: 24, marginBottom: 24, maxWidth: 600}}>
    <h4 style={{marginTop: 0}}>Enter driver details</h4>
    <form>
      <div style={{display: 'flex', gap: 16, marginBottom: 12}}>
        <div style={{flex: 1}}>
          <label>Email</label>
          <input type="email" value="abdooy640@gmail.com" style={{width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc'}} readOnly />
        </div>
        <div style={{flex: 1}}>
          <label>Phone</label>
          <input type="tel" value="+20 10 01234567" style={{width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc'}} readOnly />
        </div>
      </div>
      <div style={{display: 'flex', gap: 16, marginBottom: 12}}>
        <div style={{flex: 1}}>
          <label>First name</label>
          <input type="text" value="Abdoo" style={{width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc'}} readOnly />
        </div>
        <div style={{flex: 1}}>
          <label>Last name</label>
          <input type="text" value="" placeholder="Last name" style={{width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc'}} />
        </div>
      </div>
      <div style={{display: 'flex', gap: 16, marginBottom: 12}}>
        <div style={{flex: 1}}>
          <label>Date of birth</label>
          <div style={{display: 'flex', gap: 8}}>
            <input type="text" placeholder="Day" style={{width: 60, padding: 8, borderRadius: 4, border: '1px solid #ccc'}} />
            <input type="text" placeholder="Month" style={{width: 60, padding: 8, borderRadius: 4, border: '1px solid #ccc'}} />
            <input type="text" placeholder="Year" style={{width: 80, padding: 8, borderRadius: 4, border: '1px solid #ccc'}} />
          </div>
        </div>
        <div style={{flex: 1}}>
          <label>Traveling by plane?</label>
          <input type="text" placeholder="Add your flight number" style={{width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc'}} />
        </div>
      </div>
      <div style={{marginBottom: 12}}>
        <label>
          <input type="checkbox" defaultChecked style={{marginRight: 8}} />
          Yes, I would like to receive special offers, exclusive deals, and discounts from DiscoverCars.com.
        </label>
      </div>
      <button type="submit" style={{background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer'}}>Continue to payment</button>
    </form>
  </section>
);

export default DriverForm; 