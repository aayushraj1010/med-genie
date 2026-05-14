'use client';

import React, { useState, useEffect } from 'react';
import {
  Phone,
  X,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

export function SOSButton() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (open) {
      document.addEventListener('keydown', handleKey);

      // Prevent body scroll when modal opens
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const handleOpenMaps = () => {
    window.open(
      'https://www.google.com/maps/search/hospitals+near+me',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <>
      {/* SOS Trigger Button */}
      <button
        aria-label="Open emergency contacts"
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 6,
          border: 'none',
          backgroundColor: '#dc2626',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <AlertTriangle style={{ width: 13, height: 13 }} />
        SOS
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(5px)',
            overflow: 'hidden',
          }}
        >
          {/* Modal Box */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-title"
            style={{
              width: '100%',
              maxWidth: '380px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '18px',
              background: '#0d1117',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              position: 'relative',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(220,38,38,0.08)',
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(220,38,38,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertTriangle
                    style={{
                      width: 16,
                      height: 16,
                      color: '#f87171',
                    }}
                  />
                </div>

                <div>
                  <h2
                    id="sos-title"
                    style={{
                      margin: 0,
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Emergency Contacts
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      color: '#9ca3af',
                      fontSize: 11,
                    }}
                  >
                    India — tap any number to call
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Emergency Numbers */}
            <div
              style={{
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {[
                {
                  href: 'tel:112',
                  num: '112',
                  label: 'National Emergency',
                  color: '#f87171',
                  bg: 'rgba(239,68,68,0.1)',
                  border: 'rgba(239,68,68,0.2)',
                },
                {
                  href: 'tel:104',
                  num: '104',
                  label: 'Health Helpline',
                  color: '#fb923c',
                  bg: 'rgba(249,115,22,0.1)',
                  border: 'rgba(249,115,22,0.2)',
                },
                {
                  href: 'tel:08046110007',
                  num: '080-46110007',
                  label: 'NIMHANS Mental Health',
                  color: '#c084fc',
                  bg: 'rgba(168,85,247,0.1)',
                  border: 'rgba(168,85,247,0.2)',
                },
              ].map(({ href, num, label, color, bg, border }) => (
                <a
                  key={num}
                  href={href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px',
                    borderRadius: 12,
                    textDecoration: 'none',
                    background: bg,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone
                      style={{
                        width: 16,
                        height: 16,
                        color,
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        color,
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      {num}
                    </p>

                    <p
                      style={{
                        margin: '3px 0 0',
                        color: '#9ca3af',
                        fontSize: 11,
                      }}
                    >
                      {label}
                    </p>
                  </div>

                  <span
                    style={{
                      color: '#6b7280',
                      fontSize: 11,
                    }}
                  >
                    Call →
                  </span>
                </a>
              ))}
            </div>

            {/* Location */}
            <div style={{ padding: '0 14px 14px' }}>
              <div
                style={{
                  borderRadius: 12,
                  padding: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p
                  style={{
                    textAlign: 'center',
                    margin: '0 0 10px',
                    color: '#9ca3af',
                    fontSize: 11,
                  }}
                >
                  Need a nearby hospital?
                </p>

                <button
                  onClick={handleOpenMaps}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 10,
                    border: '1px solid rgba(96,165,250,0.2)',
                    background: 'rgba(96,165,250,0.1)',
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <MapPin size={14} />
                  Find Hospitals Near Me
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}