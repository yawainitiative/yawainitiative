import React, { useState } from 'react';
import { CreditCard, Heart, Shield, Check, Mail, Loader2, PartyPopper } from 'lucide-react';
import { User } from '../types';

interface DonateProps {
  user: User | null;
}

const Donate: React.FC<DonateProps> = ({ user }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const preSets = [1000, 5000, 10000, 50000];
  const PAYSTACK_PUBLIC_KEY = "pk_live_8d46e9ff701d90c8b1a8613b1d1b4c8df2954f81";

  const handleDonate = () => {
    const finalAmount = amount || Number(customAmount);
    if (!finalAmount || finalAmount <= 0) return;
    if (!email) {
      alert("Please enter your email address to proceed.");
      return;
    }

    setIsProcessing(true);

    const paystack = new (window as any).PaystackPop();
    paystack.newTransaction({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: finalAmount * 100, // Paystack expects amount in kobo
      currency: 'NGN',
      metadata: {
        custom_fields: [
          {
            display_name: "Donor Name",
            variable_name: "donor_name",
            value: user?.name || "Anonymous Donor"
          }
        ]
      },
      onSuccess: (transaction: any) => {
        setIsProcessing(false);
        setPaymentSuccess(true);
        console.log("Payment success:", transaction);
      },
      onCancel: () => {
        setIsProcessing(false);
      },
      onError: (error: any) => {
        setIsProcessing(false);
        console.error("Payment error:", error);
        alert("Payment failed. Please try again.");
      }
    });
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-slide-up">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
          <PartyPopper size={48} />
        </div>
        <h2 className="text-4xl font-extrabold text-yawai-blue">Thank You!</h2>
        <p className="text-slate-500 text-lg max-w-md">
          Your generous donation has been received. You are helping us build a better future for youth and women.
        </p>
        <button 
          onClick={() => { setPaymentSuccess(false); setAmount(''); setCustomAmount(''); }}
          className="bg-yawai-gold text-yawai-blue px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Make Another Donation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-block p-3 bg-red-50 rounded-full text-red-500 mb-2">
           <Heart size={32} fill="currentColor" />
        </div>
        <h2 className="text-4xl font-extrabold text-yawai-blue tracking-tight">Make an Impact</h2>
        <p className="text-slate-500 text-lg">Your contribution empowers youth and women with skills.</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-soft border border-slate-100">
        <div className="space-y-8">
          
          {/* Email Input (Required for Paystack) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yawai-gold transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!user?.email}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-yawai-gold focus:ring-1 focus:ring-yawai-gold transition-all disabled:opacity-70 disabled:bg-slate-100"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Amount (NGN)</h3>
            <div className="grid grid-cols-2 gap-4">
              {preSets.map(val => (
                <button
                  key={val}
                  onClick={() => { setAmount(val); setCustomAmount(''); }}
                  className={`py-6 rounded-2xl border-2 text-xl font-bold transition-all duration-200 relative
                    ${amount === val 
                      ? 'border-yawai-gold bg-yawai-gold/5 text-yawai-blue shadow-lg shadow-yellow-500/10' 
                      : 'border-slate-100 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }
                  `}
                >
                  ₦{val.toLocaleString()}
                  {amount === val && <div className="absolute top-2 right-2 text-yawai-gold"><Check size={16} /></div>}
                </button>
              ))}
            </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Or Enter Custom Amount</h3>
             <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl group-focus-within:text-yawai-gold transition-colors">₦</span>
              <input 
                type="number" 
                placeholder="0.00"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmount(''); }}
                className="w-full pl-12 pr-6 py-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-yawai-gold outline-none font-bold text-2xl text-slate-800 placeholder:text-slate-300 transition-all shadow-inner"
              />
            </div>
          </div>

          <button 
            onClick={handleDonate}
            disabled={(!amount && !customAmount) || !email || isProcessing}
            className="w-full bg-yawai-blue text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
          >
            {isProcessing ? (
              <>
                 <Loader2 className="animate-spin" size={24} />
                 <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Proceed to Payment</span>
                <Shield size={20} className="text-yawai-gold" />
              </>
            )}
          </button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
           <Shield size={14} />
           <span>Secured by Paystack</span>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100">
        <div className="flex justify-between items-end mb-4">
           <div>
             <h4 className="font-bold text-lg text-slate-800">Community Center Fund</h4>
             <p className="text-slate-400 text-sm">Goal: ₦10,000,000</p>
           </div>
           <span className="text-2xl font-black text-yawai-gold">75%</span>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
           <div className="h-full bg-gradient-to-r from-yawai-gold to-orange-500 w-3/4 rounded-full shadow-glow"></div>
        </div>
      </div>
    </div>
  );
};

export default Donate;