import React from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import SimpleBar from 'simplebar-react';

type SimpleBarScrollProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
};

const SimpleBarScroll = ({ children, className = '', style, ...other }: SimpleBarScrollProps) => {
  return (
    <React.Fragment>
      <BrowserView style={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
        <SimpleBar
          clickOnTrack={false}
          style={{ maxHeight: '100%', ...style }}
          className={className}
          data-simplebar-direction="ltr"
          {...other}
        >
          {children}
        </SimpleBar>
      </BrowserView>

      <MobileView>
        <div style={{ overflowX: 'auto', ...style }} className={className} {...other}>
          {children}
        </div>
      </MobileView>
    </React.Fragment>
  );
};

export default SimpleBarScroll;
