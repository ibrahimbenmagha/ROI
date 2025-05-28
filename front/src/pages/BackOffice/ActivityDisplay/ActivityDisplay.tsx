
// import React, { useState, useEffect } from 'react';
// import { Space, Table, Tag, Button, Modal } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import axiosInstance from '../../../axiosConfig'; // Assurez-vous que le chemin est correct
// import { useNavigate } from 'react-router-dom';

// // Interfaces pour typer les données
// interface ActivityItem {
//   id: number;
//   Name: string;
//   symbole: string | null;
//   Type: 'percentage' | 'number';
//   created_at: string | null;
//   updated_at: string | null;
// }

// interface Formula {
//   id: number;
//   formulat: { [key: string]: string };
//   created_at: string | null;
//   updated_at: string | null;
// }

// interface Activity {
//   activity: {
//     id: number;
//     name: string;
//     is_custom: boolean;
//     created_at: string | null;
//     updated_at: string | null;
//   };
//   items: ActivityItem[];
//   formula: Formula | null;
// }

// interface DataType {
//   key: string;
//   name: string;
//   is_custom: boolean;
//   items: ActivityItem[];
//   formula: Formula | null;
//   showItemsModal: () => void;
//   showFormulaModal: () => void;
// }

// // Colonnes pour le tableau des items dans la modale
// const itemColumns = [
//   {
//     title: "Nom de l'item",
//     dataIndex: 'Name',
//     key: 'Name',
//     render: text => <span>{text}</span>,
//     width: 400,
//   },
//   {
//     title: 'Type',
//     dataIndex: 'Type',
//     key: 'Type',
//     render: text => <span>{text}</span>,
//     width: 150,
//   },
//   {
//     title: 'Symbole',
//     dataIndex: 'symbole',
//     key: 'symbole',
//     render: text => <span>{text || 'N/A'}</span>,
//     width: 150,
//   },
// ];

// // Colonnes pour le tableau des formules dans la modale
// const formulaColumns = [
//   {
//     title: 'Clé',
//     dataIndex: 'key',
//     key: 'key',
//     render: text => <span>{text}</span>,
//     width: 300,
//   },
//   {
//     title: 'Expression',
//     dataIndex: 'expression',
//     key: 'expression',
//     render: text => <span>{text}</span>,
//     width: 400,
//   },
// ];

// // Colonnes pour le tableau principal
// const columns = [
//   {
//     title: "Nom de l'activité",
//     dataIndex: 'name',
//     key: 'name',
//     render: text => <a>{text}</a>,
//     width: 250,
//   },
//   {
//     title: 'Personnalisée',
//     dataIndex: 'is_custom',
//     key: 'is_custom',
//     render: is_custom => (
//       <Tag color={is_custom ? 'blue' : 'green'}>
//         {is_custom ? 'Oui' : 'Non'}
//       </Tag>
//     ),
//     width: 150,
//   },
//   {
//     title: 'Items',
//     dataIndex: 'items',
//     key: 'items',
//     render: (items, record) => (
//       <Button
//         type="link"
//         onClick={record.showItemsModal}
//       >
//         Afficher les items ({items.length})
//       </Button>
//     ),
//     width: 200,
//   },
//   {
//     title: 'Formule de calcul',
//     dataIndex: 'formula',
//     key: 'formula',
//     render: (formula, record) => (
//       formula ? (
//         <Button
//           type="link"
//           onClick={record.showFormulaModal}
//         >
//           Afficher formule
//         </Button>
//       ) : (
//         <span>Aucune formule</span>
//       )
//     ),
//     width: 200,
//   },
//   {
//     title: 'Action',
//     key: 'action',
//     render: (_, record) => (
//       <Space size="middle">
//         <a>Voir détails</a>
//       </Space>
//     ),
//     width: 150,
//   },
// ];

// const ActivityDisplay = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isItemsModalVisible, setIsItemsModalVisible] = useState(false);
//   const [isFormulaModalVisible, setIsFormulaModalVisible] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedFormula, setSelectedFormula] = useState([]);
//   const navigate = useNavigate();

//   // Récupération des données
//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const response = await axiosInstance.get('/getAllActivitiesInfo');
//         console.log('Données reçues:', response.data); // Débogage
//         if (response.data.success) {
//           const formattedData = response.data.data.map((activity) => ({
//             key: activity.activity.id.toString(),
//             name: activity.activity.name,
//             is_custom: activity.activity.is_custom,
//             items: activity.items,
//             formula: activity.formula,
//             showItemsModal: () => {
//               setSelectedItems(activity.items);
//               setIsItemsModalVisible(true);
//             },
//             showFormulaModal: () => {
//               if (activity.formula) {
//                 const formulaData = Object.entries(activity.formula.formulat).map(([key, expression]) => ({
//                   key,
//                   expression,
//                 }));
//                 setSelectedFormula(formulaData);
//                 setIsFormulaModalVisible(true);
//               }
//             },
//           }));
//           setData(formattedData);
//         } else {
//           setError(response.data.message || 'Échec du chargement des activités');
//         }
//       } catch (err) {
//         console.error('Erreur lors de la récupération des activités:', err);
//         setError(err.response?.data?.message || 'Erreur lors de la récupération des activités');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActivities();
//   }, []);

//   // Gestion des modales
//   const handleItemsModalOk = () => {
//     setIsItemsModalVisible(false);
//     setSelectedItems([]);
//   };

//   const handleItemsModalCancel = () => {
//     setIsItemsModalVisible(false);
//     setSelectedItems([]);
//   };

//   const handleFormulaModalOk = () => {
//     setIsFormulaModalVisible(false);
//     setSelectedFormula([]);
//   };

//   const handleFormulaModalCancel = () => {
//     setIsFormulaModalVisible(false);
//     setSelectedFormula([]);
//   };

//   const handleCreateLabo = () => {
//     navigate("../AddActivity");
//   };

//   return (
//     <div style={{ padding: '16px' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//         <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
//           Liste des activités
//         </h1>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           size="large"
//           onClick={handleCreateLabo}
//         >
//           Créer Activité
//         </Button>
//       </div>
//       {error && (
//         <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '4px', marginBottom: '16px' }}>
//           <p style={{ color: '#dc2626' }}>{error}</p>
//         </div>
//       )}
//       <Table
//         columns={columns}
//         dataSource={data}
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//         scroll={{ x: true }}
//       />
//       {/* Modale pour les items */}
//       <Modal
//         title="Détails des items"
//         open={isItemsModalVisible}
//         onOk={handleItemsModalOk}
//         onCancel={handleItemsModalCancel}
//         width={800}
//         footer={[
//           <Button key="close" onClick={handleItemsModalCancel}>
//             Fermer
//           </Button>,
//         ]}
//       >
//         <Table
//           columns={itemColumns}
//           dataSource={selectedItems}
//           pagination={false}
//           rowKey="id"
//           scroll={{ x: 'max-content' }}
//         />
//       </Modal>
//       {/* Modale pour les formules */}
//       <Modal
//         title="Détails de la formule"
//         open={isFormulaModalVisible}
//         onOk={handleFormulaModalOk}
//         onCancel={handleFormulaModalCancel}
//         width={800}
//         footer={[
//           <Button key="close" onClick={handleFormulaModalCancel}>
//             Fermer
//           </Button>,
//         ]}
//       >
//         <Table
//           columns={formulaColumns}
//           dataSource={selectedFormula}
//           pagination={false}
//           rowKey="key"
//           scroll={{ x: 'max-content' }}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default ActivityDisplay;


import React, { useState, useEffect } from 'react';
import { Space, Table, Tag, Button, Modal, Form, Input, Select, message, Spin } from 'antd';
import { PlusOutlined, SaveOutlined, CalculatorOutlined, ReloadOutlined, DeleteOutlined, CloseCircleOutlined, NumberOutlined } from '@ant-design/icons';
import axiosInstance from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';

// Interfaces pour typer les données
interface ActivityItem {
  id: number;
  Name: string;
  symbole: string | null;
  Type: 'percentage' | 'number';
  created_at: string | null;
  updated_at: string | null;
}

interface Formula {
  id: number;
  formulat: { [key: string]: string };
  created_at: string | null;
  updated_at: string | null;
}

interface Activity {
  activity: {
    id: number;
    name: string;
    is_custom: boolean;
    description?: string;
    created_at: string | null;
    updated_at: string | null;
  };
  items: ActivityItem[];
  formula: Formula | null;
}

interface DataType {
  key: string;
  name: string;
  is_custom: boolean;
  description?: string;
  items: ActivityItem[];
  formula: Formula | null;
  showItemsModal: () => void;
  showFormulaModal: () => void;
  showEditModal: () => void;
}

// Available symbols (A-Z, excluding ROI)
const AVAILABLE_SYMBOLS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).filter(s => s !== 'ROI');

// Colonnes pour le tableau des items
const itemColumns = [
  {
    title: "Nom de l'item",
    dataIndex: 'Name',
    key: 'Name',
    render: (text: string) => <span>{text}</span>,
    width: 400,
  },
  {
    title: 'Type',
    dataIndex: 'Type',
    key: 'Type',
    render: (text: string) => <span>{text}</span>,
    width: 150,
  },
  {
    title: 'Symbole',
    dataIndex: 'symbole',
    key: 'symbole',
    render: (text: string | null) => <span>{text || 'N/A'}</span>,
    width: 150,
  },
];

// Colonnes pour le tableau des formules
const formulaColumns = [
  {
    title: 'Clé',
    dataIndex: 'key',
    key: 'key',
    render: (text: string) => <span>{text}</span>,
    width: 300,
  },
  {
    title: 'Expression',
    dataIndex: 'expression',
    key: 'expression',
    render: (text: string) => <span>{text}</span>,
    width: 400,
  },
];

// Colonnes pour le tableau principal
const columns = [
  {
    title: "Nom de l'activité",
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a>{text}</a>,
    width: 250,
  },
  {
    title: 'Personnalisée',
    dataIndex: 'is_custom',
    key: 'is_custom',
    render: (is_custom: boolean) => (
      <Tag color={is_custom ? 'blue' : 'green'}>
        {is_custom ? 'Oui' : 'Non'}
      </Tag>
    ),
    width: 150,
  },
  {
    title: 'Items',
    dataIndex: 'items',
    key: 'items',
    render: (items: ActivityItem[], record: DataType) => (
      <Button
        type="link"
        onClick={record.showItemsModal}
      >
        Afficher les items ({items.length})
      </Button>
    ),
    width: 200,
  },
  {
    title: 'Formule de calcul',
    dataIndex: 'formula',
    key: 'formula',
    render: (formula: Formula | null, record: DataType) => (
      formula ? (
        <Button
          type="link"
          onClick={record.showFormulaModal}
        >
          Afficher formule
        </Button>
      ) : (
        <span>Aucune formule</span>
      )
    ),
    width: 200,
  },
  {
    title: 'Action',
    key: 'action',
    render: (_: any, record: DataType) => (
      <Space size="middle">
        <Button type="link" onClick={record.showEditModal}>
          Editer
        </Button>
      </Space>
    ),
    width: 150,
  },
];

// Composant pour la modale d'édition
const EditActivityModal: React.FC<{
  visible: boolean;
  onCancel: () => void;
  activity: DataType | null;
  onSave: () => void;
}> = ({ visible, onCancel, activity, onSave }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<{ id: string; name: string; symbol: string; type: 'number' | 'percentage' }[]>([]);
  const [formulat, setFormulat] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [isCalculatorModalVisible, setIsCalculatorModalVisible] = useState(false);
  const [newFormulaKey, setNewFormulaKey] = useState('');
  const [newFormulaExpression, setNewFormulaExpression] = useState<{ type: string; value: string | number }[]>([]);
  const [description, setDescription] = useState('');

  // Initialiser les données du formulaire
  useEffect(() => {
    if (activity) {
      console.log('Activité sélectionnée:', activity);
      const formattedItems = activity.items
        .filter(item => item.symbole !== 'ROI') // Exclure l'item ROI géré par le backend
        .map(item => ({
          id: `item-${item.id}`,
          name: item.Name,
          symbol: item.symbole || '',
          type: item.Type as 'number' | 'percentage',
        }));
      setItems(formattedItems);
      setFormulat(activity.formula ? { ...activity.formula.formulat } : {});
      setDescription(activity.description || '');
      form.setFieldsValue({
        activityName: activity.name,
        description: activity.description,
      });
    }
  }, [activity, form]);

  // Normaliser le nom des items
  const normalizeItemName = (name: string) => {
    if (name && typeof name === 'string' && /coût\s*total/i.test(name)) {
      return 'i';
    }
    return name;
  };

  // Obtenir les symboles disponibles
  const getAvailableSymbols = (currentItemId: string) => {
    const usedSymbols = items
      .filter(item => item.id !== currentItemId && item.symbol)
      .map(item => item.symbol);
    return AVAILABLE_SYMBOLS.filter(symbol => !usedSymbols.includes(symbol));
  };

  // Ajouter un nouvel item
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        name: '',
        symbol: '',
        type: 'number' as 'number' | 'percentage',
      },
    ]);
  };

  // Supprimer un item
  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    const updatedFormulat = { ...formulat };
    const deletedItem = items.find(item => item.id === id);
    if (deletedItem?.symbol) {
      Object.keys(updatedFormulat).forEach(key => {
        if (updatedFormulat[key].split(' ').includes(deletedItem.symbol)) {
          delete updatedFormulat[key];
        }
      });
      setFormulat(updatedFormulat);
    }
  };

  // Mettre à jour un item
  const handleItemChange = (id: string, field: string, value: any) => {
    if (field === 'symbol') {
      const usedSymbols = items
        .filter(item => item.id !== id)
        .map(item => item.symbol);
      if (usedSymbols.includes(value) || value === 'ROI') {
        message.error(value === 'ROI' ? 'Le symbole "ROI" est réservé.' : 'Ce symbole est déjà utilisé.');
        return;
      }
    }
    setItems(
      items.map(item =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'name' ? normalizeItemName(value) : value,
            }
          : item
      )
    );
  };

  // Valider le formulaire
  const isFormValid = () => {
    const activityName = form.getFieldValue('activityName');
    if (!activityName?.trim()) return false;
    return (
      items.length > 0 &&
      items.every(
        item =>
          item.name.trim() &&
          item.symbol?.trim() &&
          ['number', 'percentage'].includes(item.type)
      ) &&
      Object.keys(formulat).length > 0 &&
      Object.keys(formulat).includes('roi')
    );
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await form.validateFields();
      if (!isFormValid()) {
        message.error('Veuillez remplir tous les champs et définir une formule nommée "roi".');
        return;
      }

      const payload = {
        name: form.getFieldValue('activityName'),
        description: form.getFieldValue('description') || undefined,
        items: items.map(item => ({
          name: normalizeItemName(item.name),
          symbole: item.symbol,
          Type: item.type,
        })),
        formula: formulat,
      };

      console.log('Payload envoyé:', JSON.stringify(payload, null, 2));

      const response = await axiosInstance.put(`/activity/${activity?.key}`, payload);
      message.success(response.data.message || 'Activité mise à jour avec succès');
      onSave();
      onCancel();
    } catch (error) {
      if (error.response) {
        console.error('Erreur serveur:', error.response.data);
        const errorMessages = error.response.data.messages
          ? Object.values(error.response.data.messages).join(' ')
          : error.response.data.message || 'Erreur lors de la mise à jour';
        message.error(errorMessages);
      } else {
        console.error('Erreur réseau:', error);
        message.error('Erreur de communication avec le serveur.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    form.resetFields();
    setItems([]);
    setFormulat({});
    setNewFormulaKey('');
    setNewFormulaExpression([]);
    setDescription('');
  };

  // Ouvrir la modale de calculatrice
  const openCalculatorModal = () => {
    if (items.length === 0 || items.some(item => !item.name || !item.symbol)) {
      message.error('Veuillez remplir tous les champs des items avant de définir des formules.');
      return;
    }
    setNewFormulaKey('');
    setNewFormulaExpression([]);
    setIsCalculatorModalVisible(true);
  };

  // Ajouter un élément à l'expression de la formule
  const addExpressionElement = (type: string, value: string | number) => {
    const canAddItemOrConstant =
      newFormulaExpression.length === 0 ||
      newFormulaExpression[newFormulaExpression.length - 1].type === 'operator';
    const canAddOperator =
      newFormulaExpression.length > 0 &&
      (newFormulaExpression[newFormulaExpression.length - 1].type === 'item' ||
        newFormulaExpression[newFormulaExpression.length - 1].type === 'constant' ||
        newFormulaExpression[newFormulaExpression.length - 1].type === 'formula');

    if ((type === 'item' || type === 'constant' || type === 'formula') && !canAddItemOrConstant) {
      message.error('Veuillez ajouter un opérateur avant d’ajouter un autre élément.');
      return;
    }
    if (type === 'operator' && !canAddOperator) {
      message.error('Veuillez ajouter un élément avant d’ajouter un opérateur.');
      return;
    }

    setNewFormulaExpression([...newFormulaExpression, { type, value }]);
  };

  // Supprimer le dernier élément de l'expression
  const removeLastExpressionElement = () => {
    if (newFormulaExpression.length === 0) return;
    const newExpression = [...newFormulaExpression];
    newExpression.pop();
    setNewFormulaExpression(newExpression);
  };

  // Ajouter une nouvelle formule
  const handleAddFormula = () => {
    if (!newFormulaKey.trim() || newFormulaExpression.length < 3) {
      message.error('Veuillez saisir un nom de formule valide et une expression d’au moins trois éléments.');
      return;
    }
    if (newFormulaExpression[newFormulaExpression.length - 1].type === 'operator') {
      message.error('L’expression ne peut pas se terminer par un opérateur.');
      return;
    }
    if (formulat[newFormulaKey]) {
      message.error('Ce nom de formule existe déjà. Choisissez un nom unique.');
      return;
    }

    const expressionStr = newFormulaExpression
      .map(elem => {
        if (elem.type === 'item' || elem.type === 'constant' || elem.type === 'formula') {
          return elem.value;
        } else if (elem.type === 'operator') {
          switch (elem.value) {
            case 'add':
              return '+';
            case 'subtract':
              return '-';
            case 'multiply':
              return '*';
            case 'divide':
              return '/';
            default:
              return '';
          }
        }
        return '';
      })
      .filter(part => part)
      .join(' ');

    if (!expressionStr) {
      message.error('Erreur lors de la construction de l’expression.');
      return;
    }

    const formulaKey = newFormulaKey.toLowerCase().includes('roi') ? 'roi' : newFormulaKey;
    setFormulat({
      ...formulat,
      [formulaKey]: expressionStr,
    });
    setNewFormulaKey('');
    setNewFormulaExpression([]);
    message.success('Formule ajoutée avec succès.');
  };

  // Parser l'expression pour l'affichage
  const parseExpression = (expressionStr: string) => {
    const parts = expressionStr.split(' ').filter(part => part);
    return parts.map(part => {
      if (items.some(i => i.symbol === part)) return { type: 'item', value: part };
      if (Object.keys(formulat).includes(part)) return { type: 'formula', value: part };
      if (!isNaN(Number(part))) return { type: 'constant', value: parseFloat(part) };
      if (['+', '-', '*', '/'].includes(part))
        return {
          type: 'operator',
          value: part === '+' ? 'add' : part === '-' ? 'subtract' : part === '*' ? 'multiply' : 'divide',
        };
      return { type: 'unknown', value: part };
    });
  };

  // Obtenir le nom de l'item par symbole
  const getItemNameBySymbole = (symbol: string) => {
    const item = items.find(i => i.symbol === symbol);
    return item ? item.name : 'Item inconnu';
  };

  // Obtenir le symbole d'opération
  const getOperationSymbol = (operation: string) => {
    switch (operation) {
      case 'add':
        return '+';
      case 'subtract':
        return '-';
      case 'multiply':
        return '×';
      case 'divide':
        return '÷';
      default:
        return '?';
    }
  };

  // Rendre l'expression sous forme de tags
  const renderExpression = (expression: { type: string; value: string | number }[]) => {
    return expression.map((elem, index) => {
      if (elem.type === 'item') {
        return (
          <Tag key={index} color="blue">
            {elem.value}
          </Tag>
        );
      } else if (elem.type === 'constant') {
        return (
          <Tag key={index} color="purple">
            {elem.value}
          </Tag>
        );
      } else if (elem.type === 'formula') {
        return (
          <Tag key={index} color="green">
            {elem.value}
          </Tag>
        );
      } else if (elem.type === 'operator') {
        return (
          <Tag key={index} color="orange">
            {getOperationSymbol(elem.value as string)}
          </Tag>
        );
      }
      return null;
    });
  };

  // Obtenir les options pour l'expression de la formule
  const getAllElementsForSelection = () => {
    const itemOptions = items.map(item => ({
      value: item.symbol,
      label: `${item.name} (${item.symbol})`,
      type: 'item',
    }));
    const formulaOptions = Object.keys(formulat).map(key => ({
      value: key,
      label: `Formule: ${key}`,
      type: 'formula',
    }));
    return [...itemOptions, ...formulaOptions, { value: 'ROI', label: 'ROI (Résultat)', type: 'item' }];
  };

  return (
    <Modal
      title="Éditer l'activité"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="activityName"
          label="Nom de l'activité"
          rules={[
            { required: true, message: 'Veuillez entrer le nom de l’activité' },
            { max: 255, message: 'Le nom ne doit pas dépasser 255 caractères' },
          ]}
        >
          <Input placeholder="Entrez le nom de l’activité" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description (optionnel)"
          rules={[{ max: 65535, message: 'La description ne doit pas dépasser 65535 caractères' }]}
        >
          <Input.TextArea placeholder="Entrez une description" rows={4} />
        </Form.Item>

        <div style={{ marginBottom: 16 }}>
          <strong>Items de base</strong>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Input
                placeholder="Nom de l’item"
                value={item.name}
                onChange={e => handleItemChange(item.id, 'name', e.target.value)}
                style={{ flex: 1 }}
                maxLength={255}
              />
              <Select
                placeholder="Choisissez un symbole"
                value={item.symbol || undefined}
                onChange={value => handleItemChange(item.id, 'symbol', value)}
                style={{ width: 120 }}
              >
                {getAvailableSymbols(item.id).map(symbol => (
                  <Select.Option key={symbol} value={symbol}>
                    {symbol}
                  </Select.Option>
                ))}
              </Select>
              <Select
                value={item.type}
                onChange={value => handleItemChange(item.id, 'type', value)}
                style={{ width: 120 }}
              >
                <Select.Option value="number">Nombre</Select.Option>
                <Select.Option value="percentage">Pourcentage</Select.Option>
              </Select>
              <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveItem(item.id)} />
            </div>
          ))}
          <Button type="primary" onClick={handleAddItem} style={{ marginTop: 8 }}>
            <PlusOutlined /> Ajouter un item
          </Button>
        </div>

        {Object.keys(formulat).length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <strong>Formules définies</strong>
            {Object.entries(formulat).map(([key, expression]) => (
              <div key={key} style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    <strong>{key}</strong> = {renderExpression(parseExpression(expression))}
                  </span>
                  <Button
                    size="small"
                    danger
                    onClick={() => {
                      const newFormulat = { ...formulat };
                      delete newFormulat[key];
                      setFormulat(newFormulat);
                    }}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Button type="primary" onClick={openCalculatorModal} disabled={items.length === 0}>
            <CalculatorOutlined /> Définir formules
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={submitting || !isFormValid()}
            loading={submitting}
          >
            <SaveOutlined /> Enregistrer
          </Button>
          <Button onClick={handleReset}>
            <ReloadOutlined /> Réinitialiser
          </Button>
          <Button onClick={onCancel}>Annuler</Button>
        </div>
      </Form>

      <Modal
        title="Définir les formules"
        open={isCalculatorModalVisible}
        onCancel={() => setIsCalculatorModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsCalculatorModalVisible(false)}>
            Annuler
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={handleAddFormula}
            disabled={!newFormulaKey || newFormulaExpression.length < 3}
          >
            Ajouter cette formule
          </Button>,
        ]}
        width={800}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <strong>Instructions</strong>
            <p>
              Définissez les formules pour les calculs. Une formule nommée "roi" est obligatoire. Exemple : Revenu Total
              / Coût Total
            </p>
          </div>
          <div>
            <strong>Nom de la formule*</strong>
            <Input
              placeholder="ex: roi, revenu_total, cout_total"
              value={newFormulaKey}
              onChange={e => setNewFormulaKey(e.target.value)}
            />
            <span style={{ color: '#999', fontSize: 12 }}>Pour le ROI, incluez le mot "roi" dans le nom</span>
          </div>
          <div>
            <strong>Expression de la formule*</strong>
            <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, minHeight: 40, marginBottom: 8 }}>
              {newFormulaExpression.length > 0 ? (
                renderExpression(newFormulaExpression)
              ) : (
                <span style={{ color: '#999' }}>Construisez votre expression en utilisant les boutons ci-dessous</span>
              )}
            </div>
            <Button
              type="primary"
              onClick={removeLastExpressionElement}
              disabled={newFormulaExpression.length === 0}
              icon={<CloseCircleOutlined />}
            >
              Effacer dernier
            </Button>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <strong>Éléments disponibles</strong>
              <Select
                style={{ width: '100%' }}
                placeholder="Sélectionnez un élément"
                options={getAllElementsForSelection()}
                onSelect={(value, option) => addExpressionElement(option.type, value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <strong>Valeur constante</strong>
              <div style={{ display: 'flex', gap: 8 }}>
                <Input id="constantValue" placeholder="ex: 100" />
                <Button
                  icon={<NumberOutlined />}
                  onClick={() => {
                    const value = (document.getElementById('constantValue') as HTMLInputElement).value;
                    if (value && !isNaN(Number(value))) {
                      addExpressionElement('constant', parseFloat(value));
                      (document.getElementById('constantValue') as HTMLInputElement).value = '';
                    } else {
                      message.error('Veuillez entrer un nombre valide');
                    }
                  }}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
          <div>
            <strong>Opérateurs</strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <Button onClick={() => addExpressionElement('operator', 'add')} style={{ height: 40 }}>
                Addition (+)
              </Button>
              <Button onClick={() => addExpressionElement('operator', 'subtract')} style={{ height: 40 }}>
                Soustraction (-)
              </Button>
              <Button onClick={() => addExpressionElement('operator', 'multiply')} style={{ height: 40 }}>
                Multiplication (×)
              </Button>
              <Button onClick={() => addExpressionElement('operator', 'divide')} style={{ height: 40 }}>
                Division (÷)
              </Button>
            </div>
          </div>
          {Object.keys(formulat).length > 0 && (
            <div>
              <strong>Formules définies</strong>
              <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                {Object.entries(formulat).map(([key, expression]) => (
                  <div key={key} style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        <strong>{key}</strong> = {renderExpression(parseExpression(expression))}
                      </span>
                      <Button
                        size="small"
                        danger
                        onClick={() => {
                          const newFormulat = { ...formulat };
                          delete newFormulat[key];
                          setFormulat(newFormulat);
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </Modal>
  );
};

const ActivityDisplay: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isItemsModalVisible, setIsItemsModalVisible] = useState(false);
  const [isFormulaModalVisible, setIsFormulaModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ActivityItem[]>([]);
  const [selectedFormula, setSelectedFormula] = useState<{ key: string; expression: string }[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<DataType | null>(null);
  const navigate = useNavigate();

  // Récupération des données
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get('/getAllActivitiesInfo');
        console.log('Données reçues:', response.data);
        if (response.data.success) {
          const formattedData = response.data.data.map((activity: Activity) => ({
            key: activity.activity.id.toString(),
            name: activity.activity.name,
            is_custom: activity.activity.is_custom,
            description: activity.activity.description,
            items: activity.items,
            formula: activity.formula,
            showItemsModal: () => {
              setSelectedItems(activity.items);
              setIsItemsModalVisible(true);
            },
            showFormulaModal: () => {
              if (activity.formula) {
                const formulaData = Object.entries(activity.formula.formulat).map(([key, expression]) => ({
                  key,
                  expression,
                }));
                setSelectedFormula(formulaData);
                setIsFormulaModalVisible(true);
              }
            },
            showEditModal: () => {
              setSelectedActivity({
                key: activity.activity.id.toString(),
                name: activity.activity.name,
                is_custom: activity.activity.is_custom,
                description: activity.activity.description,
                items: activity.items,
                formula: activity.formula,
                showItemsModal: () => {},
                showFormulaModal: () => {},
                showEditModal: () => {},
              });
              setIsEditModalVisible(true);
            },
          }));
          setData(formattedData);
        } else {
          setError(response.data.message || 'Échec du chargement des activités');
          message.error(response.data.message || 'Échec du chargement des activités');
        }
      } catch (err: any) {
        console.error('Erreur lors de la récupération des activités:', err);
        setError(err.response?.data?.message || 'Erreur lors de la récupération des activités');
        message.error(err.response?.data?.message || 'Erreur lors de la récupération des activités');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Gestion des modales
  const handleItemsModalOk = () => {
    setIsItemsModalVisible(false);
    setSelectedItems([]);
  };

  const handleItemsModalCancel = () => {
    setIsItemsModalVisible(false);
    setSelectedItems([]);
  };

  const handleFormulaModalOk = () => {
    setIsFormulaModalVisible(false);
    setSelectedFormula([]);
  };

  const handleFormulaModalCancel = () => {
    setIsFormulaModalVisible(false);
    setSelectedFormula([]);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedActivity(null);
  };

  const handleActivityUpdate = () => {
    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get('/getAllActivitiesInfo');
        if (response.data.success) {
          const formattedData = response.data.data.map((activity: Activity) => ({
            key: activity.activity.id.toString(),
            name: activity.activity.name,
            is_custom: activity.activity.is_custom,
            description: activity.activity.description,
            items: activity.items,
            formula: activity.formula,
            showItemsModal: () => {
              setSelectedItems(activity.items);
              setIsItemsModalVisible(true);
            },
            showFormulaModal: () => {
              if (activity.formula) {
                const formulaData = Object.entries(activity.formula.formulat).map(([key, expression]) => ({
                  key,
                  expression,
                }));
                setSelectedFormula(formulaData);
                setIsFormulaModalVisible(true);
              }
            },
            showEditModal: () => {
              setSelectedActivity({
                key: activity.activity.id.toString(),
                name: activity.activity.name,
                is_custom: activity.activity.is_custom,
                description: activity.activity.description,
                items: activity.items,
                formula: activity.formula,
                showItemsModal: () => {},
                showFormulaModal: () => {},
                showEditModal: () => {},
              });
              setIsEditModalVisible(true);
            },
          }));
          setData(formattedData);
        }
      } catch (err: any) {
        console.error('Erreur lors du refresh:', err);
      }
    };
    fetchActivities();
  };

  const handleCreateLabo = () => {
    navigate('../AddActivity');
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Liste des activités</h1>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreateLabo}>
          Créer Activité
        </Button>
      </div>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '4px', marginBottom: '16px' }}>
          <p style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
      <Modal
        title="Détails des items"
        open={isItemsModalVisible}
        onOk={handleItemsModalOk}
        onCancel={handleItemsModalCancel}
        width={800}
        footer={[
          <Button key="close" onClick={handleItemsModalCancel}>
            Fermer
          </Button>,
        ]}
      >
        <Table columns={itemColumns} dataSource={selectedItems} pagination={false} rowKey="id" scroll={{ x: 'max-content' }} />
      </Modal>
      <Modal
        title="Détails de la formule"
        open={isFormulaModalVisible}
        onOk={handleFormulaModalOk}
        onCancel={handleFormulaModalCancel}
        width={800}
        footer={[
          <Button key="close" onClick={handleFormulaModalCancel}>
            Fermer
          </Button>,
        ]}
      >
        <Table
          columns={formulaColumns}
          dataSource={selectedFormula}
          pagination={false}
          rowKey="key"
          scroll={{ x: 'max-content' }}
        />
      </Modal>
      <EditActivityModal
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        activity={selectedActivity}
        onSave={handleActivityUpdate}
      />
    </div>
  );
};

export default ActivityDisplay;