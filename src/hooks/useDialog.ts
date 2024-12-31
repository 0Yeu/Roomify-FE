import { useState } from 'react';

interface IUseDialog {
  isVisible?: boolean;
  onOpenDialog?(): void;
  onCloseDialog?(): void;
  onConfirmDialog?(): void | Promise<void>;
}

const useDialog = ({
  isVisible: isVisibleProps,
  onOpenDialog,
  onCloseDialog,
  onConfirmDialog,
}: IUseDialog) => {
  const [isVisible, setIsVisible] = useState(isVisibleProps || false);

  const onClickDialogCloseBtn = () => {
    onCloseDialog?.();
    setIsVisible(false);
  };

  const onClickDialogOkBtn = () => {
    onConfirmDialog?.();
    setIsVisible(false);
  };

  const onPressBtnToOpenDialog = () => {
    onOpenDialog?.();
    setIsVisible(true);
  };

  return {
    isVisible,
    onClickDialogCloseBtn,
    onClickDialogOkBtn,
    onPressBtnToOpenDialog,
  };
};

export default useDialog;
