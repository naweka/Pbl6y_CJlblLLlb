
import { LabelProps } from '@radix-ui/react-label';
import { UseControllerProps } from 'react-hook-form';
import { Input, InputProps } from '../../../Input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField } from '../Form';
import { cn } from '@/shared/lib';
import { BaseFieldProps } from '../../types';
import { AssignComponent } from '@/shared/types';

interface BaseFieldInputProps
    extends Omit<InputProps, 'defaultValue' | 'name' | 'type'>,
    BaseFieldProps,
    UseControllerProps {
    labelProps?: LabelProps;
    descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
    messageProps?: React.HTMLAttributes<HTMLParagraphElement>;
    defaultValue?: string;
}

export const BaseFieldInput: AssignComponent<'input', BaseFieldInputProps> = ({
    as = Input,
    label,
    description,
    name,
    defaultValue = '',
    disabled,
    rules,
    shouldUnregister,
    labelProps,
    descriptionProps,
    messageProps,
    ...inputProps
}) => {
    const form = useFormField();
    const Comp = as;
    return (
        <FormField
            control={form.control}
            name={name}
            defaultValue={defaultValue}
            disabled={disabled}
            rules={rules}
            shouldUnregister={shouldUnregister}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        {...labelProps}
                        className={cn(labelProps?.className)}
                    >
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Comp disabled={disabled} {...inputProps} {...field} />
                    </FormControl>
                    <FormDescription {...descriptionProps}>{description}</FormDescription>
                    <FormMessage {...messageProps} />
                </FormItem>
            )}
        />
    );
};