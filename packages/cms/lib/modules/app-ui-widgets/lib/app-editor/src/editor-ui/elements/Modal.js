
const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <a class="modal-close" href="#">✕</a>
      </section>
    </div>
  );
};

export default Modal;
