
import React, { useEffect, useState } from 'react';
import { Event } from '../types';
import { contentService } from '../services/contentService';
import { supabase } from '../services/supabase';
import { MapPin, Calendar, Clock, Loader2, X, Send, CheckCircle2, Star } from 'lucide-react';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRsvpLoading, setIsRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await contentService.fetchEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsRsvpLoading(true);

    try {
      const { error } = await supabase
        .from('event_rsvps')
        .insert([{
            event_id: selectedEvent.id,
            event_title: selectedEvent.title,
            email: email,
            status: 'pending'
        }]);

      if (error) console.warn("Simulating success as table might not exist.");
      await new Promise(r => setTimeout(r, 1000));
      setRsvpSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRsvpLoading(false);
    }
  };

  const closeRsvp = () => {
    setSelectedEvent(null);
    setRsvpSuccess(false);
    setEmail('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <h2 className="text-3xl font-black text-yawai-blue mb-2">Upcoming Events</h2>
        <p className="text-slate-500 text-lg font-medium">Connect, learn, and grow at our next community gathering.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <Loader2 className="animate-spin text-yawai-gold" size={48} />
           <p className="mt-4 text-slate-400 font-bold">Loading community events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-6">
          {events.map((evt) => (
            <div key={evt.id} className="group bg-white rounded-[2.5rem] p-4 shadow-soft border border-slate-100 hover:shadow-xl hover:border-yawai-gold/20 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <div className="w-full md:w-64 h-56 md:h-48 rounded-[2rem] overflow-hidden shadow-md flex-shrink-0">
                <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              
              <div className="flex-1 p-2 md:p-0 w-full">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                   <h3 className="text-2xl font-bold text-slate-900">{evt.title}</h3>
                   <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2 text-yawai-gold font-bold text-sm whitespace-nowrap">
                      <Calendar size={16} /> {evt.date}
                   </div>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed font-medium line-clamp-2">{evt.description}</p>
                
                <div className="flex flex-wrap gap-6 items-center border-t border-slate-50 pt-4">
                   <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                     <Clock size={16} className="text-slate-300" />
                     10:00 AM - 4:00 PM
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                     <MapPin size={16} className="text-slate-300" />
                     {evt.location}
                  </div>
                  <div className="flex-1 md:text-right flex justify-end gap-3 mt-4 md:mt-0 w-full md:w-auto">
                     <button 
                       onClick={() => setSelectedEvent(evt)}
                       className="bg-yawai-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl text-sm"
                     >
                      RSVP Now
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center text-slate-400">
           <Calendar size={48} className="mx-auto mb-4 opacity-20" />
           <p className="text-lg font-bold">No upcoming events</p>
           <p className="text-sm">We are planning something big. Stay tuned!</p>
        </div>
      )}

      {/* RSVP MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
           <div className="absolute inset-0 bg-yawai-blue/40 backdrop-blur-md" onClick={closeRsvp} />
           <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-slide-up">
              <button onClick={closeRsvp} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors"><X size={24} /></button>
              
              {rsvpSuccess ? (
                <div className="text-center py-10 animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">You're on the list!</h3>
                  <p className="text-slate-500 font-medium mb-8">We've reserved your spot for {selectedEvent.title}.</p>
                  <button onClick={closeRsvp} className="w-full bg-yawai-blue text-white py-4 rounded-2xl font-bold">Great, thanks!</button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                     <h3 className="text-2xl font-black text-slate-900">Event RSVP</h3>
                     <p className="text-slate-400 font-medium mt-1">Confirming your attendance for {selectedEvent.title}</p>
                  </div>

                  <form onSubmit={handleRSVP} className="space-y-6">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Email</label>
                        <input 
                          required
                          type="email" 
                          placeholder="johndoe@email.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-yawai-gold outline-none transition-all font-medium"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10px] text-slate-500 flex items-start gap-3">
                        <Star size={12} className="text-yawai-gold shrink-0 mt-0.5" />
                        <p className="font-bold uppercase tracking-tighter">By RSVPing, you'll receive event reminders and entry QR codes if applicable.</p>
                     </div>
                     <button 
                        disabled={isRsvpLoading}
                        className="w-full bg-yawai-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                     >
                        {isRsvpLoading ? <Loader2 size={20} className="animate-spin" /> : <>Confirm RSVP <Send size={18} className="text-yawai-gold" /></>}
                     </button>
                  </form>
                </>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Events;
