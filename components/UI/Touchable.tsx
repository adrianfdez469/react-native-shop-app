import React, { FC } from 'react';
import { Platform, TouchableOpacity, TouchableNativeFeedback, TouchableOpacityProps, TouchableNativeFeedbackProps } from 'react-native';

type TouchablePropTypes = TouchableOpacityProps | TouchableNativeFeedbackProps;

const CurtomTouchable: FC<TouchablePropTypes> = props => {

    if (Platform.OS === "android" && Platform.Version >= 21) {
        return <TouchableNativeFeedback {...props}>
            {props.children}
        </TouchableNativeFeedback>
    }

    return <TouchableOpacity {...props}>
        {props.children}
    </TouchableOpacity>;

}
export default CurtomTouchable;