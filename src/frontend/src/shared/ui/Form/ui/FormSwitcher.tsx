import { FC } from 'react';
import { FieldTypes, FormSwitcherProps } from '../types';
import { BaseForm } from '.';

const MapComponent: Record<FieldTypes, FC<FormSwitcherProps>> = {
    [FieldTypes.Input]: (props) => <BaseForm.BaseFieldInput {...props} />,
};

export const FormSwitcher: FC<FormSwitcherProps> = (field) => {
    const { component } = field;
    const Component = MapComponent[component] ?? null;
    if (!Component) return null;
    return <Component {...field} />;
};