import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Table,
  Button,
  Row,
  Col,
  Typography,
  message,
  InputNumber,
  Tooltip,
  Card,
  Input,
  Popover,
} from "antd";
import { Download, CheckCircle, Upload, HelpCircle } from "lucide-react";
import TheHeader from "../Header/Header";
import axios from "axios";
import axiosInstance from "../../axiosConfig";

const { Content } = Layout;
const { Title: AntTitle, Text } = Typography;

// Données initiales
const initialSegmentData = [
  {
    key: "1",
    metric: "% du total des patients",
    SEGMENT1: 20.0,
    SEGMENT2: 50.0,
    SEGMENT3: 30.0,
  },
  {
    key: "2",
    metric: "Revenu moyen par ordonnance (en MAD)",
    SEGMENT1: 0.0,
    SEGMENT2: 0.0,
    SEGMENT3: 0.0,
  },
  {
    key: "3",
    metric: "Jours moyens de traitement par ordonnance",
    SEGMENT1: 0.0,
    SEGMENT2: 0.0,
    SEGMENT3: 0.0,
  },
  {
    key: "4",
    metric: "% des ordonnances réellement délivrées",
    SEGMENT1: 0.0,
    SEGMENT2: 0.0,
    SEGMENT3: 0.0,
  },
];

const initialPatientStayData = [
  {
    key: "1",
    metric: "0",
    SEGMENT1: 100,
    SEGMENT2: 100,
    SEGMENT3: 100,
    Average: null,
  },
  {
    key: "2",
    metric: "3",
    SEGMENT1: null,
    SEGMENT2: null,
    SEGMENT3: null,
    Average: null,
  },
  {
    key: "3",
    metric: "6",
    SEGMENT1: null,
    SEGMENT2: null,
    SEGMENT3: null,
    Average: null,
  },
  {
    key: "4",
    metric: "9",
    SEGMENT1: null,
    SEGMENT2: null,
    SEGMENT3: null,
    Average: null,
  },
  {
    key: "5",
    metric: "12",
    SEGMENT1: null,
    SEGMENT2: null,
    SEGMENT3: null,
    Average: null,
  },
  {
    key: "6",
    metric: "24",
    SEGMENT1: null,
    SEGMENT2: null,
    SEGMENT3: null,
    Average: null,
  },
  {
    key: "7",
    metric: "36",
    SEGMENT1: null,
    SEGMENT2: null,
    SEGMENT3: null,
    Average: null,
  },
  {
    key: "8",
    metric: "48",
    SEGMENT1: null,
    SEGMENT2: null,
    SEGMENT3: null,
    Average: null,
  },
  {
    key: "9",
    metric: "60",
    SEGMENT1: null,
    SEGMENT2: null,
    SEGMENT3: null,
    Average: null,
  },
];

const calculateAveragesOrValidation = (segmentData: any[], metric: string) => {
  if (metric === "metric") return null;
  const row = segmentData.find((item) => item.metric === metric);
  if (!row) return null;

  const values = [row.SEGMENT1, row.SEGMENT2, row.SEGMENT3].filter(
    (val) => val !== undefined && val !== null
  );
  if (metric === "% du total des patients") {
    const sum = values.reduce((acc: number, val: number) => acc + val, 0);
    return sum === 100 ? "✅" : "❌";
  }
  const avg = values.reduce((acc: number, val: number) => acc + val, 0) / 3;
  return avg.toFixed(2);
};

const calculateAveDaysPerPatientStay = (data: any[], column: string) => {
  if (!data || data.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (!data[i] || !data[i + 1]) continue;
    const currentValue =
      data[i][column] !== null && data[i][column] !== undefined
        ? data[i][column] / 100
        : 0;
    const nextValue =
      data[i + 1][column] !== null && data[i + 1][column] !== undefined
        ? data[i + 1][column] / 100
        : 0;
    const midpoint =
      (parseFloat(data[i].metric) + parseFloat(data[i + 1].metric)) / 2;
    sum += midpoint * (currentValue - nextValue);
  }
  const lastIndex = data.length - 1;
  const lastValue =
    data[lastIndex] &&
    data[lastIndex][column] !== null &&
    data[lastIndex][column] !== undefined
      ? data[lastIndex][column] / 100
      : 0;
  const lastMidpoint = (parseFloat(data[lastIndex]?.metric || "60") + 66) / 2;
  sum += lastMidpoint * (lastValue - 0);
  return sum * (365 / 12);
};

// const segmentColumns = (data: any, handleInputChange: any) => [
//   {
//     title: <Text strong>Métrique</Text>,
//     dataIndex: 'metric',
//     key: 'metric',
//     fixed: 'left' as const,
//     width: 250,
//     render: (text: string) => <Text strong>{text}</Text>,
//   },
//   {
//     title: (
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <Text strong>Segment 1</Text>
//         <Input
//           placeholder="Optionnel"
//           style={{ width: '100%', marginTop: '8px' }}
//         />
//       </div>
//     ),
//     dataIndex: 'SEGMENT1',
//     key: 'SEGMENT1',
//     render: (value: number | null, record: any, index: number) => (
//       <InputNumber
//         min={0}
//         max={record.metric.includes('%') ? 100 : undefined}
//         value={value}
//         addonAfter={record.metric.includes('%') ? '%' : null}
//         onChange={(newValue) => handleInputChange('segment', index, 'SEGMENT1', newValue)}
//         style={{ width: '100%', backgroundColor: '#fffbe6' }}
//       />
//     ),
//   },
//   {
//     title: (
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <Text strong>Segment 2</Text>
//         <Input
//           placeholder="Optionnel"
//           style={{ width: '100%', marginTop: '8px' }}
//         />
//       </div>
//     ),
//     dataIndex: 'SEGMENT2',
//     key: 'SEGMENT2',
//     render: (value: number | null, record: any, index: number) => (
//       <InputNumber
//         min={0}
//         max={record.metric.includes('%') ? 100 : undefined}
//         value={value}
//         addonAfter={record.metric.includes('%') ? '%' : null}
//         onChange={(newValue) => handleInputChange('segment', index, 'SEGMENT2', newValue)}
//         style={{ width: '100%', backgroundColor: '#fffbe6' }}
//       />
//     ),
//   },
//   {
//     title: (
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <Text strong>Segment 3</Text>
//         <Input
//           placeholder="Optionnel"
//           style={{ width: '100%', marginTop: '8px' }}
//         />
//       </div>
//     ),
//     dataIndex: 'SEGMENT3',
//     key: 'SEGMENT3',
//     render: (value: number | null, record: any, index: number) => (
//       <InputNumber
//         min={0}
//         max={record.metric.includes('%') ? 100 : undefined}
//         value={value}
//         addonAfter={record.metric.includes('%') ? '%' : null}
//         onChange={(newValue) => handleInputChange('segment', index, 'SEGMENT3', newValue)}
//         style={{ width: '100%', backgroundColor: '#fffbe6' }}
//       />
//     ),
//   },
//   {
//     title: <Text strong>Moyenne</Text>,
//     dataIndex: 'Average',
//     key: 'Average',
//     render: (_: any, record: any) => (
//       <InputNumber
//         value={calculateAveragesOrValidation(data.segment, record.metric)}
//         disabled={true}
//         addonAfter={record.metric.includes('%') && record.metric !== '% du total des patients' ? '%' : null}
//         style={{ width: '100%', backgroundColor: '#f0f0f0' }}
//       />
//     ),
//   },
// ];

const segmentColumns = (data: any, handleInputChange: any) => [
  {
    title: <Text strong>Métrique</Text>,
    dataIndex: "metric",
    key: "metric",
    fixed: "left" as const,
    width: 250,
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text strong>Segment 1</Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
        >
          <Input
            placeholder="Optionnel"
            style={{ flex: 1, marginTop: "8px" }}
          />
          <Tooltip title="Spécialité de médecin">
            <Button
              icon={<HelpCircle size={14} />}
              size="small"
              style={{ marginTop: "8px" }}
              type="text"
            />
          </Tooltip>
        </div>
      </div>
    ),
    dataIndex: "SEGMENT1",
    key: "SEGMENT1",
    render: (value: number | null, record: any, index: number) => (
      <InputNumber
        min={0}
        max={record.metric.includes("%") ? 100 : undefined}
        value={value}
        addonAfter={record.metric.includes("%") ? "%" : null}
        onChange={(newValue) =>
          handleInputChange("segment", index, "SEGMENT1", newValue)
        }
        style={{ width: "100%", backgroundColor: "#fffbe6" }}
      />
    ),
  },
  {
    title: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text strong>Segment 2</Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
        >
          <Input
            placeholder="Optionnel"
            style={{ flex: 1, marginTop: "8px" }}
          />
          <Tooltip title="Spécialité de médecin">
            <Button
              icon={<HelpCircle size={14} />}
              size="small"
              style={{ marginTop: "8px" }}
              type="text"
            />
          </Tooltip>
        </div>
      </div>
    ),
    dataIndex: "SEGMENT2",
    key: "SEGMENT2",
    render: (value: number | null, record: any, index: number) => (
      <InputNumber
        min={0}
        max={record.metric.includes("%") ? 100 : undefined}
        value={value}
        addonAfter={record.metric.includes("%") ? "%" : null}
        onChange={(newValue) =>
          handleInputChange("segment", index, "SEGMENT2", newValue)
        }
        style={{ width: "100%", backgroundColor: "#fffbe6" }}
      />
    ),
  },
  {
    title: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text strong>Segment 3</Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
        >
          <Input
            placeholder="Optionnel"
            style={{ flex: 1, marginTop: "8px" }}
          />
          <Tooltip title="Spécialité de médecin">
            <Button
              icon={<HelpCircle size={14} />}
              size="small"
              style={{ marginTop: "8px" }}
              type="text"
            />
          </Tooltip>
        </div>
      </div>
    ),
    dataIndex: "SEGMENT3",
    key: "SEGMENT3",
    render: (value: number | null, record: any, index: number) => (
      <InputNumber
        min={0}
        max={record.metric.includes("%") ? 100 : undefined}
        value={value}
        addonAfter={record.metric.includes("%") ? "%" : null}
        onChange={(newValue) =>
          handleInputChange("segment", index, "SEGMENT3", newValue)
        }
        style={{ width: "100%", backgroundColor: "#fffbe6" }}
      />
    ),
  },
  {
    title: <Text strong>Moyenne</Text>,
    dataIndex: "Average",
    key: "Average",
    render: (_: any, record: any) => (
      <InputNumber
        value={calculateAveragesOrValidation(data.segment, record.metric)}
        disabled={true}
        addonAfter={
          record.metric.includes("%") &&
          record.metric !== "% du total des patients"
            ? "%"
            : null
        }
        style={{ width: "100%", backgroundColor: "#f0f0f0" }}
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

  // const patientStayColumns = useCallback(
  //   (handleInputChange: any) => [
  //     {
  //       title: <Text strong>% des Patients</Text>,
  //       dataIndex: "metric",
  //       key: "metric",
  //       fixed: "left" as const,
  //       width: 150,
  //       render: (text: string) => <Text strong>{text}</Text>,
  //     },
  //     {
  //       title: (
  //         <div
  //           style={{
  //             display: "flex",
  //             flexDirection: "column",
  //             alignItems: "center",
  //           }}
  //         >
  //           <Text strong>Segment 1</Text>
  //           <div
  //             style={{
  //               display: "flex",
  //               alignItems: "center",
  //               gap: "8px",
  //               width: "100%",
  //             }}
  //           >
  //             <Input
  //               placeholder="Optionnel"
  //               style={{ flex: 1, marginTop: "8px" }}
  //             />
  //             <Tooltip title="Spécialité de médecin">
  //               <Button
  //                 icon={<HelpCircle size={14} />}
  //                 size="small"
  //                 style={{ marginTop: "8px" }}
  //                 type="text"
  //               />
  //             </Tooltip>
  //           </div>
  //         </div>
  //       ),
  //       dataIndex: "SEGMENT1",
  //       key: "SEGMENT1",
  //       render: (value: number | null, record: any, index: number) => {
  //         const isFirstRow = index === 0;
  //         return (
  //           <div>
  //             <InputNumber
  //               min={0}
  //               max={100}
  //               value={value}
  //               addonAfter={"%"}
  //               disabled={isFirstRow}
  //               onChange={(newValue) =>
  //                 handleInputChange("patientStay", index, "SEGMENT1", newValue)
  //               }
  //               style={{
  //                 width: "100%",
  //                 backgroundColor: isFirstRow ? "#f0f0f0" : "#fffbe6",
  //               }}
  //             />
  //             {inputErrors[index]?.SEGMENT1 && (
  //               <Text
  //                 type="danger"
  //                 style={{
  //                   fontSize: "12px",
  //                   marginTop: "4px",
  //                   display: "block",
  //                 }}
  //               >
  //                 Doit être ≤ {inputErrors[index].SEGMENT1}%
  //               </Text>
  //             )}
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       title: (
  //         <div
  //           style={{
  //             display: "flex",
  //             flexDirection: "column",
  //             alignItems: "center",
  //           }}
  //         >
  //           <Text strong>Segment 2</Text>
  //           <div
  //             style={{
  //               display: "flex",
  //               alignItems: "center",
  //               gap: "8px",
  //               width: "100%",
  //             }}
  //           >
  //             <Input
  //               placeholder="Optionnel"
  //               style={{ flex: 1, marginTop: "8px" }}
  //             />
  //             <Tooltip title="Spécialité de médecin">
  //               <Button
  //                 icon={<HelpCircle size={14} />}
  //                 size="small"
  //                 style={{ marginTop: "8px" }}
  //                 type="text"
  //               />
  //             </Tooltip>
  //           </div>
  //         </div>
  //       ),
  //       dataIndex: "SEGMENT2",
  //       key: "SEGMENT2",
  //       render: (value: number | null, record: any, index: number) => {
  //         const isFirstRow = index === 0;
  //         return (
  //           <div>
  //             <InputNumber
  //               min={0}
  //               max={100}
  //               value={value}
  //               addonAfter={"%"}
  //               disabled={isFirstRow}
  //               onChange={(newValue) =>
  //                 handleInputChange("patientStay", index, "SEGMENT2", newValue)
  //               }
  //               style={{
  //                 width: "100%",
  //                 backgroundColor: isFirstRow ? "#f0f0f0" : "#fffbe6",
  //               }}
  //             />
  //             {inputErrors[index]?.SEGMENT2 && (
  //               <Text
  //                 type="danger"
  //                 style={{
  //                   fontSize: "12px",
  //                   marginTop: "4px",
  //                   display: "block",
  //                 }}
  //               >
  //                 Doit être ≤ {inputErrors[index].SEGMENT2}%
  //               </Text>
  //             )}
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       title: (
  //         <div
  //           style={{
  //             display: "flex",
  //             flexDirection: "column",
  //             alignItems: "center",
  //           }}
  //         >
  //           <Text strong>Segment 3</Text>
  //           <div
  //             style={{
  //               display: "flex",
  //               alignItems: "center",
  //               gap: "8px",
  //               width: "100%",
  //             }}
  //           >
  //             <Input
  //               placeholder="Optionnel"
  //               style={{ flex: 1, marginTop: "8px" }}
  //             />
  //             <Tooltip title="Spécialité de médecin">
  //               <Button
  //                 icon={<HelpCircle size={14} />}
  //                 size="small"
  //                 style={{ marginTop: "8px" }}
  //                 type="text"
  //               />
  //             </Tooltip>
  //           </div>
  //         </div>
  //       ),
  //       dataIndex: "SEGMENT3",
  //       key: "SEGMENT3",
  //       render: (value: number | null, record: any, index: number) => {
  //         const isFirstRow = index === 0;
  //         return (
  //           <div>
  //             <InputNumber
  //               min={0}
  //               max={100}
  //               value={value}
  //               addonAfter={"%"}
  //               disabled={isFirstRow}
  //               onChange={(newValue) =>
  //                 handleInputChange("patientStay", index, "SEGMENT3", newValue)
  //               }
  //               style={{
  //                 width: "100%",
  //                 backgroundColor: isFirstRow ? "#f0f0f0" : "#fffbe6",
  //               }}
  //             />
  //             {inputErrors[index]?.SEGMENT3 && (
  //               <Text
  //                 type="danger"
  //                 style={{
  //                   fontSize: "12px",
  //                   marginTop: "4px",
  //                   display: "block",
  //                 }}
  //               >
  //                 Doit être ≤ {inputErrors[index].SEGMENT3}%
  //               </Text>
  //             )}
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       title: <Text strong>Moyenne</Text>,
  //       dataIndex: "Average",
  //       key: "Average",
  //       render: (_: any, record: any, index: number) => {
  //         const patientSegmentRow = data.segment.find(
  //           (item) => item.metric === "% du total des patients"
  //         );
  //         if (!patientSegmentRow)
  //           return (
  //             <InputNumber
  //               value={null}
  //               disabled={true}
  //               addonAfter={"%"}
  //               style={{ width: "100%", backgroundColor: "#f0f0f0" }}
  //             />
  //           );

  //         const segment1Weight = patientSegmentRow.SEGMENT1 / 100 || 0;
  //         const segment2Weight = patientSegmentRow.SEGMENT2 / 100 || 0;
  //         const segment3Weight = patientSegmentRow.SEGMENT3 / 100 || 0;

  //         const avg =
  //           (record.SEGMENT1 || 0) * segment1Weight +
  //           (record.SEGMENT2 || 0) * segment2Weight +
  //           (record.SEGMENT3 || 0) * segment3Weight;
  //         return (
  //           <InputNumber
  //             value={avg !== null ? avg.toFixed(2) : null}
  //             disabled={true}
  //             addonAfter={"%"}
  //             style={{ width: "100%", backgroundColor: "#f0f0f0" }}
  //           />
  //         );
  //       },
  //     },
  //   ],
  //   [inputErrors, data]
  // );

  const patientStayColumns = useCallback(
    (handleInputChange: any) => [
      {
        title: (
          <div style={{ textAlign: "center" }}>
            <Text strong>% des Patients</Text>
          </div>
        ),
        dataIndex: "metric",
        key: "metric",
        fixed: "left" as const,
        width: 150,
        render: (text: string) => (
          <div style={{ textAlign: "center" }}>
            <Text strong>{text}</Text>
          </div>
        ),
      },
      {
        title: (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text strong>Segment 1</Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
            >
              <Input
                placeholder="Optionnel"
                style={{ flex: 1, marginTop: "8px" }}
              />
              <Tooltip title="Spécialité de médecin">
                <Button
                  icon={<HelpCircle size={14} />}
                  size="small"
                  style={{ marginTop: "8px" }}
                  type="text"
                />
              </Tooltip>
            </div>
          </div>
        ),
        dataIndex: "SEGMENT1",
        key: "SEGMENT1",
        render: (value: number | null, record: any, index: number) => {
          const isFirstRow = index === 0;
          return (
            <div style={{ textAlign: "center" }}>
              <InputNumber
                min={0}
                max={100}
                value={value}
                addonAfter={"%"}
                disabled={isFirstRow}
                onChange={(newValue) =>
                  handleInputChange("patientStay", index, "SEGMENT1", newValue)
                }
                style={{
                  width: "100%",
                  backgroundColor: isFirstRow ? "#f0f0f0" : "#fffbe6",
                }}
              />
              {inputErrors[index]?.SEGMENT1 && (
                <Text
                  type="danger"
                  style={{
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  Doit être ≤ {inputErrors[index].SEGMENT1}%
                </Text>
              )}
            </div>
          );
        },
      },
      {
        title: (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text strong>Segment 2</Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
            >
              <Input
                placeholder="Optionnel"
                style={{ flex: 1, marginTop: "8px" }}
              />
              <Tooltip title="Spécialité de médecin">
                <Button
                  icon={<HelpCircle size={14} />}
                  size="small"
                  style={{ marginTop: "8px" }}
                  type="text"
                />
              </Tooltip>
            </div>
          </div>
        ),
        dataIndex: "SEGMENT2",
        key: "SEGMENT2",
        render: (value: number | null, record: any, index: number) => {
          const isFirstRow = index === 0;
          return (
            <div style={{ textAlign: "center" }}>
              <InputNumber
                min={0}
                max={100}
                value={value}
                addonAfter={"%"}
                disabled={isFirstRow}
                onChange={(newValue) =>
                  handleInputChange("patientStay", index, "SEGMENT2", newValue)
                }
                style={{
                  width: "100%",
                  backgroundColor: isFirstRow ? "#f0f0f0" : "#fffbe6",
                }}
              />
              {inputErrors[index]?.SEGMENT2 && (
                <Text
                  type="danger"
                  style={{
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  Doit être ≤ {inputErrors[index].SEGMENT2}%
                </Text>
              )}
            </div>
          );
        },
      },
      {
        title: (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text strong>Segment 3</Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
            >
              <Input
                placeholder="Optionnel"
                style={{ flex: 1, marginTop: "8px" }}
              />
              <Tooltip title="Spécialité de médecin">
                <Button
                  icon={<HelpCircle size={14} />}
                  size="small"
                  style={{ marginTop: "8px" }}
                  type="text"
                />
              </Tooltip>
            </div>
          </div>
        ),
        dataIndex: "SEGMENT3",
        key: "SEGMENT3",
        render: (value: number | null, record: any, index: number) => {
          const isFirstRow = index === 0;
          return (
            <div style={{ textAlign: "center" }}>
              <InputNumber
                min={0}
                max={100}
                value={value}
                addonAfter={"%"}
                disabled={isFirstRow}
                onChange={(newValue) =>
                  handleInputChange("patientStay", index, "SEGMENT3", newValue)
                }
                style={{
                  width: "100%",
                  backgroundColor: isFirstRow ? "#f0f0f0" : "#fffbe6",
                }}
              />
              {inputErrors[index]?.SEGMENT3 && (
                <Text
                  type="danger"
                  style={{
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  Doit être ≤ {inputErrors[index].SEGMENT3}%
                </Text>
              )}
            </div>
          );
        },
      },
      {
        title: (
          <div style={{ textAlign: "center" }}>
            <Text strong>Moyenne</Text>
          </div>
        ),
        dataIndex: "Average",
        key: "Average",
        render: (_: any, record: any, index: number) => {
          const patientSegmentRow = data.segment.find(
            (item) => item.metric === "% du total des patients"
          );
          if (!patientSegmentRow)
            return (
              <div style={{ textAlign: "center" }}>
                <InputNumber
                  value={null}
                  disabled={true}
                  addonAfter={"%"}
                  style={{ width: "100%", backgroundColor: "#f0f0f0" }}
                />
              </div>
            );

          const segment1Weight = patientSegmentRow.SEGMENT1 / 100 || 0;
          const segment2Weight = patientSegmentRow.SEGMENT2 / 100 || 0;
          const segment3Weight = patientSegmentRow.SEGMENT3 / 100 || 0;

          const avg =
            (record.SEGMENT1 || 0) * segment1Weight +
            (record.SEGMENT2 || 0) * segment2Weight +
            (record.SEGMENT3 || 0) * segment3Weight;
          return (
            <div style={{ textAlign: "center" }}>
              <InputNumber
                value={avg !== null ? avg.toFixed(2) : null}
                disabled={true}
                addonAfter={"%"}
                style={{ width: "100%", backgroundColor: "#f0f0f0" }}
              />
            </div>
          );
        },
      },
    ],
    [inputErrors, data]
  );

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

  const handleInputChange = (
    tableType: string,
    index: number,
    field: string,
    value: number | null
  ) => {
    setData((prevData) => {
      const newData = { ...prevData };
      const dataArray = [...newData[tableType]];
      const prevValue = index > 0 ? dataArray[index - 1][field] : null;

      if (
        tableType === "patientStay" &&
        index > 0 &&
        value !== null &&
        prevValue !== null &&
        value > prevValue
      ) {
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

        dataArray[index] = {
          ...dataArray[index],
          [field]: value !== null && value !== undefined ? value : null,
        };

        newData[tableType] = dataArray;
        return newData;
      }
    });
  };

  const calculateAverageAveDaysPerPatientStay = () => {
    const patientSegmentRow = data.segment.find(
      (item) => item.metric === "% du total des patients"
    );
    if (
      !patientSegmentRow ||
      !data.patientStay ||
      data.patientStay.length === 0
    )
      return null;

    const segment1Weight = patientSegmentRow.SEGMENT1 / 100 || 0;
    const segment2Weight = patientSegmentRow.SEGMENT2 / 100 || 0;
    const segment3Weight = patientSegmentRow.SEGMENT3 / 100 || 0;

    const segment1AveDays = calculateAveDaysPerPatientStay(
      data.patientStay,
      "SEGMENT1"
    );
    const segment2AveDays = calculateAveDaysPerPatientStay(
      data.patientStay,
      "SEGMENT2"
    );
    const segment3AveDays = calculateAveDaysPerPatientStay(
      data.patientStay,
      "SEGMENT3"
    );

    const avg =
      segment1AveDays * segment1Weight +
      segment2AveDays * segment2Weight +
      segment3AveDays * segment3Weight;
    return avg.toFixed(2);
  };

  const calculateVPI = () => {
    const revenueRow = data.segment.find(
      (item) => item.metric === "Revenu moyen par ordonnance (en MAD)"
    );
    const daysRow = data.segment.find(
      (item) => item.metric === "Jours moyens de traitement par ordonnance"
    );
    const aveDaysPerPatientStay = calculateAverageAveDaysPerPatientStay();

    if (!revenueRow || !daysRow || !aveDaysPerPatientStay) {
      message.error("Veuillez remplir toutes les données nécessaires");
      return;
    }

    const avgRevenue = calculateAveragesOrValidation(
      data.segment,
      "Revenu moyen par ordonnance (en MAD)"
    );
    const avgDays = calculateAveragesOrValidation(
      data.segment,
      "Jours moyens de traitement par ordonnance"
    );

    if (avgDays === "0.00" || isNaN(parseFloat(avgDays))) {
      message.error("La durée moyenne de traitement ne peut pas être zéro");
      return;
    }

    const vpi =
      (parseFloat(avgRevenue) / parseFloat(avgDays)) *
      parseFloat(aveDaysPerPatientStay);
    setVpiResult(vpi);
    message.success(`Valeur Patient Incrémentée (VPI) : ${vpi.toFixed(2)} MAD`);
  };

  const updateVPIOnServer = async () => {
    if (!vpiResult) {
      message.error(
        "Aucune valeur VPI à mettre à jour. Calculez d'abord la VPI."
      );
      return;
    }

    try {
      const laboId = 1;
      await axiosInstance.post("UpdateVPI", { vpiResult, laboId });
      message.success(
        "Valeur Patient Incrémentée mise à jour sur le serveur avec succès"
      );
    } catch (error) {
      message.error("Erreur lors de la mise à jour de la VPI sur le serveur");
      console.error(error);
    }
  };

  const handleExportPDF = () => {
    message.loading("Génération du PDF en cours...", 1);
    setTimeout(() => {
      message.success("PDF généré avec succès ! (Simulation)");
    }, 1000);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <TheHeader />
      <Content
        style={{
          margin: "16px",
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "16px" }}
        >
          <Col>
            <AntTitle level={3} style={{ fontWeight: "bold" }}>
              Calculateur de la Valeur Patient Incrémenté
            </AntTitle>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Download size={16} style={{ marginRight: 8 }} />}
              onClick={handleExportPDF}
              style={{ fontWeight: "bold" }}
            >
              Exporter en PDF
            </Button>
          </Col>
        </Row>

        <Table
          columns={segmentColumns(data, handleInputChange)}
          dataSource={data.segment}
          loading={loading}
          pagination={false}
          bordered
          scroll={{ x: 800 }}
          style={{ marginBottom: "24px", borderRadius: "8px" }}
          rowClassName={() => "ant-table-row-hover"}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <Text strong>Total</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}></Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        <Table
          columns={patientStayColumns(handleInputChange)}
          dataSource={data.patientStay}
          loading={loading}
          pagination={false}
          bordered
          scroll={{ x: 800 }}
          style={{ marginBottom: "24px", borderRadius: "8px" }}
          rowClassName={() => "ant-table-row-hover"}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <Text strong>Jours moyens par séjour patient</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <InputNumber
                  value={calculateAveDaysPerPatientStay(
                    data.patientStay,
                    "SEGMENT1"
                  ).toFixed(2)}
                  disabled={true}
                  addonAfter={"jours"}
                  style={{ width: "100%", backgroundColor: "#f0f0f0" }}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <InputNumber
                  value={calculateAveDaysPerPatientStay(
                    data.patientStay,
                    "SEGMENT2"
                  ).toFixed(2)}
                  disabled={true}
                  addonAfter={"jours"}
                  style={{ width: "100%", backgroundColor: "#f0f0f0" }}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <InputNumber
                  value={calculateAveDaysPerPatientStay(
                    data.patientStay,
                    "SEGMENT3"
                  ).toFixed(2)}
                  disabled={true}
                  addonAfter={"jours"}
                  style={{ width: "100%", backgroundColor: "#f0f0f0" }}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <InputNumber
                  value={calculateAverageAveDaysPerPatientStay()}
                  disabled={true}
                  addonAfter={"jours"}
                  style={{ width: "100%", backgroundColor: "#f0f0f0" }}
                />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        <Row style={{ marginBottom: "16px" }} gutter={16}>
          <Col>
            <Tooltip title="Calculer la Valeur Patient Incrémentée">
              <Button
                type="primary"
                onClick={calculateVPI}
                style={{ fontWeight: "bold" }}
              >
                Calculer VPI
              </Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Mettre à jour la VPI sur le serveur">
              <Button
                type="primary"
                icon={<Upload size={16} style={{ marginRight: 8 }} />}
                onClick={updateVPIOnServer}
                disabled={!vpiResult}
                style={{ fontWeight: "bold" }}
              >
                Mettre à jour VPI
              </Button>
            </Tooltip>
          </Col>
        </Row>

        {vpiResult !== null && (
          <Row>
            <Col xs={24} sm={12} md={8}>
              <Card
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s ease-in-out",
                  marginBottom: "16px",
                }}
                hoverable
              >
                <Row align="middle">
                  <Col>
                    <CheckCircle
                      size={24}
                      color="#52c41a"
                      style={{ marginRight: "8px" }}
                    />
                  </Col>
                  <Col>
                    <Text strong style={{ fontSize: "16px" }}>
                      Valeur Patient Incrémentée (VPI)
                    </Text>
                    <AntTitle
                      level={4}
                      style={{
                        margin: "8px 0 0 0",
                        color: "#1890ff",
                        fontWeight: "bold",
                      }}
                    >
                      {vpiResult.toFixed(2)} MAD
                    </AntTitle>
                  </Col>
                </Row>
              </Card>
              <InputNumber
                value={vpiResult}
                disabled={true}
                style={{ display: "none" }}
              />
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default PatientIncremental;
