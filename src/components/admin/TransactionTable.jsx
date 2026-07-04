import { useState, useEffect, useMemo } from 'react';
import { Table, Spinner, Alert, Form, Row, Col, Button } from 'react-bootstrap';
import { DownloadIcon } from '../../assets/icons';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Funciones de formateo de fecha (sin dependencias del componente)
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

const formatDateCSV = (timestamp) => {
  if (!timestamp?.toDate) return '';
  return timestamp.toDate().toISOString().split('T')[0];
};

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

  // Exportar transacciones filtradas a CSV
  const exportCSV = () => {
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
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando transacciones...</span>
        </Spinner>
      </div>
    );
  }

  // Error al cargar
  if (error) {
    return (
      <Alert variant="danger" dismissible onClose={() => setError(null)} className="mt-3">
        {error}
      </Alert>
    );
  }

  return (
    <>
      {/* Barra de filtros */}
      <Row className="mb-3 g-2">
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="">Todas</option>
            <option value="completada">Completada</option>
            <option value="pendiente">Pendiente</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            placeholder="Fecha inicio"
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            placeholder="Fecha fin"
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="search"
            value={emailFilter}
            onChange={e => setEmailFilter(e.target.value)}
            placeholder="Buscar por email..."
          />
        </Col>
      </Row>

      {/* Botón de exportar CSV */}
      {filteredTransactions.length > 0 && (
        <div className="text-end mb-2">
          <Button variant="success" size="sm" onClick={exportCSV}>
            <DownloadIcon size={16} className="me-1" />Exportar CSV
          </Button>
        </div>
      )}

      {/* Contenido de la tabla */}
      {transactions.length === 0 ? (
        <Alert variant="info">No hay transacciones</Alert>
      ) : filteredTransactions.length === 0 ? (
        <Alert variant="info">No se encontraron transacciones con los filtros seleccionados</Alert>
      ) : (
        <Table striped bordered hover responsive>
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
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {tx.id.substring(0, 8)}...
                </td>
                <td>{tx.userEmail || '-'}</td>
                <td>${tx.total?.toFixed(2) ?? '-'}</td>
                <td>{tx.status}</td>
                <td>{tx.items?.length ?? 0}</td>
                <td>{formatDate(tx.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TransactionTable;
