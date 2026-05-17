import { useState, useCallback } from 'react';
import type {
  CustomerReportRow,
  AttendanceReportRow,
  SubscriptionReport,
  OccupancyReportRow,
  RevenueReportRow,
} from '@/api/admin';
import {
  fetchCustomerReport,
  fetchAttendanceReportAdmin,
  fetchSubscriptionReport,
  fetchOccupancyReport,
  fetchRevenueReport,
  exportReportCsv,
  exportReportPdf,
} from '@/api/admin';

interface UseReportsResult {
  data: {
    customerReport: CustomerReportRow[] | null;
    attendanceReport: AttendanceReportRow[] | null;
    subscriptionReport: SubscriptionReport | null;
    occupancyReport: OccupancyReportRow[] | null;
    revenueReport: RevenueReportRow[] | null;
  } | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  customerReport: CustomerReportRow[] | null;
  attendanceReport: AttendanceReportRow[] | null;
  subscriptionReport: SubscriptionReport | null;
  occupancyReport: OccupancyReportRow[] | null;
  revenueReport: RevenueReportRow[] | null;
  getCustomerReport: (params?: { from?: string; to?: string }) => Promise<void>;
  getAttendanceReport: (params: { from: string; to: string }) => Promise<void>;
  getSubscriptionReport: () => Promise<void>;
  getOccupancyReport: (params?: { from?: string; to?: string }) => Promise<void>;
  getRevenueReport: () => Promise<void>;
  exportCsv: (reportType: string, params?: Record<string, string>) => Promise<string | null>;
  exportPdf: (reportType: string, params?: Record<string, string>) => Promise<string | null>;
  exporting: boolean;
}

export function useReports(): UseReportsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerReport, setCustomerReport] = useState<CustomerReportRow[] | null>(null);
  const [attendanceReport, setAttendanceReport] = useState<AttendanceReportRow[] | null>(null);
  const [subscriptionReport, setSubscriptionReport] = useState<SubscriptionReport | null>(null);
  const [occupancyReport, setOccupancyReport] = useState<OccupancyReportRow[] | null>(null);
  const [revenueReport, setRevenueReport] = useState<RevenueReportRow[] | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleError = useCallback((e: unknown) => {
    setError(e instanceof Error ? e.message : 'An error occurred');
  }, []);

  const getCustomerReport = useCallback(
    async (params?: { from?: string; to?: string }) => {
      setLoading(true);
      setError(null);
      try {
        setCustomerReport(await fetchCustomerReport(params ?? {}));
      } catch (e) {
        handleError(e);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const getAttendanceReport = useCallback(
    async (params: { from: string; to: string }) => {
      setLoading(true);
      setError(null);
      try {
        setAttendanceReport(await fetchAttendanceReportAdmin(params));
      } catch (e) {
        handleError(e);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const getSubscriptionReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSubscriptionReport(await fetchSubscriptionReport());
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getOccupancyReport = useCallback(
    async (params?: { from?: string; to?: string }) => {
      setLoading(true);
      setError(null);
      try {
        setOccupancyReport(await fetchOccupancyReport(params ?? {}));
      } catch (e) {
        handleError(e);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const getRevenueReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRevenueReport(await fetchRevenueReport());
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const exportCsv = useCallback(
    async (reportType: string, params?: Record<string, string>) => {
      setExporting(true);
      try {
        return await exportReportCsv(reportType, params);
      } catch (e) {
        handleError(e);
        return null;
      } finally {
        setExporting(false);
      }
    },
    [handleError],
  );

  const exportPdf = useCallback(
    async (reportType: string, params?: Record<string, string>) => {
      setExporting(true);
      try {
        return await exportReportPdf(reportType, params);
      } catch (e) {
        handleError(e);
        return null;
      } finally {
        setExporting(false);
      }
    },
    [handleError],
  );

  return {
    data: { customerReport, attendanceReport, subscriptionReport, occupancyReport, revenueReport },
    loading,
    error,
    refetch: getCustomerReport,
    customerReport,
    attendanceReport,
    subscriptionReport,
    occupancyReport,
    revenueReport,
    getCustomerReport,
    getAttendanceReport,
    getSubscriptionReport,
    getOccupancyReport,
    getRevenueReport,
    exportCsv,
    exportPdf,
    exporting,
  };
}
