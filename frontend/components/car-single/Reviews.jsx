import React from "react";

const Reviews = () => (
  <section style={{marginBottom: 24}}>
    <h4 style={{marginTop: 0}}>8 out of 9 users would choose this again</h4>
    <div style={{display: 'flex', gap: 24, flexWrap: 'wrap'}}>
      {/* تقييم 1 */}
      <div style={{flex: 1, minWidth: 220, border: '1px solid #eee', borderRadius: 8, padding: 16}}>
        <div style={{color: '#ffb400', fontSize: 18}}>★★★★★</div>
        <div style={{fontWeight: 600}}>Glad to have purchased Full Coverage</div>
        <div style={{color: '#888', fontSize: 13, margin: '8px 0'}}>by Mike Martin 2 months ago</div>
        <div> Took Full Coverage, and it was well worth it. A chip in the windshield would have cost me $715! It was easy and quick to be refunded. </div>
      </div>
      {/* تقييم 2 */}
      <div style={{flex: 1, minWidth: 220, border: '1px solid #eee', borderRadius: 8, padding: 16}}>
        <div style={{color: '#ffb400', fontSize: 18}}>★★★★★</div>
        <div style={{fontWeight: 600}}>Full Coverage saved the day</div>
        <div style={{color: '#888', fontSize: 13, margin: '8px 0'}}>by Ignacio Lopez 2 months ago</div>
        <div> I had Full Coverage and got in an accident. The repair costs were a steep $1,345, but I was able to get this back without any hassle. It was a fast, simple, and pleasant process! </div>
      </div>
    </div>
    <div style={{marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16}}>
      <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
        <div style={{flex: 1, minWidth: 180, color: '#4caf50', fontWeight: 600, fontSize: 14}}>
          <div>VERY EASY TO BOOK THIS GOOD DEAL</div>
          <div style={{color: '#888', fontWeight: 400, fontSize: 12}}>PAUL BRANDON</div>
        </div>
        <div style={{flex: 1, minWidth: 180, color: '#4caf50', fontWeight: 600, fontSize: 14}}>
          <div>They replied to my message very quickly</div>
          <div style={{color: '#888', fontWeight: 400, fontSize: 12}}>Rita</div>
        </div>
        <div style={{flex: 1, minWidth: 180, color: '#4caf50', fontWeight: 600, fontSize: 14}}>
          <div>Fast cheap booking of a car</div>
          <div style={{color: '#888', fontWeight: 400, fontSize: 12}}>Celina</div>
        </div>
        <div style={{flex: 1, minWidth: 180, color: '#4caf50', fontWeight: 600, fontSize: 14}}>
          <div>very good yes</div>
          <div style={{color: '#888', fontWeight: 400, fontSize: 12}}>Marcus</div>
        </div>
      </div>
      <div style={{marginTop: 8, color: '#888', fontSize: 13}}>
        Rated 4.6 out of 5 based on 212,036 on <span style={{color: '#0071e3', fontWeight: 600}}>Trustpilot</span>
      </div>
    </div>
  </section>
);

export default Reviews; 