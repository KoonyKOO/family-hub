import React, { useState, useEffect } from 'react';
import pushService from '../../services/pushService';

const DISMISS_KEY = 'notification-prompt-dismissed';

const NotificationPrompt = () => {
  const [status, setStatus] = useState('loading');
  // status: 'loading' | 'show-enable' | 'show-install' | 'hidden'

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) {
      setStatus('hidden');
      return;
    }

    if (!pushService.isPushSupported()) {
      setStatus('hidden');
      return;
    }

    if (Notification.permission === 'granted') {
      setStatus('hidden');
      return;
    }

    if (Notification.permission === 'denied') {
      setStatus('hidden');
      return;
    }

    if (pushService.isStandalonePWA()) {
      setStatus('show-enable');
    } else {
      setStatus('show-install');
    }
  }, []);

  const handleEnable = async () => {
    try {
      const granted = await pushService.requestPermission();
      if (granted) {
        await pushService.subscribeToPush();
      }
      setStatus('hidden');
    } catch {
      setStatus('hidden');
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setStatus('hidden');
  };

  if (status === 'loading' || status === 'hidden') return null;

  if (status === 'show-install') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800">
              푸시 알림을 받으려면 홈 화면에 추가하세요
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Safari 공유 버튼 → "홈 화면에 추가"를 탭하세요
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-blue-400 hover:text-blue-600 ml-2"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-blue-800">
          가족 활동 알림을 받으시겠어요?
        </p>
        <div className="flex gap-2 ml-2">
          <button
            onClick={handleDismiss}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
          >
            나중에
          </button>
          <button
            onClick={handleEnable}
            className="text-xs bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700"
          >
            알림 활성화
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
