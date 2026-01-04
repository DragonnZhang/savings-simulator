import { useEffect, useRef } from 'react';

type AdUnitProps = {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
};

const AdUnit = ({ slotId, format = 'auto', layoutKey, style, className }: AdUnitProps) => {
  const adInit = useRef(false);

  useEffect(() => {
    if (adInit.current) return;
    adInit.current = true;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  if (process.env.NODE_ENV !== 'production') {
     return (
        <div 
          className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm p-4 ${className}`}
          style={{ minHeight: '100px', ...style }}
        >
           Ad Placeholder (Slot: {slotId})
        </div>
     )
  }

  return (
    <div className={className} style={{ overflow: 'hidden', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_PID || "8595589014201175"}`}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-ad-layout-key={layoutKey}
      />
    </div>
  );
};

export default AdUnit;
