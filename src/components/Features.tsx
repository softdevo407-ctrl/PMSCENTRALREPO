
import React from 'react';
import { Activity, Shield, Repeat, Layout } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      title: "Budget Monitoring",
      description: "Track satellite project budgets in real-time. Monitor expenditure, variances, and financial execution across all active missions and programmes.",
      icon: <Activity className="w-6 h-6" />,
      color: "indigo"
    },
    {
      title: "Role-Based Access",
      description: "Specialized dashboards for Project Directors, Programme Directors, and Chairman. Each role has customized views and controls for their responsibilities.",
      icon: <Layout className="w-6 h-6" />,
      color: "sky"
    },
    {
      title: "Revision Management",
      description: "Handle budget and schedule revisions efficiently. Multi-level approvals ensure proper governance while keeping satellite projects on track.",
      icon: <Repeat className="w-6 h-6" />,
      color: "teal"
    },
    {
      title: "Security & Compliance",
      description: "Enterprise-grade security for sensitive space programme data. Role-based access control and comprehensive audit trails for full accountability.",
      icon: <Shield className="w-6 h-6" />,
      color: "indigo"
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-indigo-600 font-bold tracking-widest text-sm uppercase mb-3">Key Features</h2>
          <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">Manage satellite projects with complete control</h3>
          <p className="text-lg text-slate-600">
            PMS provides comprehensive project management tools designed for satellite programmes and complex space initiatives requiring strict financial oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                feature.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                feature.color === 'sky' ? 'bg-sky-50 text-sky-600' :
                'bg-teal-50 text-teal-600'
              }`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
