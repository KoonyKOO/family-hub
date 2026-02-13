import React from 'react';
import useOnlineStatus from '../../hooks/useOnlineStatus';

const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-3 py-2 text-center text-sm text-yellow-800">
      오프라인 상태입니다. 저장된 데이터를 보고 있습니다.
    </div>
  );
};

export default OfflineBanner;
