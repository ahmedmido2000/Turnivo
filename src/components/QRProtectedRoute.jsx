import { Navigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * QRProtectedRoute
 * Allows access if the URL contains fromQR=true or if session state persists it.
 * Prevents direct navigation to QR-gated pages (cleaning/maintenance details).
 */
const QRProtectedRoute = ({ children, fallback = '/cleaner/cleaning-requests' }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const fromQRParam = searchParams.get('fromQR') === 'true';

  // Check if we have a valid session for this specific ID
  const sessionQRKey = `qr_authorized_${id}`;
  const isAuthorizedInSession = id && sessionStorage.getItem(sessionQRKey) === 'true';

  useEffect(() => {
    // If we arrived via QR, persist it for this session/ID
    if (fromQRParam && id) {
      sessionStorage.setItem(sessionQRKey, 'true');
    }
  }, [fromQRParam, id, sessionQRKey]);

  if (!fromQRParam && !isAuthorizedInSession) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default QRProtectedRoute;
