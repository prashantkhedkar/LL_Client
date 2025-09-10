import React, { useState } from 'react'
import {
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    IconButton,
    Divider
} from '@mui/material'
import { Modal, Row, Col } from "react-bootstrap"
import { GlobalLabel } from "../../components/common/label/LabelCategory"
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'
import EditIcon from '@mui/icons-material/Edit'
import { useLang } from "../../../../_metronic/i18n/Metronici18n"
import { BtnLabelCanceltxtMedium2, HeaderLabels, LabelTextSemibold2 } from '../../components/common/formsLabels/detailLabels'
import DropdownList from "../../components/dropdown/DropdownList"
import './ActionsDisplay.css'
import { generateUUID } from '../../utils/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AccessTimeSharpIcon from '@mui/icons-material/AccessTimeSharp';

interface Action {
    id: number
    text: string
    timestamp?: string
    status?: 'completed' | 'pending' | 'cancelled'
}

interface ActionsDisplayProps {
    actions?: Action[]
    onAddAction?: () => void
    onEditAction?: (actionId: number) => void
    onDeleteAction?: (actionId: number) => void
}

const ActionsDisplay: React.FC<ActionsDisplayProps> = ({
    actions = [],
    onAddAction,
    onEditAction,
    onDeleteAction
}) => {
    const lang = useLang()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedReason, setSelectedReason] = useState('')
    const [editingActionId, setEditingActionId] = useState<number | null>(null)

    // Status options for dropdown
    const statusOptions = [
        { lookupId: '1', lookupNameAr: 'تم التنفيذ', lookupName: 'Executed' },
        { lookupId: '2', lookupNameAr: 'قيد التنفيذ', lookupName: 'Pending' },
        { lookupId: '3', lookupNameAr: 'ملغي', lookupName: 'Cancelled' }
    ]

    const [actionsList, setActionsList] = useState<Action[]>(actions.length > 0 ? actions : [
        {
            id: 1,
            text: "إن المؤسسة العسكرية التي ساهم في بنائها صاحب السمو الشيخ محمد بن زايد آل نهيان رئيس الدولة القائد الأعلى للقوات المسلحة حفظه الله وساندها أخيه صاحب السمو الشيخ محمد بن راشد آل مكتوم نائب",
            timestamp: "2025/02/20",
            status: "completed"
        }
    ])

    const handleAddAction = () => {
        setEditingActionId(null) // null means we're adding, not editing
        setSelectedStatus('')
        setSelectedReason('')
        setIsEditModalOpen(true)
    }

    const handleEditAction = (actionId: number) => {
        setEditingActionId(actionId)
        // Load existing action data if needed
        const action = actionsList.find(a => a.id === actionId)
        if (action) {
            setSelectedStatus(action.status || '')
            setSelectedReason('') // Load existing reason if you have it
        }
        setIsEditModalOpen(true)
        if (onEditAction) {
            onEditAction(actionId)
        }
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setSelectedStatus('')
        setSelectedReason('')
        setEditingActionId(null)
    }

    const handleSave = () => {
        if (editingActionId === null) {
            // Adding new action
            const newAction: Action = {
                id: actionsList.length + 1,
                text: selectedReason || "إجراء جديد...",
                timestamp: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
                status: selectedStatus as 'completed' | 'pending' | 'cancelled' || 'pending'
            }
            setActionsList([...actionsList, newAction])
            if (onAddAction) {
                onAddAction()
            }
        } else {
            // Editing existing action
            setActionsList(actionsList.map(action => 
                action.id === editingActionId 
                    ? { ...action, status: selectedStatus as 'completed' | 'pending' | 'cancelled' || action.status }
                    : action
            ))
        }
        handleCloseModal()
    }

    const handleDeleteAction = (actionId: number) => {
        setActionsList(actionsList.filter(action => action.id !== actionId))
        if (onDeleteAction) {
            onDeleteAction(actionId)
        }
    }

    const getStatusIcon = (status: string) => {
        const iconClass = `status-icon ${status || 'default'}`
        switch (status) {
            case 'completed':
                return <CheckCircleOutlineIcon className={iconClass} />
            case 'pending':
                return <AccessTimeIcon className={iconClass} />
            case 'cancelled':
                return <CancelOutlinedIcon className={iconClass} />
            default:
                return <AccessTimeIcon className={iconClass} />
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'تم التنفيذ'
            case 'pending':
                return 'قيد التنفيذ'
            case 'cancelled':
                return 'ملغي'
            default:
                return 'غير محدد'
        }
    }

    return (
        <>
        <Box className="actions-display-container">
            

            {/* Actions List */}
            <Box className="actions-list">
                {actionsList.map((action, index) => (
                    <Card
                        key={action.id}
                        className="action-card"
                    >
                        <CardContent className="action-card-content">
                            {/* Action Header */}
                            <Box className="action-header">

                                <LabelTextSemibold2
                                    text={`الإجراء ${index + 1}`}
                                />
                                {/* Action Icons and Status */}
                                <Box className="action-controls">
                                    {/* Status Badge */}
                                    <Box className={`status-badge ${action.status || 'default'}`}>
                                        {getStatusIcon(action.status || 'pending')}
                                        <Typography
                                            variant="caption"
                                            className={`status-text ${action.status || 'default'}`}
                                        >
                                            {getStatusText(action.status || 'pending')}
                                        </Typography>
                                    </Box>

                                    {/* Action Icons */}
                                    <Box className="action-icons">
                                        <IconButton
                                            onClick={() => console.log('View action:', action.id)}
                                            size="small"
                                            className="action-icon-button"
                                        >
                                            <VisibilityOutlinedIcon className="action-icon" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleEditAction(action.id)}
                                            size="small"
                                            className="action-icon-button edit"
                                        >
                                            <EditOutlinedIcon className="action-icon" />
                                        </IconButton>
                                        {/* <IconButton
                                            onClick={() => handleDeleteAction(action.id)}
                                            size="small"
                                            className="action-icon-button delete"
                                        >
                                            <DeleteOutlineIcon className="action-icon" />
                                        </IconButton> */}
                                    </Box>
                                </Box>
                            </Box>

                            {/* Action Content */}
                            <Box className="action-content">
                                <Typography
                                    variant="body1"
                                    className="action-text"
                                >
                                    {action.text}
                                </Typography>

                                {/* Action Footer */}
                                <Box className="action-footer">
                                    {/* Left side - By */}
                                    <Box className="action-footer-item">
                                        <PersonIcon className="action-footer-icon" />
                                        <Typography variant="caption" className="action-footer-label">
                                            بواسطة :
                                        </Typography>
                                        <Typography variant="caption" className="action-footer-value">
                                            القوات البرية
                                        </Typography>
                                         <Box className="action-footer-center">
                                        <IconButton
                                            onClick={() => handleEditAction(action.id)}
                                            size="small"
                                            className="action-footer-edit-button"
                                        >
                                            <EditIcon className="action-footer-edit-icon" />
                                        </IconButton>
                                    </Box>

                                    </Box>

                                    {/* Center - Edit Icon */}
                                   
                                    {/* Right side - Date */}
                                    {action.timestamp && (
                                        <Box className="action-footer-item">
                                          
                                            <Typography variant="caption" className="action-footer-label">
                                                تاريخ الإجراء :
                                            </Typography>
                                              <CalendarTodayIcon className="action-footer-icon" />
                                            <Typography variant="caption" className="action-footer-value">
                                                {action.timestamp}
                                            </Typography>
                                             <AccessTimeSharpIcon className="action-footer-icon" />
                                            <Typography variant="caption" className="action-footer-value">
                                                {action.timestamp}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Add Action Button - Show after all actions or in empty state */}
            {actionsList.length > 0 && (
                <Box className="add-action-container">
                     
                    <button
                      onClick={handleAddAction}
                      className="btn MOD_btn btn-add min-w-75px w-100 align-self-end px-6"
                      id={generateUUID()}
                     
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        size="lg"
                      ></FontAwesomeIcon>
                      <BtnLabelCanceltxtMedium2
                        text={"إضافة إجراء"}
                      />
                    </button>
                </Box>
            )}

            {/* Empty State */}
            {actionsList.length === 0 && (
                <Box className="empty-state">
                    <Typography variant="body1" className="empty-state-text">
                        لا توجد إجراءات متاحة
                    </Typography>
                    <Button
                        onClick={handleAddAction}
                        variant="outlined"
                        startIcon={<AddIcon />}
                        className="empty-state-button"
                    >
                        إضافة أول إجراء
                    </Button>
                </Box>
            )}
        </Box>

        {/* Edit/Add Modal */}
        <Modal
            className="modal-sticky modal-sticky-lg modal-sticky-bottom-right"
            backdrop="static"
            keyboard={false}
            centered
            size="lg"
            animation={false}
            enforceFocus={false}
            dialogClassName="modal-dialog-scrollable"
            aria-labelledby="contained-modal-title-vcenter"
            show={isEditModalOpen}
            onHide={handleCloseModal}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <HeaderLabels
                        text={editingActionId === null ? "إضافة إجراء جديد" : "تعديل حالة الاجراء"}
                    />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Status Dropdown */}
                <Row className="mb-4 px-4">
                    <Col className={"col-2"}>
                        <GlobalLabel value="الحالة" />
                    </Col>
                    <Col className={"col-10 align-self-center"}>
                        <DropdownList
                            dataKey="lookupId"
                            dataValue={lang === "ar" ? "lookupNameAr" : "lookupName"}
                            defaultText={lang === "ar" ? "اختر" : "Select"}
                            value={selectedStatus}
                            data={statusOptions}
                            setSelectedValue={(value) => {
                                console.log('Setting selected value:', value);
                                setSelectedStatus(value);
                            }}
                        />
                    </Col>
                </Row>

                {/* Reasons Multiline Textbox */}
                <Row className="mb-4 px-4">
                    <Col className={"col-2"}>
                        <GlobalLabel value={editingActionId === null ? "وصف الإجراء" : "الاسباب"} />
                    </Col>
                    <Col className={"col-10 align-self-center"}>
                        <textarea
                            rows={4}
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            placeholder={editingActionId === null ? "أدخل وصف الإجراء" : "ادخل الأسباب"}
                            className="modal-textarea"
                        />
                    </Col>
                </Row>

                {/* Action Buttons */}
                <div className="d-flex justify-content-start gap-3 mt-4 px-4">
                    <Button 
                        onClick={handleSave}
                        variant="contained" 
                        className="modal-save-button"
                    >
                        {editingActionId === null ? "إضافة" : "حفظ"}
                    </Button>
                    <Button 
                        onClick={handleCloseModal}
                        variant="outlined" 
                        className="modal-cancel-button"
                    >
                        الغاء
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default ActionsDisplay
