import React from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { LanguageBadge } from './ui/LanguageBadge';
import { MetadataChip } from './ui/MetadataChip';
import { Button } from './ui/Button';

export const DesignSystemInspector = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const colorTokens = [
    { name: 'surface', hex: '#f6fafe', role: 'Base vast canvas' },
    { name: 'surface-container-low', hex: '#f0f4f8', role: 'Secondary grouping & stats' },
    { name: 'surface-container', hex: '#eaeef2', role: 'Mid-tone structure' },
    { name: 'surface-container-high', hex: '#e4e9ed', role: 'Interactive pill hover' },
    { name: 'surface-container-highest', hex: '#dfe3e7', role: 'Temporary drop/skeletons' },
    { name: 'surface-container-lowest', hex: '#ffffff', role: 'Primary interactive cards' },
    { name: 'on-surface', hex: '#171c1f', role: 'Ink text (Never #000000)' },
    { name: 'primary', hex: '#b80035', role: 'Pulse Red signature' },
    { name: 'primary-container', hex: '#e11d48', role: 'CTA 135° gradient endpoint' },
    { name: 'primary-fixed-dim', hex: '#ffb3b6', role: 'Language tag background' },
    { name: 'on-primary-fixed-variant', hex: '#920028', role: 'Language tag text' },
    { name: 'secondary-container', hex: '#dae2fd', role: 'Durable metadata chips' },
    { name: 'outline-variant', hex: '#e5bdbe', role: 'Ghost border fallback (15% op)' },
  ];

  const rules = [
    {
      title: 'The "No-Line" Rule',
      desc: '1px solid borders are strictly prohibited for sectioning. Boundaries are created through background shifts and negative space gutters.',
    },
    {
      title: 'Intentional Asymmetry',
      desc: 'Large user avatar placed slightly off-axis with subtle rotational tilt (-3° to +3°) against clean editorial bio layout.',
    },
    {
      title: 'Dual-Font Strategy',
      desc: 'Inter for headlines with tight letter-spacing (-0.02em); Space Grotesk for stats, star counts, languages, and search queries.',
    },
    {
      title: 'Ghost Shadows',
      desc: 'Tonal elevation with color hsla(222, 47%, 11%, 0.04), 40px blur, and 12px Y-offset for a soft light glow rather than a dark stain.',
    },
    {
      title: 'Signature CTA Texture',
      desc: '135° linear gradient from primary (#b80035) to primary_container (#e11d48) with tactile depression on click.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-surface-container-lowest rounded-xl ghost-shadow p-6 sm:p-8 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary text-on-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-on-surface font-headline tracking-tight">
                The Kinetic Monolith
              </h2>
              <p className="font-label text-xs text-primary font-bold uppercase tracking-widest">
                Design System Strategy & Token Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-surface-container-low text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Core Rules */}
        <div className="mb-8">
          <h3 className="font-headline text-base font-bold text-on-surface mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Core Architecture Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 bg-surface-container-low rounded-md space-y-1"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <h4 className="font-headline font-bold text-xs text-on-surface">
                    {rule.title}
                  </h4>
                </div>
                <p className="text-[11px] text-secondary leading-relaxed pl-5">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Color Tokens Matrix */}
        <div className="mb-8">
          <h3 className="font-headline text-base font-bold text-on-surface mb-3">
            Surface Stack & Palette Tokens
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {colorTokens.map((token, idx) => (
              <div
                key={idx}
                className="p-3 rounded-md bg-surface-container-low flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-sm shrink-0 shadow-sm"
                    style={{
                      backgroundColor: token.hex,
                      border: token.hex === '#ffffff' ? '1px solid #e2e8f0' : 'none',
                    }}
                  />
                  <span className="font-label text-[11px] font-bold text-on-surface truncate">
                    {token.name}
                  </span>
                </div>
                <div className="text-[10px] font-label text-secondary flex justify-between">
                  <span>{token.hex}</span>
                </div>
                <p className="text-[9px] text-secondary/80 line-clamp-1">{token.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Interactive Token Samples */}
        <div className="space-y-4 pt-2">
          <h3 className="font-headline text-base font-bold text-on-surface">
            Live Token Components
          </h3>
          <div className="p-5 bg-surface-container-low rounded-md flex flex-wrap items-center gap-4">
            <Button variant="primary" size="md">
              Primary Pulse CTA
            </Button>
            <Button variant="ghost" size="md">
              Ghost Action
            </Button>
            <LanguageBadge language="TypeScript" dotColor="#3178c6" />
            <LanguageBadge language="Pulse Red" dotColor="#b80035" />
            <MetadataChip label="Component" />
            <MetadataChip label="Public Repo" />
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8 flex justify-end">
          <Button variant="primary" size="md" onClick={onClose}>
            Back to Application
          </Button>
        </div>
      </div>
    </div>
  );
};
