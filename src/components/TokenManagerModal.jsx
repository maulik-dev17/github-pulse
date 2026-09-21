import React, { useState } from 'react';
import { KeyRound, X, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { getStoredToken, saveStoredToken, fetchRateLimit } from '../services/githubApi';
import { Button } from './ui/Button';

export const TokenManagerModal = ({
  isOpen,
  onClose,
  rateLimit,
  onRateLimitUpdated,
}) => {
  const [tokenInput, setTokenInput] = useState(getStoredToken);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setStatusMessage(null);

    const cleanToken = tokenInput.trim();
    saveStoredToken(cleanToken);

    try {
      const updated = await fetchRateLimit();
      onRateLimitUpdated(updated);
      setIsVerifying(false);

      if (cleanToken && updated.limit >= 5000) {
        setStatusMessage({
          type: 'success',
          text: `Token authenticated! Your quota is upgraded to ${updated.limit.toLocaleString()} requests/hr.`,
        });
      } else if (!cleanToken) {
        setStatusMessage({
          type: 'success',
          text: `Token removed. Reverted to anonymous rate limit (${updated.limit} requests/hr).`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: `Token was accepted but returned standard quota (${updated.limit} req/hr). Please verify permissions.`,
        });
      }
    } catch {
      setIsVerifying(false);
      setStatusMessage({
        type: 'error',
        text: 'Failed to verify token with GitHub API. Please verify network or token validity.',
      });
    }
  };

  const handleClear = async () => {
    setTokenInput('');
    saveStoredToken('');
    const updated = await fetchRateLimit();
    onRateLimitUpdated(updated);
    setStatusMessage({
      type: 'success',
      text: 'Token cleared successfully.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-md">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl ghost-shadow p-6 sm:p-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary text-on-primary flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-on-surface font-headline tracking-tight">
                Live GitHub API & Quota
              </h2>
              <p className="font-label text-xs text-secondary font-medium">
                Production Rate-Limit & Token Settings
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

        {/* Live Quota Pill */}
        {rateLimit && (
          <div className="my-4 p-4 bg-surface-container-low rounded-md flex items-center justify-between">
            <div>
              <span className="font-label text-[10px] text-secondary uppercase tracking-widest block">
                Current Live Quota
              </span>
              <span className="font-label font-bold text-base text-on-surface">
                {rateLimit.remaining} / {rateLimit.limit} requests remaining
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-label font-bold uppercase ${
                rateLimit.isCustomToken
                  ? 'bg-primary-fixed-dim text-on-primary-fixed-variant'
                  : 'bg-secondary-container text-on-secondary-container'
              }`}
            >
              {rateLimit.isCustomToken ? 'Authenticated (5,000/hr)' : 'Public (60/hr)'}
            </span>
          </div>
        )}

        {/* Token Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-headline font-bold text-xs text-on-surface mb-1">
              Personal Access Token (Optional)
            </label>
            <p className="text-[11px] text-secondary mb-2">
              GitHub restricts anonymous browsers to 60 requests/hr. Add a classic or fine-grained GitHub token (with zero permissions needed, read-only public data) to elevate your quota to 5,000 requests/hr.
            </p>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 bg-surface-container-low rounded-md outline-none font-label text-xs text-on-surface placeholder:text-secondary/50 focus:ring-2 focus:ring-primary/20"
              spellCheck="false"
            />
          </div>

          {/* Privacy Guarantee */}
          <div className="flex items-start gap-2 p-3 bg-surface-container-low rounded-md text-[11px] text-secondary">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              <strong>Zero-server storage</strong>: Your token is stored strictly in your browser's <code className="font-label text-primary">localStorage</code> and transmitted only to <code className="font-label text-primary">https://api.github.com</code> via HTTPS Authorization headers.
            </span>
          </div>

          {/* Feedback Status */}
          {statusMessage && (
            <div
              className={`p-3 rounded-md flex items-center gap-2 text-xs font-label ${
                statusMessage.type === 'success'
                  ? 'bg-primary-fixed-dim/50 text-on-primary-fixed-variant'
                  : 'bg-error-container text-on-error-container'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-label text-primary hover:underline flex items-center gap-1"
            >
              <span>Create Token on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center gap-2">
              {getStoredToken() && (
                <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
                  Remove Token
                </Button>
              )}
              <Button type="submit" variant="primary" size="sm" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Save & Verify'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
