import React, { useState } from 'react';
import BouquetCanvas from '../components/BouquetCanvas';

const WRAPPING_OPTIONS = [
  'Classic Kraft Paper',
  'Rustic Burlap',
  'Elegant Pink Crepe',
  'Soft White Mesh',
  'Lavender Dream'
];

export default function BouquetBuilder({ inventory = [], onPlaceOrder }) {
  const [customerName, setCustomerName] = useState('');
  const [selectedFlowers, setSelectedFlowers] = useState({}); // { name: qty }
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedWrap, setSelectedWrap] = useState('Classic Kraft Paper');
  const [cardMessage, setCardMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  // Multiplier for size
  const sizeCost = selectedSize === 'Small' ? 3.00 : selectedSize === 'Medium' ? 6.00 : 9.00;
  const wrapCost = 3.50;
  const cardCost = cardMessage.trim() ? 1.50 : 0.00;

  // Calculate prices
  const flowerTotal = Object.keys(selectedFlowers).reduce((sum, name) => {
    const item = inventory.find(f => f.name === name);
    const price = item ? item.price : 2.00;
    return sum + (price * selectedFlowers[name]);
  }, 0);

  const grandTotal = Math.round((flowerTotal + sizeCost + wrapCost + cardCost) * 100) / 100;

  const handleIncrement = (flowerName) => {
    // Check if we exceed inventory stock
    const item = inventory.find(f => f.name === flowerName);
    const stock = item ? item.stock : 99;
    const currentQty = selectedFlowers[flowerName] || 0;
    
    if (currentQty >= stock) {
      alert(`⚠️ Cannot add more. Stock limit of ${stock} reached for ${flowerName}.`);
      return;
    }

    setSelectedFlowers({
      ...selectedFlowers,
      [flowerName]: currentQty + 1
    });
  };

  const handleDecrement = (flowerName) => {
    const currentQty = selectedFlowers[flowerName] || 0;
    if (currentQty <= 0) return;
    
    const updated = { ...selectedFlowers };
    if (currentQty === 1) {
      delete updated[flowerName];
    } else {
      updated[flowerName] = currentQty - 1;
    }
    
    setSelectedFlowers(updated);
  };

  // Build array representation for components
  const activeItemsArray = Object.keys(selectedFlowers).map(name => ({
    name,
    qty: selectedFlowers[name]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('⚠️ Please enter a customer name.');
      return;
    }
    if (activeItemsArray.length === 0) {
      alert('⚠️ Please add at least one flower to the bouquet.');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        customerName,
        items: activeItemsArray,
        customizations: {
          size: selectedSize,
          wrapping: selectedWrap,
          greetingCard: cardMessage
        },
        paymentMethod
      };

      await onPlaceOrder(orderData);
      
      // Reset form
      setCustomerName('');
      setSelectedFlowers({});
      setSelectedSize('Medium');
      setSelectedWrap('Classic Kraft Paper');
      setCardMessage('');
      alert('🌸 Bouquet custom order placed successfully!');
    } catch (e) {
      alert('❌ Failed to place order: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="builder-grid">
      {/* Visual Canvas Panel */}
      <div>
        <div className="dashboard-card" style={{ padding: '16px', marginBottom: '20px' }}>
          <BouquetCanvas 
            items={activeItemsArray} 
            wrapping={selectedWrap} 
            size={selectedSize} 
          />
        </div>
        
        {/* Pricing Summary */}
        <div className="dashboard-card">
          <h2 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Order Price Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Flower Stems Total:</span>
              <strong>${flowerTotal.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Wrapping Service ({selectedWrap}):</span>
              <strong>${wrapCost.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Size Premium ({selectedSize}):</span>
              <strong>${sizeCost.toFixed(2)}</strong>
            </div>
            {cardMessage.trim() && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Greeting Card writing:</span>
                <strong>${cardCost.toFixed(2)}</strong>
              </div>
            )}
            <hr style={{ border: 'none', borderBottom: '1px dashed var(--color-border)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: 'var(--color-rose-dark)' }}>
              <span>Total Bouquet Price:</span>
              <strong>${grandTotal.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Builder Controls Form */}
      <div className="builder-controls">
        <h2>Bouquet Customizer</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Customer Name */}
          <div className="form-group">
            <label htmlFor="cust-name">Customer Name</label>
            <input 
              id="cust-name"
              type="text" 
              className="form-control"
              placeholder="Enter customer name..." 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          {/* Bouquet Size */}
          <div className="form-group">
            <label>Select Bouquet Size</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {['Small', 'Medium', 'Large'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`btn ${selectedSize === sz ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '8px' }}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Wrapping Choice */}
          <div className="form-group">
            <label htmlFor="wrapping-select">Wrapping Material</label>
            <select 
              id="wrapping-select"
              className="form-control"
              value={selectedWrap}
              onChange={(e) => setSelectedWrap(e.target.value)}
            >
              {WRAPPING_OPTIONS.map((wrap) => (
                <option key={wrap} value={wrap}>{wrap}</option>
              ))}
            </select>
          </div>

          {/* Flower Stems Selection Grid */}
          <div className="form-group">
            <label>Add Flower Stems</label>
            <div className="flower-selector-grid">
              {inventory.map((flower) => {
                const qty = selectedFlowers[flower.name] || 0;
                const flowerEmoji = 
                  flower.name.includes('Rose') ? '🌹' :
                  flower.name.includes('Tulip') ? '🌷' :
                  flower.name.includes('Lily') ? '⚜️' :
                  flower.name.includes('Lavender') ? '🪻' :
                  flower.name.includes('Sunflower') ? '🌻' :
                  flower.name.includes('Hydrangea') ? '🪸' : '🌸';
                
                return (
                  <div 
                    key={flower.id} 
                    className={`flower-selector-card ${qty > 0 ? 'selected' : ''}`}
                  >
                    <div className="flower-icon-bubble">{flowerEmoji}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {flower.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-sub)', margin: '4px 0' }}>
                      ${flower.price.toFixed(2)}/stem
                    </div>
                    
                    {/* Add/Remove Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', backgroundColor: '#FAF9F6', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                      <button 
                        type="button" 
                        onClick={() => handleDecrement(flower.name)}
                        style={{ border: 'none', background: 'none', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{qty}</span>
                      <button 
                        type="button" 
                        onClick={() => handleIncrement(flower.name)}
                        style={{ border: 'none', background: 'none', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Greeting Card Message */}
          <div className="form-group">
            <label htmlFor="card-msg">Greeting Card Message (optional - adds $1.50)</label>
            <textarea 
              id="card-msg"
              className="form-control" 
              rows="3" 
              placeholder="Happy Anniversary! / Wishing you a bright day!..."
              value={cardMessage}
              onChange={(e) => setCardMessage(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>

          {/* Payment Method */}
          <div className="form-group">
            <label htmlFor="pay-method">Payment Gateway Sandbox</label>
            <select 
              id="pay-method"
              className="form-control"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Stripe">Stripe Gateway (USD)</option>
              <option value="Razorpay">Razorpay Gateway (INR)</option>
            </select>
          </div>

          {/* Place Order Button */}
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            disabled={submitting}
          >
            {submitting ? 'Processing sandbox payment...' : `Confirm & Purchase Bouquet ($${grandTotal.toFixed(2)})`}
          </button>
        </form>
      </div>
    </div>
  );
}
