import React from 'react';
import { EVENTS } from '../constants';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

const Events: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
       <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <h2 className="text-3xl font-extrabold text-yawai-blue mb-2">Upcoming Events</h2>
        <p className="text-slate-500 text-lg">Connect, learn, and grow at our next gathering.</p>
      </div>

      <div className="space-y-6">
        {EVENTS.map((evt) => (
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
              
              <p className="text-slate-600 mb-6 leading-relaxed">{evt.description}</p>
              
              <div className="flex flex-wrap gap-6 items-center border-t border-slate-50 pt-4">
                 <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                   <Clock size={16} className="text-slate-300" />
                   10:00 AM - 4:00 PM
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                   <MapPin size={16} className="text-slate-300" />
                   {evt.location}
                </div>
                <div className="flex-1 md:text-right flex justify-end gap-3 mt-4 md:mt-0 w-full md:w-auto">
                   <button className="bg-yawai-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl text-sm">
                    RSVP Now
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;