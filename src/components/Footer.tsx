
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="font-display font-bold text-xl tracking-tight">PMS</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
              Satellite Project Management System (PMS) for comprehensive project oversight and control.
            </p>
            <div className="flex gap-4">
               {['twitter', 'linkedin', 'github'].map((social) => (
                 <a key={social} href="#" className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                   <span className="sr-only">{social}</span>
                   <div className="w-5 h-5 bg-current mask-icon" style={{ WebkitMask: `url(https://simpleicons.org/icons/${social}.svg) no-repeat center` }}></div>
                 </a>
               ))}
            </div>
          </div>
          
          <div>
            <h6 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Product</h6>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Security</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Documentation</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Company</h6>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">About</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Resources</h6>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Docs</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">API Reference</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2025 PMS. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
