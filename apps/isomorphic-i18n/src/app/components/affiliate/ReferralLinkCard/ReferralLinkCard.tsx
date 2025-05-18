'use client';

import { useRef, useState } from 'react';
import { FaLink, FaQrcode, FaShareAlt, FaCopy } from 'react-icons/fa';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import QRCode from 'qrcode.react';
import { Tooltip } from 'rizzui';

interface ReferralLinkCardProps {
  referralLink: string;
  lang: string;
}

const ReferralLinkCard = ({ referralLink, lang }: ReferralLinkCardProps) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Referral Link',
          text: 'Join via this referral link',
          url: referralLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Share not supported on this browser.');
    }
  };

  const handleDownloadQR = () => {
    const qrCanvas = qrRef.current?.querySelector('canvas');
    if (!qrCanvas) return;
  
    const qrSize = qrCanvas.width;
    const padding = 16;
  
    const canvas = document.createElement('canvas');
    const newSize = qrSize + padding * 2;
    canvas.width = newSize;
    canvas.height = newSize;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, newSize, newSize);
  
    ctx.drawImage(qrCanvas, padding, padding);
  
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = canvas.toDataURL();
    link.click();
  };
  
  const text = {
    title: lang === 'ar' ? 'رابط الإحالة الخاص بك' : 'Your Referral Link',
    qr: lang === 'ar' ? 'رمز QR' : 'QR Code',
    copy: lang === 'ar' ? 'نسخ الرابط' : 'Copy Link',
    share: lang === 'ar' ? 'مشاركة الرابط' : 'Share Link',
    desc: lang === 'ar'
      ? 'شارك هذا الرابط مع المشتركين المحتملين. ستحصل على عمولة مقابل كل اشتراك من خلال الرابط.'
      : "Share this link with potential subscribers. You'll earn commission for every subscription made through your link.",
  };

  return (
    <div className="bg-white mt-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaLink className="text-primary" />
          {text.title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadQR}
            className="border border-primary text-primary px-3 py-2 rounded text-sm hover:bg-rose-50"
          >
            <FaQrcode className="mr-1 inline" /> {text.qr}
          </button>
          <button
            onClick={handleShare}
            className="bg-primary text-white px-3 py-2 rounded text-sm hover:bg-primary-dark"
          >
            <FaShareAlt className="mr-1 inline" /> {text.share}
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600">{text.desc}</p>
        <div className="flex items-center mt-4 p-2 border border-dashed border-rose-300 bg-rose-50 rounded">
          <div className="text-primary font-mono flex-1 truncate">{referralLink}</div>
          <Tooltip size="sm" content={text.copy} placement="top" color="invert">
            <button
              className="ml-2 text-primary hover:text-primary-dark p-1"
              onClick={handleCopy}
            >
              {copied ? (
                <IoCheckmarkDoneSharp className="text-lg" />
              ) : (
                <FaCopy />
              )}
            </button>
          </Tooltip>
        </div>
        <div className="mt-4 justify-center hidden" ref={qrRef}>
          <QRCode value={referralLink} size={128} />
        </div>
      </div>
    </div>
  );
};

export default ReferralLinkCard;
