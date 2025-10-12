import { Modal, Button } from "react-bootstrap";

export default function ConfirmModal({
  show,
  onClose,
  title = "Xác nhận",
  message = "Bạn có chắc chắn không?",
  yesText = "Đồng ý",
  noText = "Hủy",
  onYes,
  onNo,
}) {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            onNo?.();
            onClose?.();
          }}
        >
          {noText}
        </Button>
        <Button
          variant="success"
          onClick={() => {
            onYes?.();
            onClose?.();
          }}
        >
          {yesText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
