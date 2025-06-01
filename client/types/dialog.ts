/**
 * Dialog types
 */

export interface ConfirmationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    itemName?: string;
    itemType?: string;
    isLoading?: boolean;
}
