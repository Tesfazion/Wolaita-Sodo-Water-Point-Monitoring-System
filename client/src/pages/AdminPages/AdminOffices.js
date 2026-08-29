import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import AsyncState from '../../components/common/AsyncState';
import { Inbox, Phone } from '../../components/common/Icons';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../../utils/apiError';

const AdminOffices = () => {
  const { t } = useTranslation();
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOffices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getOffices();
      setOffices(res.data.data);
    } catch (e) {
      setError(getErrorMessage(e, t('admin.officesLoadError')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchOffices(); }, [fetchOffices]);

  return (
    <AdminLayout>
      <div className="admin-page-header animate-fade-in-up">
        <h1>{t('admin.officesTitle')}</h1>
        <p>{t('admin.officesDesc')}</p>
      </div>

      <AsyncState
        loading={loading}
        error={error}
        onRetry={fetchOffices}
        empty={offices.length === 0 ? t('admin.noOffices') : null}
        emptyIcon={<Inbox size={48} />}
      >
        <div className="table-wrap animate-fade-in-up delay-2">
          <div className="table-scroll">
            <table style={{ minWidth: 850 }}>
              <thead>
                <tr>
                  <th>{t('admin.tableName')}</th>
                  <th>{t('admin.officeType')}</th>
                  <th>{t('admin.woreda')}</th>
                  <th>{t('admin.tableLocation')}</th>
                  <th>{t('admin.contactPerson')}</th>
                  <th>{t('admin.tableReports')}</th>
                </tr>
              </thead>
              <tbody>
                {offices.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 500 }}>{o.name}</td>
                    <td><span className="badge badge-blue">{o.type}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{o.jurisdiction_name || '-'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{o.address}</td>
                    <td>
                      <div>{o.contact_person}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Phone size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />{o.phone}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, textAlign: 'center' }}>{o.total_reports || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AsyncState>
    </AdminLayout>
  );
};

export default AdminOffices;
