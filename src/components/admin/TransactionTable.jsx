import { useState, useEffect, useMemo, useCallback } from 'react';
import { FaDownload } from 'react-icons/fa6';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [emailFilter, setEmailFilter] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, 'transacciones'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTransactions(list);
      } catch (err) {
        console.error('Error al cargar transacciones:', err);
        setError('Error al cargar las transacciones. Verificá la conexión con Firebase.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Filtro por estado
      if (statusFilter && tx.status !== statusFilter) return false;

      // Filtro por email
      if (emailFilter && tx.userEmail) {
        if (!tx.userEmail.toLowerCase().includes(emailFilter.toLowerCase())) return false;
      }

      // Filtro por rango de fechas
      if (startDate && tx.createdAt?.toDate) {
        const txDate = tx.createdAt.toDate();
        const start = new Date(startDate + 'T00:00:00');
        if (txDate < start) return false;
      }
      if (endDate && tx.createdAt?.toDate) {
        const txDate = tx.createdAt.toDate();
        const end = new Date(endDate + 'T23:59:59.999');
        if (txDate > end) return false;
      }

      return true;
    });
  }, [transactions, statusFilter, startDate, endDate, emailFilter]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '-';
    const date = timestamp.toDate();
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatea fecha para CSV (ISO sin hora)
  const formatDateCSV = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toISOString().split('T')[0];
  };

  // Exportar transacciones filtradas a CSV
  const exportCSV = useCallback(() => {
    const headers = ['ID', 'Email', 'Total', 'Estado', 'Cant. Items', 'Fecha'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.userEmail || '',
      tx.total?.toFixed(2) ?? '',
      tx.status,
      tx.items?.length ?? 0,
      formatDateCSV(tx.createdAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transacciones-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredTransactions]);

  // Estado de carga
  if (loading) {
    return (
      <div className="text-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Error al cargar
  if (error) {
    return (
      <div className="alert alert-error mb-4">
        <span>{error}</span>
        <button className="btn btn-ghost btn-xs" onClick={() => setError(null)}>✕</button>
      </div>
    );
  }

  return (
    <>
      {/* Barra de filtros */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-end">
        <div className="form-control w-full sm:w-1/4">
          <label className="label">
            <span className="label-text">Estado</span>
          </label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="select select-bordered w-full"
            aria-label="Filtrar por estado"
          >
            <option value="">Todas</option>
            <option value="completada">Completada</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>
        <div className="form-control w-full sm:w-1/4">
          <label className="label">
            <span className="label-text">Fecha inicio</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            placeholder="Fecha inicio"
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full sm:w-1/4">
          <label className="label">
            <span className="label-text">Fecha fin</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            placeholder="Fecha fin"
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full sm:w-1/4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="search"
            value={emailFilter}
            onChange={e => setEmailFilter(e.target.value)}
            placeholder="Buscar por email..."
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* Botón de exportar CSV */}
      {filteredTransactions.length > 0 && (
        <div className="text-end mb-4">
          <button className="btn btn-success btn-sm" onClick={exportCSV}>
            <FaDownload className="me-1" />Exportar CSV
          </button>
        </div>
      )}

      {/* Contenido de la tabla */}
      {transactions.length === 0 ? (
        <div className="alert alert-info">No hay transacciones</div>
      ) : filteredTransactions.length === 0 ? (
        <div className="alert alert-info">No se encontraron transacciones con los filtros seleccionados</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra table-pin-rows">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Items</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id}>
                  <td className="font-mono text-sm">
                    {tx.id.substring(0, 8)}...
                  </td>
                  <td>{tx.userEmail || '-'}</td>
                  <td>${tx.total?.toFixed(2) ?? '-'}</td>
                  <td>
                    <span className={`badge ${tx.status === 'completada' ? 'badge-success' : 'badge-warning'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td>{tx.items?.length ?? 0}</td>
                  <td>{formatDate(tx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default TransactionTable;