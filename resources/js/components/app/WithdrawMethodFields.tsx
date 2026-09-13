import { Input } from '@/components/ui/Input';
import type { WithdrawMethod } from '@/services/withdrawService';

export interface MethodFieldDef {
    key: string;
    label: string;
}

const FIELDS_BY_METHOD: Record<WithdrawMethod, MethodFieldDef[]> = {
    'Bank Transfer': [
        { key: 'accountTitle', label: 'Account Title' },
        { key: 'accountNumber', label: 'Account Number' },
        { key: 'bankName', label: 'Bank Name' },
    ],
    Easypaisa: [{ key: 'mobileNumber', label: 'Easypaisa Mobile Number' }],
    JazzCash: [{ key: 'mobileNumber', label: 'JazzCash Mobile Number' }],
    Crypto: [{ key: 'walletAddress', label: 'Wallet Address' }],
    USDT: [{ key: 'walletAddress', label: 'USDT (TRC20) Address' }],
};

export interface WithdrawMethodFieldsProps {
    method: WithdrawMethod;
    values: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

export function WithdrawMethodFields({ method, values, onChange }: WithdrawMethodFieldsProps) {
    return (
        <div className="space-y-4">
            {FIELDS_BY_METHOD[method].map((field) => (
                <Input
                    key={field.key}
                    label={field.label}
                    required
                    value={values[field.key] ?? ''}
                    onChange={(e) => onChange(field.key, e.target.value)}
                />
            ))}
        </div>
    );
}

export function formatAccountDetails(method: WithdrawMethod, values: Record<string, string>): string {
    return FIELDS_BY_METHOD[method].map((field) => values[field.key] ?? '').join(' / ');
}
