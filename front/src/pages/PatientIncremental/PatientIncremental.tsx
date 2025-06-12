import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Table, Button, Row, Col, Typography, message, InputNumber, Tooltip, Card } from 'antd';
import { Download, CheckCircle, Upload } from 'lucide-react';
import TheHeader from '../Header/Header'; // Adjust path as needed
import axios from 'axios'; // Ajout d'axios pour les appels API
import axiosInstance from '../../axiosConfig'; // Assurez-vous que cette instance gère le JWT

const { Content } = Layout;
const { Title: AntTitle, Text } = Typography;

// Données initiales basées sur les images fournies
const initialSegmentData = [
  {
    key: '1',
    metric: '% of total patients',
    NEURO: 20.00,
    PSY: 50.00,
    PED: 30.00,
  },
  {
    key: '2',
    metric: 'Ave revenue per Rx (in MAD)',
    NEURO: 0.00,
    PSY: 0.00,
    PED: 0.00,
  },
  {
    key: '3',
    metric: 'Ave treatment days per Rx',
    NEURO: 0.0,
    PSY: 0.0,
    PED: 0.0,
  },
  {
    key: '4',
    metric: '% Rxs that actually get filled',
    NEURO: 0.0,
    PSY: 0.0,
    PED: 0.0,
  },
];

// Données initiales pour le nouveau tableau
const initialPatientStayData = [
  { key: '1', metric: '0', NEURO: 100, PSY: 100, PED: 100, Average: null },
  { key: '2', metric: '3', NEURO: null, PSY: null, PED: null, Average: null },
  { key: '3', metric: '6', NEURO: null, PSY: null, PED: null, Average: null },
  { key: '4', metric: '9', NEURO: null, PSY: null, PED: null, Average: null },
  { key: '5', metric: '12', NEURO: null, PSY: null, PED: null, Average: null },
  { key: '6', metric: '24', NEURO: null, PSY: null, PED: null, Average: null },
  { key: '7', metric: '36', NEURO: null, PSY: null, PED: null, Average: null },
  { key: '8', metric: '48', NEURO: null, PSY: null, PED: null, Average: null },
  { key: '9', metric: '60', NEURO: null, PSY: null, PED: null, Average: null },
];

// Calcul des moyennes ou validation
const calculateAveragesOrValidation = (segmentData: any[], metric: string) => {
  if (metric === 'metric') return null;
  const row = segmentData.find((item) => item.metric === metric);
  if (!row) return null;

  const values = [row.NEURO, row.PSY, row.PED].filter((val) => val !== undefined && val !== null);
  if (metric === '% of total patients') {
    const sum = values.reduce((acc: number, val: number) => acc + val, 0);
    return sum === 100 ? '✅' : '❌';
  }
  const avg = values.reduce((acc: number, val: number) => acc + val, 0) / 3;
  return avg.toFixed(2);
};

// Fonction pour calculer Ave days per patient stay
const calculateAveDaysPerPatientStay = (data: any[], column: string) => {
  if (!data || data.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (!data[i] || !data[i + 1]) continue;
    const currentValue = data[i][column] !== null && data[i][column] !== undefined ? data[i][column] / 100 : 0;
    const nextValue = data[i + 1][column] !== null && data[i + 1][column] !== undefined ? data[i + 1][column] / 100 : 0;
    const midpoint = (parseFloat(data[i].metric) + parseFloat(data[i + 1].metric)) / 2;
    sum += midpoint * (currentValue - nextValue);
  }
  const lastIndex = data.length - 1;
  const lastValue = data[lastIndex] && data[lastIndex][column] !== null && data[lastIndex][column] !== undefined ? data[lastIndex][column] / 100 : 0;
  const lastMidpoint = (parseFloat(data[lastIndex]?.metric || '60') + 66) / 2;
  sum += lastMidpoint * (lastValue - 0);
  return sum * (365 / 12);
};

const segmentColumns = (data: any, handleInputChange: any) => [
  {
    title: 'Metric',
    dataIndex: 'metric',
    key: 'metric',
    fixed: 'left' as const,
    width: 200,
  },
  {
    title: 'NEURO',
    dataIndex: 'NEURO',
    key: 'NEURO',
    render: (value: number | null, record: any, index: number) => (
      <InputNumber
        min={0}
        max={record.metric.includes('%') ? 100 : undefined}
        value={value}
        addonAfter={record.metric.includes('%') ? '%' : null}
        onChange={(newValue) => handleInputChange('segment', index, 'NEURO', newValue)}
        style={{ width: '100%', backgroundColor: '#fffbe6' }}
      />
    ),
  },
  {
    title: 'PSY',
    dataIndex: 'PSY',
    key: 'PSY',
    render: (value: number | null, record: any, index: number) => (
      <InputNumber
        min={0}
        max={record.metric.includes('%') ? 100 : undefined}
        value={value}
        addonAfter={record.metric.includes('%') ? '%' : null}
        onChange={(newValue) => handleInputChange('segment', index, 'PSY', newValue)}
        style={{ width: '100%', backgroundColor: '#fffbe6' }}
      />
    ),
  },
  {
    title: 'PED',
    dataIndex: 'PED',
    key: 'PED',
    render: (value: number | null, record: any, index: number) => (
      <InputNumber
        min={0}
        max={record.metric.includes('%') ? 100 : undefined}
        value={value}
        addonAfter={record.metric.includes('%') ? '%' : null}
        onChange={(newValue) => handleInputChange('segment', index, 'PED', newValue)}
        style={{ width: '100%', backgroundColor: '#fffbe6' }}
      />
    ),
  },
  {
    title: 'Average',
    dataIndex: 'Average',
    key: 'Average',
    render: (_: any, record: any) => (
      <InputNumber
        value={calculateAveragesOrValidation(data.segment, record.metric)}
        disabled={true}
        addonAfter={record.metric.includes('%') && record.metric !== '% of total patients' ? '%' : null}
        style={{ width: '100%', backgroundColor: '#f0f0f0' }}
      />
    ),
  },
];

const PatientIncremental: React.FC = () => {
  const [data, setData] = useState({
    segment: [],
    patientStay: [],
  });
  const [vpiResult, setVpiResult] = useState<number | null>(null);
  const [inputErrors, setInputErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const patientStayColumns = useCallback(
    (handleInputChange: any) => [
      {
        title: '% of Patients',
        dataIndex: 'metric',
        key: 'metric',
        fixed: 'left' as const,
        width: 150,
      },
      {
        title: 'NEURO',
        dataIndex: 'NEURO',
        key: 'NEURO',
        render: (value: number | null, record: any, index: number) => {
          const isFirstRow = index === 0;
          return (
            <div>
              <InputNumber
                min={0}
                max={100}
                value={value}
                addonAfter={'%'}
                disabled={isFirstRow}
                onChange={(newValue) => handleInputChange('patientStay', index, 'NEURO', newValue)}
                style={{ width: '100%', backgroundColor: isFirstRow ? '#f0f0f0' : '#fffbe6' }}
              />
              {inputErrors[index]?.NEURO && (
                <Text type="danger" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Must be ≤ {inputErrors[index].NEURO}%
                </Text>
              )}
            </div>
          );
        },
      },
      {
        title: 'PSY',
        dataIndex: 'PSY',
        key: 'PSY',
        render: (value: number | null, record: any, index: number) => {
          const isFirstRow = index === 0;
          return (
            <div>
              <InputNumber
                min={0}
                max={100}
                value={value}
                addonAfter={'%'}
                disabled={isFirstRow}
                onChange={(newValue) => handleInputChange('patientStay', index, 'PSY', newValue)}
                style={{ width: '100%', backgroundColor: isFirstRow ? '#f0f0f0' : '#fffbe6' }}
              />
              {inputErrors[index]?.PSY && (
                <Text type="danger" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Must be ≤ {inputErrors[index].PSY}%
                </Text>
              )}
            </div>
          );
        },
      },
      {
        title: 'PED',
        dataIndex: 'PED',
        key: 'PED',
        render: (value: number | null, record: any, index: number) => {
          const isFirstRow = index === 0;
          return (
            <div>
              <InputNumber
                min={0}
                max={100}
                value={value}
                addonAfter={'%'}
                disabled={isFirstRow}
                onChange={(newValue) => handleInputChange('patientStay', index, 'PED', newValue)}
                style={{ width: '100%', backgroundColor: isFirstRow ? '#f0f0f0' : '#fffbe6' }}
              />
              {inputErrors[index]?.PED && (
                <Text type="danger" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Must be ≤ {inputErrors[index].PED}%
                </Text>
              )}
            </div>
          );
        },
      },
      {
        title: 'Average',
        dataIndex: 'Average',
        key: 'Average',
        render: (_: any, record: any, index: number) => {
          const patientSegmentRow = data.segment.find((item) => item.metric === '% of total patients');
          if (!patientSegmentRow) return <InputNumber value={null} disabled={true} addonAfter={'%'} style={{ width: '100%', backgroundColor: '#f0f0f0' }} />;

          const neuroWeight = patientSegmentRow.NEURO / 100 || 0;
          const psyWeight = patientSegmentRow.PSY / 100 || 0;
          const pedWeight = patientSegmentRow.PED / 100 || 0;

          const avg = (record.NEURO || 0) * neuroWeight + (record.PSY || 0) * psyWeight + (record.PED || 0) * pedWeight;
          return (
            <InputNumber
              value={avg !== null ? avg.toFixed(2) : null}
              disabled={true}
              addonAfter={'%'}
              style={{ width: '100%', backgroundColor: '#f0f0f0' }}
            />
          );
        },
      },
    ],
    [inputErrors, data],
  );

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData({
        segment: [...initialSegmentData],
        patientStay: [...initialPatientStayData],
      });
      setLoading(false);
    }, 1000);
  }, []);

  // Fonction pour gérer les changements dans les inputs
  const handleInputChange = (
    tableType: string,
    index: number,
    field: string,
    value: number | null,
  ) => {
    setData((prevData) => {
      const newData = { ...prevData };
      const dataArray = [...newData[tableType]];
      const prevValue = index > 0 ? dataArray[index - 1][field] : null;

      if (tableType === 'patientStay' && index > 0 && value !== null && prevValue !== null && value > prevValue) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          [index]: { ...prevErrors[index], [field]: prevValue },
        }));
        return prevData;
      } else {
        setInputErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          if (newErrors[index]?.[field]) {
            const { [field]: _, ...rest } = newErrors[index] || {};
            newErrors[index] = Object.keys(rest).length > 0 ? rest : null;
            if (!newErrors[index]) delete newErrors[index];
          }
          return newErrors;
        });

        dataArray[index] = { ...dataArray[index], [field]: value !== null && value !== undefined ? value : null };

        newData[tableType] = dataArray;
        return newData;
      }
    });
  };

  // Fonction pour calculer l'Average Ave days per patient stay
  const calculateAverageAveDaysPerPatientStay = () => {
    const patientSegmentRow = data.segment.find((item) => item.metric === '% of total patients');
    if (!patientSegmentRow || !data.patientStay || data.patientStay.length === 0) return null;

    const neuroWeight = patientSegmentRow.NEURO / 100 || 0;
    const psyWeight = patientSegmentRow.PSY / 100 || 0;
    const pedWeight = patientSegmentRow.PED / 100 || 0;

    const neuroAveDays = calculateAveDaysPerPatientStay(data.patientStay, 'NEURO');
    const psyAveDays = calculateAveDaysPerPatientStay(data.patientStay, 'PSY');
    const pedAveDays = calculateAveDaysPerPatientStay(data.patientStay, 'PED');

    const avg = neuroAveDays * neuroWeight + psyAveDays * psyWeight + pedAveDays * pedWeight;
    return avg.toFixed(2);
  };

  // Fonction pour calculer VPI
  const calculateVPI = () => {
    const revenueRow = data.segment.find((item) => item.metric === 'Ave revenue per Rx (in MAD)');
    const daysRow = data.segment.find((item) => item.metric === 'Ave treatment days per Rx');
    const aveDaysPerPatientStay = calculateAverageAveDaysPerPatientStay();

    if (!revenueRow || !daysRow || !aveDaysPerPatientStay) {
      message.error('Veuillez remplir toutes les données nécessaires');
      return;
    }

    const avgRevenue = calculateAveragesOrValidation(data.segment, 'Ave revenue per Rx (in MAD)');
    const avgDays = calculateAveragesOrValidation(data.segment, 'Ave treatment days per Rx');

    if (avgDays === '0.00' || isNaN(parseFloat(avgDays))) {
      message.error('La durée moyenne de traitement ne peut pas être zéro');
      return;
    }

    const vpi = (parseFloat(avgRevenue) / parseFloat(avgDays)) * parseFloat(aveDaysPerPatientStay);
    setVpiResult(vpi);
    message.success(`Valeur Patient Incrémentée (VPI) : ${vpi.toFixed(2)} MAD`);
  };

  // Fonction pour envoyer la VPI au backend
  const updateVPIOnServer = async () => {
    if (!vpiResult) {
      message.error('Aucune valeur VPI à mettre à jour. Calculez d\'abord la VPI.');
      return;
    }

    try {
      const laboId = 1; // Remplacez par la logique pour obtenir le laboId (par ex. via JWT ou contexte)
      await axiosInstance.post('UpdateVPI', { vpiResult, laboId });
      message.success('Valeur Patient Incrémentée mise à jour sur le serveur avec succès');
    } catch (error) {
      message.error('Erreur lors de la mise à jour de la VPI sur le serveur');
      console.error(error);
    }
  };

  // Fonction pour exporter en PDF
  const handleExportPDF = () => {
    message.loading('Génération du PDF en cours...', 1);
    setTimeout(() => {
      message.success('PDF généré avec succès ! (Simulation)');
    }, 1000);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <TheHeader />
      <Content style={{ margin: '16px', background: '#fff', padding: '24px', borderRadius: '8px' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <AntTitle level={3}>Calculateur de ROI - Prexige 2025</AntTitle>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Download size={16} style={{ marginRight: 8 }} />}
              onClick={handleExportPDF}
            >
              Exporter en PDF
            </Button>
          </Col>
        </Row>

        {/* Tableau : Patient Segment */}
        <Table
          columns={segmentColumns(data, handleInputChange)}
          dataSource={data.segment}
          loading={loading}
          pagination={false}
          bordered
          scroll={{ x: 600 }}
          style={{ marginBottom: '24px', borderRadius: '8px' }}
          rowClassName={() => 'ant-table-row-hover'}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}></Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        {/* Nouveau tableau : Patient Stay */}
        <Table
          columns={patientStayColumns(handleInputChange)}
          dataSource={data.patientStay}
          loading={loading}
          pagination={false}
          bordered
          scroll={{ x: 600 }}
          style={{ marginBottom: '24px', borderRadius: '8px' }}
          rowClassName={() => 'ant-table-row-hover'}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Ave days per patient stay</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <InputNumber
                  value={calculateAveDaysPerPatientStay(data.patientStay, 'NEURO').toFixed(2)}
                  disabled={true}
                  addonAfter={'days'}
                  style={{ width: '100%', backgroundColor: '#f0f0f0' }}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <InputNumber
                  value={calculateAveDaysPerPatientStay(data.patientStay, 'PSY').toFixed(2)}
                  disabled={true}
                  addonAfter={'days'}
                  style={{ width: '100%', backgroundColor: '#f0f0f0' }}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <InputNumber
                  value={calculateAveDaysPerPatientStay(data.patientStay, 'PED').toFixed(2)}
                  disabled={true}
                  addonAfter={'days'}
                  style={{ width: '100%', backgroundColor: '#f0f0f0' }}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <InputNumber
                  value={calculateAverageAveDaysPerPatientStay()}
                  disabled={true}
                  addonAfter={'days'}
                  style={{ width: '100%', backgroundColor: '#f0f0f0' }}
                />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        {/* Boutons Calculer VPI et Mettre à jour */}
        <Row style={{ marginBottom: '16px' }} gutter={16}>
          <Col>
            <Tooltip title="Valeur patient incrémentée">
              <Button type="primary" onClick={calculateVPI}>
                Calculer VPI
              </Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Mettre à jour la VPI sur le serveur">
              <Button type="primary" icon={<Upload size={16} style={{ marginRight: 8 }} />} onClick={updateVPIOnServer} disabled={!vpiResult}>
                Mettre à jour VPI
              </Button>
            </Tooltip>
          </Col>
        </Row>

        {/* Affichage du résultat VPI */}
        {vpiResult !== null && (
          <Row>
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  marginBottom: '16px',
                }}
                hoverable
              >
                <Row align="middle">
                  <Col>
                    <CheckCircle size={24} color="#52c41a" style={{ marginRight: '8px' }} />
                  </Col>
                  <Col>
                    <Text strong style={{ fontSize: '16px' }}>
                      Valeur Patient Incrémentée (VPI)
                    </Text>
                    <AntTitle level={4} style={{ margin: '8px 0 0 0', color: '#1890ff' }}>
                      {vpiResult.toFixed(2)} MAD
                    </AntTitle>
                  </Col>
                </Row>
              </Card>
              <InputNumber
                value={vpiResult}
                disabled={true}
                style={{ display: 'none' }}
              />
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default PatientIncremental;