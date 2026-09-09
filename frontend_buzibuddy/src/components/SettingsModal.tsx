import React, { useState } from 'react';
import { X, Settings, Link2, ShieldCheck, AlertCircle } from 'lucide-react';
import { WebhookSettings } from '../lib/types';

interface SettingsModalProps {
  settings: WebhookSettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (settings: WebhookSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSaveSettings,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl);
  const [useProxy, setUseProxy] = useState(settings.useProxy);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      webhookUrl: webhookUrl.trim(),
      useProxy,
    });
    onClose();
  };

  const handleResetDefaults = () => {
    setWebhookUrl('http://localhost:5678/webhook/buzibuddy-frontend-connect');
    setUseProxy(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Settings className="h-5 w-5 text-emerald-600" />
            <span>Connection Settings</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Link2 className="h-3.5 w-3.5 text-emerald-600" />
              Webhook URL
            </label>
            <input
              type="url"
              required
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="e.g. http://localhost:5678/webhook/..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
            />
          </div>

          {/* Proxy Option */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useProxy}
                onChange={(e) => setUseProxy(e.target.checked)}
                className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Use Server-Side Proxy
                </span>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Highly recommended when running inside cloud-hosted previews. This routes n8n requests through our backend server to bypass browser CORS constraints and Mixed Content (HTTPS to HTTP) blocks.
                </p>
              </div>
            </label>
          </div>

          {/* Helpful Warning */}
          {webhookUrl.includes('localhost') && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-xs text-amber-800 leading-relaxed">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                Connecting to a local n8n workflow? If this frontend is running in the cloud (as in the AI Studio live preview), a local webhook URL will only work when you use the provided <strong>Docker Compose</strong> setup locally or change the webhook to a public HTTPS url.
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs font-bold text-slate-400 hover:text-emerald-700 hover:underline"
            >
              Reset to Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-save-settings"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/10 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
