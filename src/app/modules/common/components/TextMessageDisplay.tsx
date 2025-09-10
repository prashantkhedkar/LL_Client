import React, { useState } from 'react'
import Recommendation from './Recommendation'
import dayjs from 'dayjs'
import {KTSVG} from '../../../../_metronic/helpers'
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material'
import { Modal, Row, Col } from "react-bootstrap"
import { GlobalLabel } from "../../components/common/label/LabelCategory"
import { useIntl } from "react-intl"
import { useLang } from "../../../../_metronic/i18n/Metronici18n"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import { HeaderLabels } from '../../components/common/formsLabels/detailLabels'
import DropdownList from "../../components/dropdown/DropdownList"

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
interface TextMessageDisplayProps {
  text: string
  timestamp?: string | Date
  status?: 'sent' | 'delivered' | 'read'
  direction?: 'rtl' | 'ltr'
  className?: string
  index?: number
  observationId?: string | number
  recommendationId?: number
  onEditClick?: () => void
}

const TextMessageDisplay: React.FC<TextMessageDisplayProps> = ({
  text,
  timestamp,
  status = 'sent',
  direction = 'rtl',
  className = '',
  index = 1,
  observationId = 1,
  recommendationId,
  onEditClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedReason, setSelectedReason] = useState('')
  const intl = useIntl()
  const lang = useLang()

  // Debug logging
  console.log('TextMessageDisplay rendered with:', { 
    recommendationId, 
    onEditClick: !!onEditClick,
    text: text.substring(0, 50) + '...'
  });

  // Status options for dropdown
  const statusOptions = [
    { lookupId: '1', lookupNameAr: 'تم التنفيذ', lookupName: 'Executed' },
    { lookupId: '2', lookupNameAr: 'قيد التنفيذ', lookupName: 'Pending' },
    { lookupId: '3', lookupNameAr: 'ملغي', lookupName: 'Cancelled' }
  ]

 

  const handleEditClick = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setSelectedStatus('')
    setSelectedReason('')
  }

  const handleSave = () => {
    // Handle save logic here
    console.log('Status:', selectedStatus, 'Reason:', selectedReason)
    handleCloseModal()
  }

  return (
    <>
      <Accordion 
        expanded={isExpanded}
        onChange={() => setIsExpanded(!isExpanded)}
        className={`mb-5 ${className}`}
        sx={{
          border: '1px solid #8c87872e',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)',
          '& .MuiAccordionSummary-root': {
            direction: 'rtl',
            borderBottom: '1px solid #E4E6EF',
            backgroundColor: '#ffffff'
          },
          '& .MuiAccordionDetails-root': {
            direction: 'rtl',
            padding: 0,
            backgroundColor: '#ffffff'
          }
        }}
      >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
        className="py-2"
        sx={{
          margin: '0 !important',
          '&.MuiAccordionSummary-root': {
            margin: '0 !important',
            minHeight: 'unset',
            padding: '0 8px',
            '&.Mui-expanded': {
              minHeight: 'unset',
            }
            
          },
          '& .MuiAccordionSummary-content': {
            margin: '0 !important',
             padding: '8px 0',
          }
        }}
      >
        <div className="w-100 d-flex justify-content-between align-items-center">
          <h3 className="fw-bold m-0 text-gray-800">{`الجزء ${index}`}www</h3>
          <div className="d-flex align-items-center me-3" style={{ gap: '15px', borderLeft: '1px solid #E2E2E2',paddingLeft: '10px' }}>
            <EditOutlinedIcon 
              onClick={(e) => {
                e.stopPropagation(); // Prevent accordion toggle
                console.log('Edit icon clicked in TextMessageDisplay', { onEditClick, recommendationId });
                if (onEditClick) {
                  onEditClick();
                }
              }}
              sx={{ 
                fontSize: 20, 
               
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }} 
            />
            <DeleteOutlineIcon 
              onClick={(e) => {
                e.stopPropagation(); // Prevent accordion toggle
               // handleDeleteClick();
              }}
              sx={{ 
                fontSize: 20, 
                cursor: 'pointer',
                '&:hover': { color: 'error.main' }
              }} 
            />
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        {/* Main Content */}
        <div className="p-4">
          <div className="fs-4 fw-normal text-gray-800 mb-5 text-right">
            {text}
          </div>
         
          {/* Footer with three sections */}
          <div className="d-flex justify-content-between align-items-center border-top" 
               style={{ 
                 padding: '12px 16px', 
                 borderTop: '1px solid #E4E6EF' 
               }}>
            {/* First section - By and Action Icons */}
            <div className="d-flex align-items-center gap-4">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted fs-7">بواسطة :</span>
                <span className="text-gray-800 fs-7">القوات البرية</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <VisibilityOutlinedIcon 
                  sx={{ 
                    fontSize: 20, 
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' }
                  }} 
                />
                <EditOutlinedIcon 
                 onClick={handleEditClick}
                  sx={{ 
                    fontSize: 20, 
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' }
                  }} 
                />
              </div>
            </div>

            {/* Second section - Execution Status */}
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted fs-7">حالة التنفيذ :</span>
              <div className="d-flex align-items-center gap-1">
                <span className="text-success fs-7">تم التنفيذ</span>
                <CheckCircleOutlineIcon
                  sx={{ 
                    fontSize: 20,
                    color: 'success.main'
                  }}
                />
              </div>
            </div>

            {/* Third section - Date and Time */}
            {timestamp && (
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center">
                  <span className="text-muted fs-7">تاريخ الاجراء :</span>
                  <span className="text-gray-800 fs-7 me-2">{dayjs(timestamp).format('YYYY/MM/DD')}</span>
                </div>
                <div className="d-flex align-items-center">
                  <AccessTimeIcon
                    sx={{ 
                      fontSize: 20,
                      color: 'text.secondary',
                      marginRight: 1
                    }}
                  />
                  <span className="text-gray-800 fs-7">{dayjs(timestamp).format('HHmm')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </AccordionDetails>
    </Accordion>

    {/* Edit Modal */}
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
                        text={
                          "تعديل حالة الاجراء"
                        }
                      />
        </Modal.Title>
      </Modal.Header>
            <Modal.Body>
        {/* Status Dropdown */}
        <Row className="mb-4 px-4">
          <Col className={"col-2"}>
            <GlobalLabel
              value="الحالة"
            />
          </Col>
          <Col className={"col-10 align-self-center"}>
          {JSON.stringify(statusOptions)}
            <DropdownList
              dataKey="lookupId"
              dataValue={lang === "ar" ? "lookupName" : "lookupName"}
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
            <GlobalLabel
              value="الاسباب"
            />
          </Col>
          <Col className={"col-10 align-self-center"}>
            <textarea
              rows={4}
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              placeholder="ادخل"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 16,
                borderRadius: 4,
                border: "1px solid #ccc",
                marginTop: 4,
                outline: "none",
                boxSizing: "border-box",
                resize: "vertical",
                textAlign: "right",
                direction: "rtl"
              }}
            />
          </Col>
        </Row>

        {/* Action Buttons */}
        <div className="d-flex justify-content-start gap-3 mt-4 px-4">
          <Button 
            onClick={handleSave}
            variant="contained" 
            sx={{ 
              backgroundColor: '#B8956A',
              color: 'white',
              borderRadius: '8px',
              px: 4,
              '&:hover': {
                backgroundColor: '#A0825A'
              }
            }}
          >
            حفظ
          </Button>
          <Button 
            onClick={handleCloseModal}
            variant="outlined" 
            sx={{ 
              borderColor: '#ddd',
              color: '#666',
              borderRadius: '8px',
              px: 4,
              '&:hover': {
                borderColor: '#ccc',
                backgroundColor: '#f9f9f9'
              }
            }}
          >
            الغاء
          </Button>
        </div>
      </Modal.Body>
    </Modal>
    </>
  )
}

export default TextMessageDisplay