import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/auth';
import {
  fetchAdminCustomer,
  fetchCustomerSubscriptions,
  fetchCustomerBookings,
  fetchCustomerAttendance,
  fetchCustomerPayments,
  fetchCustomerPointCards,
  impersonateCustomer,
} from '@/api/admin';
import type {
  CustomerUser,
  CustomerSubscriptionDetail,
  CustomerBookingDetail,
  CustomerAttendanceDetail,
  CustomerPaymentDetail,
  CustomerPointCardDetail,
} from '@/api/admin';
import { formatCurrency } from '@/lib/format';

type Tab = 'profile' | 'subscriptions' | 'bookings' | 'attendance' | 'payments';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString();
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { t } = useTranslation();

  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [subscriptions, setSubscriptions] = useState<CustomerSubscriptionDetail[]>([]);
  const [bookings, setBookings] = useState<CustomerBookingDetail[]>([]);
  const [attendance, setAttendance] = useState<CustomerAttendanceDetail[]>([]);
  const [payments, setPayments] = useState<CustomerPaymentDetail[]>([]);
  const [pointCards, setPointCards] = useState<CustomerPointCardDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('profile');
  const [impersonating, setImpersonating] = useState(false);
  const [showImpersonateConfirm, setShowImpersonateConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [cust, subs, bks, att, pmts, cards] = await Promise.all([
          fetchAdminCustomer(id),
          fetchCustomerSubscriptions(id),
          fetchCustomerBookings(id, 1, 200),
          fetchCustomerAttendance(id, 1, 200),
          fetchCustomerPayments(id, 1, 200),
          fetchCustomerPointCards(id),
        ]);
        if (cancelled) return;
        setCustomer(cust);
        setSubscriptions(subs);
        setBookings(bks.items ?? bks);
        setAttendance(att.items ?? att);
        setPayments(pmts.items ?? pmts);
        setPointCards(cards);
      } catch {
        // non-fatal
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleImpersonate() {
    if (!customer) return;
    setImpersonating(true);
    try {
      const { user, token } = await impersonateCustomer(customer.id);
      setAuth(user, token);
      navigate('/dashboard');
    } catch {
      // non-fatal
    } finally {
      setImpersonating(false);
      setShowImpersonateConfirm(false);
    }
  }

  if (loading) return <Spinner centered size="lg" />;

  if (!customer) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">{t('adminCustomerDetail.customerNotFound')}</p>
        <Link
          to="/admin/customers"
          className="mt-2 inline-block text-sm text-primary-600 hover:underline"
        >
          {t('adminCustomerDetail.backToCustomers')}
        </Link>
      </div>
    );
  }

  const activeSub = subscriptions.find((s) => s.status === 'active');

  const TABS: { key: Tab; label: string }[] = [
    { key: 'profile', label: t('adminCustomerDetail.tabs.profile') },
    { key: 'subscriptions', label: t('adminCustomerDetail.tabs.subscriptions') },
    { key: 'bookings', label: t('adminCustomerDetail.tabs.bookings') },
    { key: 'attendance', label: t('adminCustomerDetail.tabs.attendance') },
    { key: 'payments', label: t('adminCustomerDetail.tabs.payments') },
  ];

  return (
    <>
      <SEO
        title={customer.firstName + ' ' + customer.lastName}
        description={t('seo.adminCustomersDescription')}
      />

      <div className="mb-6">
        <Link to="/admin/customers" className="text-sm text-primary-600 hover:underline">
          {t('adminCustomerDetail.backToCustomers')}
        </Link>
      </div>

      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
            {customer.firstName[0]}
            {customer.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-gray-500">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge color={customer.emailVerifiedAt ? 'green' : 'gray'}>
            {customer.emailVerifiedAt
              ? t('adminCustomerDetail.verified')
              : t('adminCustomerDetail.unverified')}
          </Badge>
          {activeSub && <Badge color="green">{t('adminCustomerDetail.activeSubscription')}</Badge>}
          <Button onClick={() => setShowImpersonateConfirm(true)} loading={impersonating}>
            {t('adminCustomerDetail.impersonate')}
          </Button>
        </div>
      </div>

      {pointCards.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {pointCards.map((pc) => (
            <Badge key={pc.id} color="warm">
              {t('adminCustomerDetail.sessionsLeft', {
                planName: pc.planName,
                count: pc.sessionsRemaining,
              })}
            </Badge>
          ))}
        </div>
      )}

      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {TABS.map((tItem) => (
          <button
            key={tItem.key}
            onClick={() => setTab(tItem.key)}
            className={
              'px-4 py-2 text-sm font-medium transition-colors ' +
              (tab === tItem.key
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-gray-500 hover:text-gray-700')
            }
          >
            {tItem.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              {t('adminCustomerDetail.contact')}
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-700">{t('adminCustomerDetail.email')}</span>{' '}
                {customer.email}
              </p>
              <p>
                <span className="font-medium text-gray-700">{t('adminCustomerDetail.phone')}</span>{' '}
                {customer.phone ?? '\u2014'}
              </p>
            </div>
          </Card>
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              {t('adminCustomerDetail.account')}
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-700">
                  {t('adminCustomerDetail.memberSince')}
                </span>{' '}
                {formatDate(customer.createdAt)}
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  {t('adminCustomerDetail.emailVerified')}
                </span>{' '}
                {customer.emailVerifiedAt ? formatDate(customer.emailVerifiedAt) : 'No'}
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  {t('adminCustomerDetail.bookings')}
                </span>{' '}
                {bookings.length}
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  {t('adminCustomerDetail.paymentsCount')}
                </span>{' '}
                {payments.length}
              </p>
            </div>
          </Card>
        </div>
      )}

      {tab === 'subscriptions' && (
        <Card>
          {subscriptions.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              {t('adminCustomerDetail.noSubscriptions')}
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{s.planName}</p>
                    <p className="text-xs text-gray-500">
                      {t('common.started')} {formatDate(s.startDate)}
                      {s.endDate
                        ? ' \u00B7 ' + t('common.renews') + ' ' + formatDate(s.endDate)
                        : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {s.sessionsUsed}
                      {s.sessionsLimit ? ' / ' + s.sessionsLimit : ''} sessions
                    </span>
                    <Badge
                      color={
                        s.status === 'active'
                          ? 'green'
                          : s.status === 'cancelled'
                            ? 'accent'
                            : 'gray'
                      }
                    >
                      {s.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === 'bookings' && (
        <Card>
          {bookings.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              {t('adminCustomerDetail.noBookings')}
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: b.classColor }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{b.className}</p>
                      <p className="text-xs text-gray-500">{b.date}</p>
                    </div>
                  </div>
                  <Badge
                    color={
                      b.status === 'confirmed'
                        ? 'green'
                        : b.status === 'attended'
                          ? 'blue'
                          : b.status === 'cancelled'
                            ? 'accent'
                            : 'gray'
                    }
                  >
                    {b.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === 'attendance' && (
        <Card>
          {attendance.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              {t('adminCustomerDetail.noAttendance')}
            </div>
          ) : (
            <div className="space-y-2">
              {attendance.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{a.date}</p>
                    <p className="text-xs text-gray-500">
                      {t('adminAttendance.checkInLabel') || 'Check-in: ' + a.checkInTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === 'payments' && (
        <Card>
          {payments.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              {t('adminCustomerDetail.noPayments')}
            </div>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{p.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(p.createdAt)} {'\u00B7'} {p.provider}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(p.amountCents)}
                    </span>
                    <Badge
                      color={
                        p.status === 'succeeded'
                          ? 'green'
                          : p.status === 'refunded'
                            ? 'warm'
                            : p.status === 'failed'
                              ? 'accent'
                              : 'gray'
                      }
                    >
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Modal
        open={showImpersonateConfirm}
        onClose={() => setShowImpersonateConfirm(false)}
        title={t('adminCustomerDetail.impersonateTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600">
          {t('adminCustomerDetail.impersonateBody', {
            firstName: customer.firstName,
            lastName: customer.lastName,
          })}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowImpersonateConfirm(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleImpersonate} loading={impersonating}>
            {t('adminCustomerDetail.impersonate')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
