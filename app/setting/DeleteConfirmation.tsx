import React from 'react'

interface DeleteConfirmationProps {
  onCancel: () => void
  onConfirm: () => void
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="modal-overlay">
      <div className="delete-confirmation-dialog">
        <p>데이터를 영구 삭제 하시겠습니까?</p>
        <div className="button-container">
          <button className="confirm-button" onClick={onConfirm}>
            확인
          </button>
          <button className="cancel-button" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
      <style jsx>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .delete-confirmation-dialog {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .button-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }

          .confirm-button {
            background-color: #ecedf1;
            color: black;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            margin-right: 10px;
          }

          .cancel-button {
            background-color: #eeb9be;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
          }
        `}
      </style>
    </div>
  )
}

export default DeleteConfirmation
