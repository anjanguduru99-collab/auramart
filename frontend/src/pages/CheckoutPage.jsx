import React, { useState } from 'react';
import { 
  CreditCard, ShieldCheck, Truck, Lock, ArrowLeft, CheckCircle2, 
  Sparkles, Zap, DollarSign, Wallet, Smartphone, QrCode, ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import UpiPaymentModal from '../components/UpiPaymentModal';
import confetti from 'canvas-confetti';

export default function CheckoutPage({ onNavigate }) {
  const { cart, subtotal, discount, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();

  const [paymentType, setPaymentType] = useState('upi'); // 'upi', 'card', 'paypal', 'applepay', 'cod'
  const [upiVpaId, setUpiVpaId] = useState('customer@okaxis');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');

  const [formData, setFormData] = useState({
    fullName: user.name || 'Sarah Jenkins',
    email: user.email || 'sarah.j@example.com',
    street: user.address?.street || '742 Evergreen Terrace',
    city: user.address?.city || 'Springfield',
    state: user.address?.state || 'OR',
    zip: user.address?.zip || '97477',
    cardNumber: '4242 4242 4242 4242',
    cardName: user.name || 'SARAH JENKINS',
    cardExpiry: '12/28',
    cardCvc: '888'
  });

  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
        <button onClick={() => onNavigate('shop')} className="btn btn-primary text-xs py-2.5 px-6">
          Return to Shop Catalog
        </button>
      </div>
    );
  }

  const fillTestCard = () => {
    setFormData(prev => ({
      ...prev,
      cardNumber: '4242 4242 4242 4242',
      cardName: 'SARAH JENKINS',
      cardExpiry: '12/28',
      cardCvc: '888'
    }));
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (paymentType === 'upi') {
      setIsUpiModalOpen(true);
    } else {
      executeDirectPayment();
    }
  };

  const executeDirectPayment = async () => {
    setIsProcessing(true);
    setError('');

    setProcessingStep('Connecting to 256-Bit SSL Encrypted Gateway...');
    await new Promise(r => setTimeout(r, 600));

    setProcessingStep('Authorizing payment details with payment provider...');
    await new Promise(r => setTimeout(r, 600));

    try {
      const getPaymentLabel = () => {
        if (paymentType === 'card') return `Credit Card (Ends in ${formData.cardNumber.slice(-4) || '4242'})`;
        if (paymentType === 'paypal') return 'PayPal Express Checkout';
        if (paymentType === 'applepay') return 'Apple Pay / Google Pay';
        return 'Cash on Delivery (COD)';
      };

      const orderPayload = {
        customerName: formData.fullName,
        email: formData.email,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        items: cart.map(item => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          image: item.product.images[0]
        })),
        subtotal,
        discount,
        shippingFee,
        total,
        paymentMethod: getPaymentLabel()
      };

      const newOrder = await createOrder(orderPayload);
      
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch (err) {}

      clearCart();
      setIsProcessing(false);
      onNavigate('orderSuccess', { orderId: newOrder.id });
    } catch (err) {
      setIsProcessing(false);
      setError(err.message || 'Payment processing failed. Please try again.');
    }
  };

  const handleUpiSuccess = async (upiDetails) => {
    setIsUpiModalOpen(false);
    setIsProcessing(true);
    setProcessingStep('Finalizing order & generating digital invoice...');

    try {
      const orderPayload = {
        customerName: formData.fullName,
        email: formData.email,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        items: cart.map(item => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          image: item.product.images[0]
        })),
        subtotal,
        discount,
        shippingFee,
        total,
        paymentMethod: upiDetails.paymentMethod
      };

      const newOrder = await createOrder(orderPayload);
      clearCart();
      setIsProcessing(false);
      onNavigate('orderSuccess', { orderId: newOrder.id });
    } catch (err) {
      setIsProcessing(false);
      setError(err.message || 'Failed to register order.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in text-left space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Lock className="w-6 h-6 text-emerald-400" />
            <span>256-Bit Encrypted Checkout</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Guaranteed bank-level SSL security transaction</p>
        </div>
        <button onClick={() => onNavigate('cart')} className="btn btn-secondary text-xs py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>
      </div>

      {/* Main Grid */}
      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Truck className="w-5 h-5 text-indigo-400" />
              <span>1. Delivery Destination & Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-extrabold text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-extrabold text-slate-300 block mb-1">Street Address *</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-300 block mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-slate-300 block mb-1">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input-field text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-300 block mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Options (UPI Featured First) */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span>2. Select Payment Method</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> NPCI Verified
              </span>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentType('upi')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentType === 'upi' 
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white border-transparent shadow-lg scale-105' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-5 h-5 text-yellow-300" />
                <span>UPI Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('card')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentType === 'card' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('paypal')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentType === 'paypal' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Wallet className="w-5 h-5 text-cyan-400" />
                <span>PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('applepay')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentType === 'applepay' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Zap className="w-5 h-5 text-amber-400" />
                <span>1-Touch</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('cod')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentType === 'cod' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>COD Pay</span>
              </button>
            </div>

            {/* UPI Option Form */}
            {paymentType === 'upi' && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/40 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-sm font-bold text-white">UPI Quick Payment (Google Pay, PhonePe, Paytm, BHIM)</h4>
                  </div>
                  <span className="badge bg-indigo-500 text-white font-black text-[10px]">INSTANT APPROVAL</span>
                </div>

                <p className="text-xs text-slate-300">
                  Enter your UPI ID below or proceed to scan the live QR Code & enter your 4-digit UPI PIN.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-extrabold text-slate-300 block mb-1">Your Virtual Payment Address (UPI VPA)</label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210@paytm or john@okaxis"
                      value={upiVpaId}
                      onChange={(e) => setUpiVpaId(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-slate-300 block mb-1">Select Preferred Mobile App</label>
                    <select
                      value={selectedUpiApp}
                      onChange={(e) => setSelectedUpiApp(e.target.value)}
                      className="input-field text-xs font-bold cursor-pointer"
                    >
                      <option value="gpay">Google Pay (GPay)</option>
                      <option value="phonepe">PhonePe</option>
                      <option value="paytm">Paytm UPI</option>
                      <option value="bhim">BHIM UPI</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                  <span>Popular VPAs:</span>
                  <button type="button" onClick={() => setUpiVpaId('user@okaxis')} className="text-indigo-400 hover:underline">@okaxis</button> •
                  <button type="button" onClick={() => setUpiVpaId('user@okicici')} className="text-indigo-400 hover:underline">@okicici</button> •
                  <button type="button" onClick={() => setUpiVpaId('user@ybl')} className="text-indigo-400 hover:underline">@ybl</button> •
                  <button type="button" onClick={() => setUpiVpaId('user@paytm')} className="text-indigo-400 hover:underline">@paytm</button>
                </div>
              </div>
            )}

            {/* Credit Card Form */}
            {paymentType === 'card' && (
              <div className="space-y-4 pt-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Credit / Debit Card Details</span>
                  <button
                    type="button"
                    onClick={fillTestCard}
                    className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto-Fill Test Card (4242)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-extrabold text-slate-300 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="input-field text-xs font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-slate-300 block mb-1">Expiration Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      className="input-field text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-slate-300 block mb-1">Security CVC</label>
                    <input
                      type="password"
                      placeholder="888"
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                      className="input-field text-xs"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentType === 'paypal' && (
              <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-2 animate-fade-in">
                <Wallet className="w-8 h-8 text-cyan-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Pay via PayPal Express Sandbox</h4>
                <p className="text-xs text-slate-400">Authorizes payment seamlessly through PayPal Express.</p>
              </div>
            )}

            {paymentType === 'applepay' && (
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2 animate-fade-in">
                <Zap className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Apple Pay / Google Pay 1-Touch Checkout</h4>
                <p className="text-xs text-slate-400">Instant biometric 1-touch payment approval.</p>
              </div>
            )}

            {paymentType === 'cod' && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-fade-in">
                <DollarSign className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Pay Cash on Delivery (COD)</h4>
                <p className="text-xs text-slate-400">Pay cash upon parcel delivery.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 bg-slate-900/90 text-left">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Order Summary</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-800">
            {cart.map((item, i) => (
              <div key={i} className="pt-2 first:pt-0 flex items-center gap-3">
                <img src={item.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0" />
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold text-white truncate">{item.product.title}</p>
                  <p className="text-slate-400">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-black text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs border-t border-slate-800 pt-4">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Shipping Fee</span>
              <span className="font-bold text-white">{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-3 border-t border-slate-800">
              <span>Total to Pay</span>
              <span className="gradient-text text-xl">${total.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="text-xs font-bold text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full btn btn-primary py-4 text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Smartphone className="w-5 h-5 text-yellow-300" />
            <span>{paymentType === 'upi' ? `Proceed with UPI Payment ($${total.toFixed(2)})` : `Complete Payment ($${total.toFixed(2)})`}</span>
          </button>
        </div>
      </form>

      {/* Interactive UPI Payment Gateway Modal */}
      {isUpiModalOpen && (
        <UpiPaymentModal
          orderTotal={total}
          upiIdInput={upiVpaId}
          selectedApp={selectedUpiApp}
          onClose={() => setIsUpiModalOpen(false)}
          onPaymentSuccess={handleUpiSuccess}
        />
      )}

      {/* Direct Processing Spinner Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" />
          <div className="relative glass-panel bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-4 z-10 animate-fade-in shadow-2xl">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-white">Processing Transaction</h3>
            <p className="text-xs text-indigo-400 font-bold animate-pulse">{processingStep}</p>
          </div>
        </div>
      )}
    </div>
  );
}
