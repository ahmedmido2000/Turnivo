import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';

/**
 * Role IDs:
 * 3 - Client (مالك العقارات)
 * 4 - Cleaner (عامل النظافة)
 * 5 - Supervisor (المشرف) - يستخدم مسارات supervisor/
 * 6 - Guest (الضيف)
 */

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, roleId } = useSelector(selectAuth);
  const location = useLocation();

  // التحقق من وجود token
  if (!token) {
    // حفظ الصفحة المطلوبة للرجوع إليها بعد تسجيل الدخول
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // التحقق من صلاحية المستخدم
  if (allowedRoles.length > 0 && !allowedRoles.includes(roleId)) {
    // توجيه المستخدم لصفحته الرئيسية حسب دوره
    const redirectPath = getDefaultPath(roleId);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

/**
 * الحصول على المسار الافتراضي حسب دور المستخدم
 */
const getDefaultPath = (roleId) => {
  switch (roleId) {
    case 3:
      return '/client/dashboard';
    case 4:
      return '/cleaner/cleaning-requests';
    case 5:
      return '/supervisor/dashboard'; // Supervisor routes
    case 6:
      return '/guest/list';
    default:
      return '/';
  }
};

/**
 * مكون للتحقق من أن المستخدم غير مسجل دخول
 * يستخدم لصفحات تسجيل الدخول
 */
export const PublicRoute = ({ children }) => {
  const { token, roleId } = useSelector(selectAuth);

  if (token) {
    // إذا كان مسجل دخول، وجهه لصفحته الرئيسية
    const redirectPath = getDefaultPath(roleId);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Role constants للاستخدام في App.jsx
export const ROLES = {
  CLIENT: 3,
  CLEANER: 4,
  SUPERVISOR: 5,
  GUEST: 6,
};

export default ProtectedRoute;
