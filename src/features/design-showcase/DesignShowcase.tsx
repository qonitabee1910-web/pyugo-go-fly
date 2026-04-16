/**
 * PYU-GO Design System Showcase
 * 
 * Live demonstration of design tokens, components, and patterns
 * Shows proper usage of the modern premium UI system
 */

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Home,
  MapPin,
  Zap,
  Heart,
  Star,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';
import { ComponentStyles, PATTERNS, COLORS, STATES } from '@/design-system';

export function DesignShowcase() {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'components' | 'patterns'>('colors');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className={ComponentStyles.typography.h2}>PYU-GO Design System</h1>
          <p className={`${ComponentStyles.typography.bodySmall} text-gray-600 mt-2`}>
            Modern, premium UI system for super app platform
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 sm:gap-2 overflow-x-auto">
          {[
            { id: 'colors', label: '🎨 Colors', icon: 'palette' },
            { id: 'typography', label: '🔤 Typography' },
            { id: 'components', label: '🧩 Components' },
            { id: 'patterns', label: '📐 Patterns' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Colors */}
        {activeTab === 'colors' && (
          <div className="space-y-8">
            <section>
              <h2 className={ComponentStyles.typography.h3}>Primary Colors (Brand Blue)</h2>
              <p className={ComponentStyles.typography.bodySmall}>
                Main brand color for CTAs, links, and active states
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mt-4">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div
                    key={shade}
                    className="aspect-square rounded-lg shadow-sm flex items-center justify-center text-xs font-semibold"
                    style={{
                      backgroundColor: `hsl(217, 91%, ${100 - shade / 9})`,
                      color: shade > 500 ? 'white' : 'black',
                    }}
                  >
                    {shade}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={ComponentStyles.typography.h3}>Semantic Colors</h2>
              <p className={ComponentStyles.typography.bodySmall}>
                Specific colors for success, warning, error, and info states
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                {[
                  { name: 'Success', color: '#10B981', desc: 'Confirmations, completed actions' },
                  { name: 'Warning', color: '#F59E0B', desc: 'Alerts, pending states' },
                  { name: 'Error', color: '#EF4444', desc: 'Errors, destructive actions' },
                  { name: 'Info', color: '#3B82F6', desc: 'Information, notifications' },
                ].map((item) => (
                  <div key={item.name} className={ComponentStyles.card.base}>
                    <div
                      className="w-full h-24 rounded-lg mb-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className={ComponentStyles.typography.h4}>{item.name}</p>
                    <p className={ComponentStyles.typography.caption}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={ComponentStyles.typography.h3}>Neutral Grays (Backgrounds & Text)</h2>
              <p className={ComponentStyles.typography.bodySmall}>
                Used for text, backgrounds, borders, and secondary actions
              </p>
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-2 mt-4">
                {[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="aspect-square rounded-lg shadow-sm flex items-center justify-center text-xs font-semibold border"
                    style={{
                      backgroundColor: shade === 0 ? 'white' : `hsl(210, 7%, ${100 - shade / 9})`,
                      color: shade > 500 ? 'white' : 'black',
                    }}
                  >
                    {shade}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Typography */}
        {activeTab === 'typography' && (
          <div className="space-y-12">
            <section>
              <h2 className={ComponentStyles.typography.h3}>Heading Scale</h2>
              <div className="space-y-6 mt-6">
                {[
                  { tag: 'h1', text: 'Heading 1 - 32px, bold, tracking-tight' },
                  { tag: 'h2', text: 'Heading 2 - 24px, bold, tracking-tight' },
                  { tag: 'h3', text: 'Heading 3 - 20px, semibold' },
                  { tag: 'h4', text: 'Heading 4 - 18px, semibold' },
                ].map((item) => (
                  <div key={item.tag}>
                    <p className={ComponentStyles.typography[item.tag as 'h1' | 'h2' | 'h3' | 'h4']}>
                      {item.text}
                    </p>
                    <p className={ComponentStyles.typography.caption}>
                      Use for: {item.tag === 'h1' ? 'Page titles' : item.tag === 'h2' ? 'Section headers' : item.tag === 'h3' ? 'Subsections' : 'Card titles'}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={ComponentStyles.typography.h3}>Body Text & Labels</h2>
              <div className="space-y-4 mt-6">
                <div>
                  <p className={ComponentStyles.typography.body}>
                    Body Text (16px) - This is the main content text used for descriptions, paragraphs, and general information. It has proper line height for readability.
                  </p>
                </div>
                <div>
                  <p className={ComponentStyles.typography.bodySmall}>
                    Body Small (14px) - Secondary text for descriptions, metadata, or less important information.
                  </p>
                </div>
                <div>
                  <p className={ComponentStyles.typography.label}>Form Label (12px, Uppercase)</p>
                  <p className={ComponentStyles.typography.caption}>
                    Caption (12px) - For metadata, timestamps, or helper text
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Components */}
        {activeTab === 'components' && (
          <div className="space-y-12">
            <section>
              <h2 className={ComponentStyles.typography.h3}>Buttons</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div>
                  <p className={ComponentStyles.typography.label}>Primary Button</p>
                  <button className={`${ComponentStyles.button.base} ${ComponentStyles.button.primary} ${ComponentStyles.button.md} mt-3`}>
                    Primary Action
                  </button>
                </div>
                <div>
                  <p className={ComponentStyles.typography.label}>Secondary Button</p>
                  <button className={`${ComponentStyles.button.base} ${ComponentStyles.button.secondary} ${ComponentStyles.button.md} mt-3`}>
                    Secondary Action
                  </button>
                </div>
                <div>
                  <p className={ComponentStyles.typography.label}>Outline Button</p>
                  <button className={`${ComponentStyles.button.base} ${ComponentStyles.button.outline} ${ComponentStyles.button.md} mt-3`}>
                    Outline Button
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h2 className={ComponentStyles.typography.h3}>Cards</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div className={ComponentStyles.card.base}>
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3" />
                  <h4 className={ComponentStyles.typography.h4}>Elevated Card</h4>
                  <p className={ComponentStyles.typography.bodySmall}>
                    Soft shadow with hover effect for interactive content
                  </p>
                </div>
                <div className={ComponentStyles.card.outlined}>
                  <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-3" />
                  <h4 className={ComponentStyles.typography.h4}>Outlined Card</h4>
                  <p className={ComponentStyles.typography.bodySmall}>
                    Bordered design for secondary content
                  </p>
                </div>
                <div className={ComponentStyles.card.ghost}>
                  <div className="h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg mb-3" />
                  <h4 className={ComponentStyles.typography.h4}>Ghost Card</h4>
                  <p className={ComponentStyles.typography.bodySmall}>
                    Subtle background for minimal visual weight
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className={ComponentStyles.typography.h3}>Badges & Chips</h2>
              <div className="flex flex-wrap gap-3 mt-6">
                {['success', 'warning', 'error', 'gray', 'info'].map((variant) => (
                  <span key={variant} className={`${ComponentStyles.badge.base} ${ComponentStyles.badge[variant as 'success' | 'warning' | 'error' | 'gray' | 'info']}`}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className={ComponentStyles.typography.h3}>Alerts</h2>
              <div className="space-y-3 mt-6">
                {[
                  { variant: 'success', icon: CheckCircle, text: 'Success message - Action completed successfully' },
                  { variant: 'error', icon: AlertCircle, text: 'Error message - Something went wrong, please try again' },
                  { variant: 'warning', icon: AlertCircle, text: 'Warning message - Please be careful with this action' },
                  { variant: 'info', icon: AlertCircle, text: 'Info message - Important information for you' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.variant} className={`${ComponentStyles.alert.base} ${ComponentStyles.alert[item.variant as 'success' | 'error' | 'warning' | 'info']}`}>
                      <Icon size={20} className="flex-shrink-0 mt-0.5" />
                      <p>{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* Patterns */}
        {activeTab === 'patterns' && (
          <div className="space-y-12">
            <section>
              <h2 className={ComponentStyles.typography.h3}>Input Group with Label & Error</h2>
              <div className={PATTERNS.inputGroup}>
                <label className={PATTERNS.inputLabel}>Email Address</label>
                <input
                  className={`${ComponentStyles.input.base} ${ComponentStyles.input.focus}`}
                  type="email"
                  placeholder="your@email.com"
                />
                <span className={PATTERNS.inputError}>This email is already in use</span>
              </div>
            </section>

            <section>
              <h2 className={ComponentStyles.typography.h3}>Section Header Pattern</h2>
              <div className={PATTERNS.sectionHeader}>
                <span>Recent Transactions</span>
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  See All <ChevronRight size={16} />
                </a>
              </div>
            </section>

            <section>
              <h2 className={ComponentStyles.typography.h3}>Empty State</h2>
              <div className={STATES.empty.container}>
                <ShoppingBag size={48} className={STATES.empty.icon} />
                <h4 className={STATES.empty.title}>No Transactions Yet</h4>
                <p className={STATES.empty.description}>Start by making your first booking on PYU-GO</p>
                <button className={`${ComponentStyles.button.base} ${ComponentStyles.button.primary} ${ComponentStyles.button.md}`}>
                  Make a Booking
                </button>
              </div>
            </section>

            <section>
              <h2 className={ComponentStyles.typography.h3}>Card Grid Layout</h2>
              <div className={ComponentStyles.grid.desktop}>
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={ComponentStyles.card.base}>
                    <div className="flex items-start justify-between mb-3">
                      <Zap size={24} className="text-blue-600" />
                      <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <p className={ComponentStyles.typography.h4}>Feature {item}</p>
                    <p className={ComponentStyles.typography.bodySmall}>
                      Description of this amazing feature that helps users
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className={ComponentStyles.typography.h3}>Bottom Navigation Pattern</h2>
              <div className="border-t border-gray-200 grid grid-cols-4 gap-2 p-4 bg-gray-50 rounded-xl">
                {[
                  { icon: Home, label: 'Beranda' },
                  { icon: MapPin, label: 'Lokasi' },
                  { icon: ShoppingBag, label: 'Pesanan' },
                  { icon: 'user', label: 'Akun' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button key={idx} className="flex flex-col items-center gap-1 py-2 text-gray-600 hover:text-blue-600 transition">
                      {typeof Icon === 'string' ? (
                        <div className="w-6 h-6 bg-gray-300 rounded-full" />
                      ) : (
                        <Icon size={24} />
                      )}
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className={ComponentStyles.typography.caption}>
            PYU-GO Design System v1.0 • Last updated April 16, 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default DesignShowcase;
